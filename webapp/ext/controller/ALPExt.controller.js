sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension",
	"sap/m/IllustratedMessage",
	"sap/m/MessageBox",
	"sap/m/BusyDialog",
	"sap/ui/core/InvisibleMessage",
	"sap/ui/core/library",
	"sap/ui/Device"
], function (ControllerExtension, IllustratedMessage, MessageBox, BusyDialog, InvisibleMessage, coreLibrary, Device) {
	"use strict";

	return ControllerExtension.extend("mindtek.journalentry.monitor.ext.controller.ALPExt", {
		override: {
			onInit: function () {
				this.onExportPdf = onExportPdf;
				this.getView().addEventDelegate({
					onAfterRendering: enhanceTable.bind(this)
				});
			},

			/**
			 * Fired when the ALP filter bar is initialised. Phone layouts always
			 * keep the Go button, so live mode never binds the chart or table there.
			 */
			onInitSmartFilterBarExtension: function () {
				loadDataOnEntry.call(this);
			}
		},

		onExportPdf: onExportPdf
	});

	function enhanceTable() {
		attachNoDataIllustration.call(this);
		enableClientExcelExport.call(this);
		enableMobileChartSelection.call(this);
		loadDataOnEntry.call(this);
	}

	function loadDataOnEntry() {
		var oFilterBar = this.getView().byId("template::SmartFilterBar");
		if (!oFilterBar || oFilterBar.data("jemAutoLoad")) {
			return;
		}
		oFilterBar.data("jemAutoLoad", true);
		var fnSearch = function () {
			if (typeof oFilterBar.search === "function") {
				oFilterBar.search();
			}
		};
		if (oFilterBar.isInitialised && oFilterBar.isInitialised()) {
			fnSearch();
		} else if (oFilterBar.attachInitialized) {
			oFilterBar.attachInitialized(fnSearch);
		} else {
			oFilterBar.attachEventOnce("initialise", fnSearch);
		}
	}

	function enableMobileChartSelection() {
		var oSmartChart = this.getView().byId("chart");
		if (!oSmartChart || oSmartChart.data("jemChartSelect") || typeof oSmartChart.getChartAsync !== "function") {
			return;
		}
		oSmartChart.data("jemChartSelect", true);
		oSmartChart.getChartAsync().then(function (oChart) {
			if (!oChart) {
				return;
			}
			if (typeof oChart.setSelectionMode === "function") {
				oChart.setSelectionMode("MULTIPLE");
			}
			if (typeof oChart.setVizProperties === "function") {
				oChart.setVizProperties({
					interaction: {
						selectability: {
							mode: "multiple",
							plotStdSelection: true
						}
					}
				});
			}
			oChart.attachSelectData(onChartSelectData.bind(this));
		}.bind(this));
	}

	/**
	 * Phone and tablet layouts show the chart without the table. A data-point
	 * tap writes the selected dimension into the filter bar and opens the list.
	 */
	function onChartSelectData(oEvent) {
		var oView = this.getView();
		var oPriv = oView.getModel("_templPriv");
		if (!oPriv || oPriv.getProperty("/alp/contentView") !== "chart") {
			return;
		}
		if (!Device.system.phone && !Device.system.tablet) {
			return;
		}
		var oFilterBar = oView.byId("template::SmartFilterBar");
		var oChart = oEvent.getSource();
		var aDims = oChart.getVisibleDimensions ? oChart.getVisibleDimensions() : [];
		var aPoints = oEvent.getParameter("data") || [];
		var oFilterData = oFilterBar.getFilterData() || {};
		var bApplied = false;
		aDims.forEach(function (sDim) {
			var aItems = [];
			aPoints.forEach(function (oPoint) {
				var vValue = oPoint.data && oPoint.data[sDim];
				if (vValue == null || vValue === "") {
					return;
				}
				if (!aItems.some(function (oItem) { return oItem.key === vValue; })) {
					aItems.push({ key: vValue });
				}
			});
			if (!aItems.length) {
				return;
			}
			oFilterData[sDim] = { items: aItems };
			bApplied = true;
		});
		if (!bApplied) {
			return;
		}
		oFilterBar.setFilterData(oFilterData);
		oPriv.setProperty("/alp/_ignoreChartSelections", true);
		oPriv.setProperty("/alp/contentView", "table");
		oFilterBar.search();
	}

	function attachNoDataIllustration() {
		var oView = this.getView();
		var oI18n = oView.getModel("i18n");
		if (!oI18n) {
			return;
		}
		oView.findAggregatedObjects(true, function (oControl) {
			return oControl.isA && oControl.isA("sap.ui.comp.smarttable.SmartTable");
		}).forEach(function (oSmartTable) {
			if (oSmartTable.data("jemNoDataApplied")) {
				return;
			}
			oSmartTable.setNoData(new IllustratedMessage({
				illustrationType: "sapIllus-NoEntries",
				title: oI18n.getProperty("noDataTitle"),
				description: oI18n.getProperty("noDataDescription")
			}));
			oSmartTable.data("jemNoDataApplied", true);
		});
	}

	function findSmartTable() {
		return this.getView().findAggregatedObjects(true, function (oControl) {
			return oControl.isA && oControl.isA("sap.ui.comp.smarttable.SmartTable");
		})[0];
	}

	function enableClientExcelExport() {
		var oSmartTable = findSmartTable.call(this);
		if (!oSmartTable || oSmartTable.data("jemExcelFix")) {
			return;
		}
		oSmartTable.attachBeforeExport(function (oEvent) {
			var oSettings = oEvent.getParameter("exportSettings");
			if (!oSettings) {
				return;
			}
			oSettings.worker = false;
			var oTable = oSmartTable.getTable();
			var oBinding = oTable && (oTable.getBinding("items") || oTable.getBinding("rows"));
			if (!oBinding) {
				return;
			}
			var aContexts = [];
			var iLength = oBinding.getLength && oBinding.getLength();
			if (typeof oBinding.getContexts === "function") {
				aContexts = oBinding.getContexts(0, iLength || 0) || [];
			}
			if (!aContexts.length && typeof oBinding.getAllCurrentContexts === "function") {
				aContexts = oBinding.getAllCurrentContexts() || [];
			}
			var aRows = aContexts.map(function (oCtx) {
				return oCtx.getObject();
			});
			if (aRows.length) {
				oSettings.dataSource = aRows;
			}
		});
		oSmartTable.data("jemExcelFix", true);
	}

	function onExportPdf() {
		var oI18n = this.getView().getModel("i18n");
		if (!window.pdfMake) {
			MessageBox.error(oI18n.getProperty("pdfUnavailable"));
			return;
		}

		var oSmartTable = findSmartTable.call(this);
		if (!oSmartTable) {
			MessageBox.error(oI18n.getProperty("pdfNoTable"));
			return;
		}

		var oTable = oSmartTable.getTable();
		var aRows = [];
		if (oTable.getSelectedContexts && oTable.getSelectedContexts().length) {
			aRows = oTable.getSelectedContexts();
		} else if (oTable.getBinding("items")) {
			aRows = oTable.getBinding("items").getContexts(0, 100);
		} else if (oTable.getBinding("rows")) {
			aRows = oTable.getBinding("rows").getContexts(0, 100);
		}

		if (!aRows.length) {
			MessageBox.information(oI18n.getProperty("pdfNoData"));
			return;
		}

		var oBusy = new BusyDialog({ text: oI18n.getProperty("pdfBusy") });
		oBusy.open();

		var aBody = [[
			oI18n.getProperty("itemId"),
			oI18n.getProperty("companyCode"),
			oI18n.getProperty("fiscalYearPeriod"),
			oI18n.getProperty("glAccount"),
			oI18n.getProperty("amountCompanyCode"),
			oI18n.getProperty("debitCredit")
		]];

		aRows.forEach(function (oCtx) {
			var o = oCtx.getObject();
			aBody.push([
				o.ID || "",
				o.CompanyCode || "",
				o.FiscalYearPeriod || "",
				(o.GLAccount || "") + " " + (o.GLAccountName || ""),
				String(o.AmountInCompanyCodeCurrency || "") + " " + (o.CompanyCodeCurrency || ""),
				o.ControllingDebitCreditCode || ""
			]);
		});

		window.pdfMake.createPdf({
			pageOrientation: "landscape",
			content: [
				{ text: oI18n.getProperty("appTitle"), style: "header" },
				{ text: oI18n.getProperty("pdfSubtitle"), margin: [0, 0, 0, 12] },
				{
					table: {
						headerRows: 1,
						widths: ["*", "auto", "auto", "*", "auto", "auto"],
						body: aBody
					}
				}
			],
			styles: {
				header: { fontSize: 16, bold: true, margin: [0, 0, 0, 8] }
			}
		}).download("journal-entry-monitor.pdf", function () {
			oBusy.close();
			InvisibleMessage.getInstance().announce(oI18n.getProperty("pdfDone"), coreLibrary.InvisibleMessageMode.Polite);
		});
	}
});

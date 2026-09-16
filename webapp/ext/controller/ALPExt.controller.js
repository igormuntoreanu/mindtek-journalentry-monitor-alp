sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/IllustratedMessage",
	"sap/m/MessageBox",
	"sap/m/BusyDialog",
	"sap/ui/core/InvisibleMessage",
	"sap/ui/core/library"
], function (Controller, IllustratedMessage, MessageBox, BusyDialog, InvisibleMessage, coreLibrary) {
	"use strict";

	return Controller.extend("mindtek.journalentry.monitor.ext.controller.ALPExt", {
		onInit: function () {
			this.getView().addEventDelegate({
				onAfterRendering: this._enhanceTable.bind(this)
			});
		},

		_enhanceTable: function () {
			this._attachNoDataIllustration();
			this._enableClientExcelExport();
		},

		_attachNoDataIllustration: function () {
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
		},

		_findSmartTable: function () {
			return this.getView().findAggregatedObjects(true, function (oControl) {
				return oControl.isA && oControl.isA("sap.ui.comp.smarttable.SmartTable");
			})[0];
		},

		_enableClientExcelExport: function () {
			var oSmartTable = this._findSmartTable();
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
		},

		onExportPdf: function () {
			var oI18n = this.getView().getModel("i18n");
			if (!window.pdfMake) {
				MessageBox.error(oI18n.getProperty("pdfUnavailable"));
				return;
			}

			var oSmartTable = this._findSmartTable();
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
});

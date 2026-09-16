sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log"
], function (MockServer, Log) {
	"use strict";

	function findBy(aData, fnMatch) {
		if (!aData) {
			return null;
		}
		for (var i = 0; i < aData.length; i++) {
			if (fnMatch(aData[i])) {
				return aData[i];
			}
		}
		return null;
	}

	function related(oMockServer, oItem, sNav) {
		if (!oItem) {
			return null;
		}
		if (sNav === "to_CompanyCode") {
			return findBy(oMockServer.getEntitySetData("A_CompanyCode"), function (o) {
				return o.CompanyCode === oItem.CompanyCode;
			});
		}
		if (sNav === "to_CurrentCostCenter" && oItem.CostCenter) {
			return findBy(oMockServer.getEntitySetData("A_CostCenter"), function (o) {
				return o.CostCenter === oItem.CostCenter && o.ControllingArea === oItem.ControllingArea;
			});
		}
		if (sNav === "to_CurrentProfitCenter" && oItem.ProfitCenter) {
			return findBy(oMockServer.getEntitySetData("A_ProfitCenter"), function (o) {
				return o.ProfitCenter === oItem.ProfitCenter && o.ControllingArea === oItem.ControllingArea;
			});
		}
		if (sNav === "to_GLAccountInChartOfAccounts") {
			return findBy(oMockServer.getEntitySetData("A_GLAccountInChartOfAccounts"), function (o) {
				return o.GLAccount === oItem.GLAccount && o.ChartOfAccounts === oItem.ChartOfAccounts;
			});
		}
		return null;
	}

	function enrichItem(oMockServer, oItem) {
		var oOut = Object.assign({}, oItem);
		["to_CompanyCode", "to_CurrentCostCenter", "to_CurrentProfitCenter", "to_GLAccountInChartOfAccounts"].forEach(function (sNav) {
			var oRelated = related(oMockServer, oItem, sNav);
			if (oRelated) {
				oOut[sNav] = oRelated;
			}
		});
		return oOut;
	}

	function attachNavigationHandlers(oMockServer) {
		var aRequests = oMockServer.getRequests();
		var sKey = "(?:\\(|%28)(?:'|%27)([^'%]+)(?:'|%27)(?:\\)|%29)";
		function respondOData(oXhr, oData) {
			oXhr.respond(200, {
				"Content-Type": "application/json;charset=utf-8",
				"DataServiceVersion": "2.0"
			}, JSON.stringify({ d: oData || {} }));
		}
		aRequests.unshift({
			method: "GET",
			path: new RegExp("A_JournalEntryItemBasic" + sKey + "(?:\\/|%2F)(to_CompanyCode|to_CurrentCostCenter|to_CurrentProfitCenter|to_GLAccountInChartOfAccounts)", "i"),
			response: function (oXhr, sId, sNav) {
				sId = decodeURIComponent(sId);
				var oItem = findBy(oMockServer.getEntitySetData("A_JournalEntryItemBasic"), function (o) {
					return o.ID === sId;
				});
				respondOData(oXhr, related(oMockServer, oItem, sNav));
			}
		});
		aRequests.unshift({
			method: "GET",
			path: new RegExp("A_JournalEntryItemBasic" + sKey + "(?!\\/|%2F)", "i"),
			response: function (oXhr, sId) {
				sId = decodeURIComponent(sId);
				var oItem = findBy(oMockServer.getEntitySetData("A_JournalEntryItemBasic"), function (o) {
					return o.ID === sId;
				});
				if (!oItem) {
					oXhr.respond(404, { "Content-Type": "application/json" }, JSON.stringify({ error: { message: { value: "not found" } } }));
					return;
				}
				respondOData(oXhr, enrichItem(oMockServer, oItem));
			}
		});
		oMockServer.setRequests(aRequests);
	}

	function requestUrl(resource) {
		if (typeof resource === "string") {
			return resource;
		}
		if (resource && resource.url) {
			return resource.url;
		}
		return "";
	}

	function jsonResponse(oBody) {
		return new Response(JSON.stringify(oBody), {
			status: 200,
			headers: {
				"Content-Type": "application/json;charset=utf-8",
				"DataServiceVersion": "2.0"
			}
		});
	}

	function installFetchInterceptor(oMockServer) {
		if (!window.fetch || window.fetch._jemPatched) {
			return;
		}
		var fnOriginalFetch = window.fetch.bind(window);
		var sService = "/sap/opu/odata/sap/API_JOURNALENTRYITEMBASIC_SRV/";
		window.fetch = function (resource, init) {
			var sUrl = requestUrl(resource);
			if (sUrl.indexOf(sService) === -1) {
				return fnOriginalFetch(resource, init);
			}
			try {
				var oUrl = new URL(sUrl, window.location.origin);
				var sPath = oUrl.pathname;
				if (sPath.indexOf("$metadata") !== -1) {
					return fnOriginalFetch(resource, init);
				}
				if (sPath.indexOf("/$count") !== -1) {
					var iCount = (oMockServer.getEntitySetData("A_JournalEntryItemBasic") || []).length;
					return Promise.resolve(new Response(String(iCount), {
						status: 200,
						headers: { "Content-Type": "text/plain" }
					}));
				}
				var aItems = oMockServer.getEntitySetData("A_JournalEntryItemBasic") || [];
				var iSkip = parseInt(oUrl.searchParams.get("$skip") || "0", 10);
				var sTop = oUrl.searchParams.get("$top");
				var iTop = sTop ? parseInt(sTop, 10) : aItems.length;
				var aSlice = aItems.slice(iSkip, iSkip + iTop);
				return Promise.resolve(jsonResponse({
					d: {
						results: aSlice,
						__count: String(aItems.length)
					}
				}));
			} catch (oError) {
				Log.error("Journal Entry Monitor fetch interceptor failed", oError);
				return fnOriginalFetch(resource, init);
			}
		};
		window.fetch._jemPatched = true;
	}

	return {
		init: function () {
			if (this._bStarted) {
				return;
			}

			sap.ui.require(["sap/ui/fl/FakeLrepConnectorLocalStorage"], function (FakeLrepConnectorLocalStorage) {
				if (FakeLrepConnectorLocalStorage && FakeLrepConnectorLocalStorage.enableFakeConnector) {
					FakeLrepConnectorLocalStorage.enableFakeConnector();
				}
			});

			var sRoot = sap.ui.require.toUrl("mindtek/journalentry/monitor/localService");
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/API_JOURNALENTRYITEMBASIC_SRV/"
			});

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 80
			});

			oMockServer.simulate(sRoot + "/metadata.xml", {
				sMockdataBaseUrl: sRoot + "/mockdata",
				bGenerateMissingMockData: false
			});

			attachNavigationHandlers(oMockServer);
			installFetchInterceptor(oMockServer);
			oMockServer.start();
			this._bStarted = true;
			Log.info("Journal Entry Monitor mock server started at /sap/opu/odata/sap/API_JOURNALENTRYITEMBASIC_SRV/");
		}
	};
});

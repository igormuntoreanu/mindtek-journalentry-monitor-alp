sap.ui.define([
	"./localService/mockserver",
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer"
], function (mockserver, Shell, ComponentContainer) {
	"use strict";

	mockserver.init();

	new Shell({
		app: new ComponentContainer({
			height: "100%",
			name: "mindtek.journalentry.monitor",
			settings: {
				id: "journalEntryMonitor"
			},
			async: true,
			manifest: true
		})
	}).placeAt("content");
});

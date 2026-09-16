sap.ui.define([
	"./localService/mockserver",
	"sap/m/VBox",
	"sap/m/FlexItemData",
	"sap/m/OverflowToolbar",
	"sap/m/OverflowToolbarLayoutData",
	"sap/m/Image",
	"sap/ui/core/ComponentContainer"
], function (mockserver, VBox, FlexItemData, OverflowToolbar, OverflowToolbarLayoutData, Image, ComponentContainer) {
	"use strict";

	mockserver.init();

	new VBox({
		fitContainer: true,
		height: "100%",
		renderType: "Bare",
		items: [
			new OverflowToolbar({
				design: "Solid",
				width: "100%",
				content: [
					new Image({
						src: sap.ui.require.toUrl("mindtek/journalentry/monitor/img/mindtek-logo.jpg"),
						height: "2.25rem",
						densityAware: false,
						decorative: false,
						alt: "MindTek"
					}).setLayoutData(new OverflowToolbarLayoutData({
						priority: "NeverOverflow"
					}))
				]
			}).addStyleClass("mindtek-app-brand"),
			new ComponentContainer({
				height: "100%",
				name: "mindtek.journalentry.monitor",
				settings: {
					id: "journalEntryMonitor"
				},
				async: true,
				manifest: true,
				layoutData: new FlexItemData({
					growFactor: 1,
					minHeight: "0"
				})
			})
		]
	}).addStyleClass("mindtek-app-shell").placeAt("content");
});

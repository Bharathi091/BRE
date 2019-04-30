/* global _:true */
sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/ReportModel",
	"dbedit/model/formatter",
	"dbedit/Services/LineItemsServices",
	"dbedit/Services/MatterServices",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function(Controller, ReportModel, formatter, LineItemsServices, MatterServices, MessageBox, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("dbedit.controller.Home", {
		formatter: formatter,
		onInit: function(oEvent) {
			this.setModel(new ReportModel().getModel(), "InputsModel");
			this.BillEditModel = this.getModel("InputsModel");
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannel", "toSummaryEdit", this);
		},
		gotoPress: function(oEvt) {
			debugger;
			var InputFields = this.getModel("InputsModel");
			this.BillEditModel.setProperty("/Inputs/LineitemsCopy", []);
			this.getView().byId("Home").setVisible(true);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(false);
			InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", true);
			InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", true);
			InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", true);
			InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", true);
			InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", true);

			InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
			InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
			InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
			InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
			InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
			InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
			InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/Undo", false);
		},
		onDataReceived: function(oEvent) {
			debugger;
			var results = oEvent.getParameters().getParameter('data')['results'];
			this.BillEditModel.setProperty("/Inputs/results", results);
			this.BillEditModel.setProperty("/Inputs/HomeData", results);
			var Otable = this.byId("homeTable");
			for (var i = 0; i < results.length; i++) {
				if (results[i].WfComments === "X") {
					for (var i = 0; i < results.length; i++) {
						Otable.getRows()[i].getCells()[4].setVisible(true);

					}
				}
			}
		
		},

		homeTableSelection: function(oEvent) {
			debugger;
			var rowCount = this.byId("homeTable").getSelectedIndices();
			this.BillEditModel = this.getModel("InputsModel");
			if (rowCount.length === 1) {
				this.getView().byId("Narrative").setVisible(true);
				this.getView().byId("HeaderEdits").setVisible(true);
				this.getView().byId("LineItemEdits").setVisible(true);
				this.getView().byId("LineItemTransfers").setVisible(true);
				this.getView().byId("WrittenDown").setVisible(true);
				this.getView().byId("BillSummary").setVisible(true);
				
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/CreateFinalBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/CancelDraftBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/PrintFinalBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/HomePrintDraftBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/HomeChangeStatus", true);

				var viewTableData = this.BillEditModel.getProperty("/Inputs/results");
				this.BillEditModel.setProperty("/Inputs/selectedRow", viewTableData[rowCount[0]]);
				this.getLineItemsData();

			} else if (rowCount.length > 1) {
				
				this.getView().byId("Narrative").setVisible(false);
				this.getView().byId("HeaderEdits").setVisible(false);
				this.getView().byId("LineItemEdits").setVisible(false);
				this.getView().byId("LineItemTransfers").setVisible(false);
				this.getView().byId("WrittenDown").setVisible(false);
				this.getView().byId("BillSummary").setVisible(false);
				
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/CreateFinalBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/CancelDraftBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/PrintFinalBill", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/HomePrintDraftBill", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/HomeChangeStatus", true);
				
				debugger;
				var SelRowsArr = [];
				var viewTableData = this.BillEditModel.getProperty("/Inputs/results");
				for (var i = 0; i < rowCount.length; i++) {

					SelRowsArr.push(viewTableData[rowCount[i]]);
					this.BillEditModel.setProperty("/Inputs/selectedRows", SelRowsArr);
				}
			} else {
				this.getView().byId("Narrative").setVisible(false);
				this.getView().byId("HeaderEdits").setVisible(false);
				this.getView().byId("LineItemEdits").setVisible(false);
				this.getView().byId("LineItemTransfers").setVisible(false);
				this.getView().byId("WrittenDown").setVisible(false);
				this.getView().byId("BillSummary").setVisible(false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/CreateFinalBill", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/CancelDraftBill", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/PrintFinalBill", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/HomePrintDraftBill", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/HomeChangeStatus", false);
			}
		},
		getLineItemsData: function() {
			this.showBusyIndicator();
			var that = this;
			var Vbeln = this.BillEditModel.getProperty("/Inputs/selectedRow").Vbeln;
			LineItemsServices.getInstance().getLineItemsData(this.BillEditModel, Vbeln, that)
				.done(function(oData) {

					that.hideBusyIndicator();
					that.BillEditModel.setProperty("/Inputs/tableData", oData.results);
					that.BillEditModel.setProperty("/Inputs/LineitemsCopy", oData.results);
					that.BillEditModel.setProperty("/Inputs/LineitemsCopySearch", oData.results);
				})
				.fail(function() {});

		},
		
		
		NarrativeFunction: function(oControlEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelNarrative", "toSummaryEditNarrative", {
				parNarrative: "narrativeEdit",
				button: oControlEvent.getSource().getText()
			});
		},
		HeaderFunction: function(oControlEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelHeaderEdits", "toSummaryEditHeader", {
				parHeader: "headerEdit",
				button: oControlEvent.getSource().getText()
			});

		},
		LineItemEditsFunction: function(oControlEvent) {
			var that = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelLineItemEdits", "toSummaryEditLineItem", {
		     	data: that.BillEditModel.getProperty("/Inputs/selectedRow"),
				button: oControlEvent.getSource().getText()
			});

		},
		LineItemTransfersFunction: function(oControlEvent) {
			var that = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelLineItemTransfer", "toSummaryLineItemTransfer", {
			    data: that.BillEditModel.getProperty("/Inputs/selectedRow"),
				button: oControlEvent.getSource().getText()
			});

		},
		
		onHomePress: function(oEvent) {
			var InputFields = this.getModel("InputsModel");
			this.getView().byId("Home").setVisible(true);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(false);

			InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", true);
			InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", true);
			InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", true);
			InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", true);
			InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", true);

			InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

			InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
			InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
			InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
			InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
			InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
			InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
			InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/Undo", false);
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannel", "toSummaryEdit", {
				parHome: "home"
			});
		},
		onNarrativePress: function(oEvent) {
		
			var InputFields = this.getModel("InputsModel");

			this.getView().byId("Home").setVisible(false);
			this.getView().byId("NarrativeEditsVBox").setVisible(true);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(false);
			if (this.BillEditModel.getProperty("/Inputs/selectedRow").Status === "Approved") {

				InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", true);

				InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
				InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
				InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
				InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
				InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
				InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
				InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/Undo", false);

				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeSave", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/GlobalSpellCheck", true);
			} else {
				InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", true);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", true);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", true);

				InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
				InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
				InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
				InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
				InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
				InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
				InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/Undo", false);

				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeSave", true);
				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/GlobalSpellCheck", true);
			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelNarrative", "toSummaryEditNarrative", {
				parNarrative: "narrativeEdit"
			});

		},
		onHeaderEditsPress: function(oEvent) {
			var InputFields = this.getModel("InputsModel");

			this.getView().byId("Home").setVisible(false);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(true);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(false);

			InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
			InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
			InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

			InputFields.setProperty("/Inputs/Toolbar/Reprice", true);
			InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", true);
			InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", true);
			InputFields.setProperty("/Inputs/Toolbar/HeaderSave", true);
			InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", true);

			InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
			InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
			InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
			InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
			InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
			InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
			InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/Undo", false);

			InputFields.setProperty("/Inputs/ToolbarEnable/Reprice", true);
			InputFields.setProperty("/Inputs/ToolbarEnable/HeaderAddComments", true);
			InputFields.setProperty("/Inputs/ToolbarEnable/HeaderChangeStatus", true);
			InputFields.setProperty("/Inputs/ToolbarEnable/HeaderPrintDraftBill", true);

			var that = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelHeaderEdits", "toSummaryEditHeader", {
				data: that.BillEditModel.getProperty("/Inputs/selectedRow")
			});
		},
		onLineItemEditsPress: function(oEvent) {
			var InputFields = this.getModel("InputsModel");
			this.getView().byId("Home").setVisible(false);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(true);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(false);
			if (this.BillEditModel.getProperty("/Inputs/selectedRow").Status === "Approved") {

				InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

				InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", true);
				InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
				InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
				InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
				InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
				InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
				InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
				InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/Undo", false);

				InputFields.setProperty("/Inputs/ToolbarEnable/LineItemAddComments", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/LineItemSave", false);
			} else {
				InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

				InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemSave", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", true);
				InputFields.setProperty("/Inputs/Toolbar/Postpone", true);
				InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", true);
				InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", true);
				InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", true);
				InputFields.setProperty("/Inputs/Toolbar/RateOverride", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", true);

				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
				InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
				InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/Undo", false);

				InputFields.setProperty("/Inputs/ToolbarEnable/LineItemAddComments", false);
				InputFields.setProperty("/Inputs/ToolbarEnable/LineItemSave", false);
			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelLineItemEdits", "toSummaryEditLineItem", {
				data: this.BillEditModel.getProperty("/Inputs/selectedRow")
			});

		},
		onLineItemTransfersPress: function(oEvent) {

			var InputFields = this.getModel("InputsModel");
			this.getView().byId("Home").setVisible(false);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(true);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(false);

			if (this.BillEditModel.getProperty("/Inputs/selectedRow").Status === "Approved") {
				InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

				InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
				InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
				InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
				InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
				InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/Transfer", true);
				InputFields.setProperty("/Inputs/Toolbar/Consolidate", true);
				InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", true);
				InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", true);
				InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", true);

				InputFields.setProperty("/Inputs/Toolbar/Undo", false);

			} else {
				InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
				InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

				InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

				InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
				InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
				InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
				InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
				InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
				InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
				InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
				InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", true);
				InputFields.setProperty("/Inputs/Toolbar/Transfer", true);
				InputFields.setProperty("/Inputs/Toolbar/Consolidate", true);
				InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", true);
				InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", true);
				InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", true);
				InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", true);

				InputFields.setProperty("/Inputs/Toolbar/Undo", false);
			}
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelLineItemTransfer", "toSummaryLineItemTransfer", {
				parLineItemTransfer: "lineItemTransfer"
			});

		},
		onWrittenDownPress: function(oEvent) {
			var InputFields = this.getModel("InputsModel");
			this.getView().byId("Home").setVisible(false);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(true);
			this.getView().byId("BillSummaryVbox").setVisible(false);
			this.bus = sap.ui.getCore().getEventBus();

			InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
			InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
			InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

			InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
			InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
			InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
			InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
			InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
			InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
			InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/Undo", true);

			this.bus.publish("homeChannelWrittenDown", "toSummaryWrittenDown", {
				parLineItemTransfer: "writtenDown"
			});

		},
		onBillSummaryPress: function(oEvent) {
			var InputFields = this.getModel("InputsModel");
			this.getView().byId("Home").setVisible(false);
			this.getView().byId("NarrativeEditsVBox").setVisible(false);
			this.getView().byId("HeaderEditsVbox").setVisible(false);
			this.getView().byId("LineItemEditsVbox").setVisible(false);
			this.getView().byId("LineItemTransfersVbox").setVisible(false);
			this.getView().byId("WrittenDownVbox").setVisible(false);
			this.getView().byId("BillSummaryVbox").setVisible(true);

			InputFields.setProperty("/Inputs/Toolbar/CreateFinalBill", false);
			InputFields.setProperty("/Inputs/Toolbar/CancelDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/PrintFinalBill", false);
			InputFields.setProperty("/Inputs/Toolbar/HomePrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/HomeChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/NarrativeSave", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/NarrativeUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/GlobalSpellCheck", false);

			InputFields.setProperty("/Inputs/Toolbar/Reprice", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderChangeStatus", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderSave", false);
			InputFields.setProperty("/Inputs/Toolbar/HeaderPrintDraftBill", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReplaceWords", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemAddComments", false);
			InputFields.setProperty("/Inputs/Toolbar/Postpone", false);
			InputFields.setProperty("/Inputs/Toolbar/FullWriteDown", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReprice", false);
			InputFields.setProperty("/Inputs/Toolbar/WriteUpDown", false);
			InputFields.setProperty("/Inputs/Toolbar/BillExactAmount", false);
			InputFields.setProperty("/Inputs/Toolbar/RateOverride", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemUnReviewed", false);

			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferSave", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUnReviewed", false);
			InputFields.setProperty("/Inputs/Toolbar/Transfer", false);
			InputFields.setProperty("/Inputs/Toolbar/Consolidate", false);
			InputFields.setProperty("/Inputs/Toolbar/SplitTransfer", false);
			InputFields.setProperty("/Inputs/Toolbar/LineItemTransferUpdateCodes", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferPrintDraftBill", false);
			InputFields.setProperty("/Inputs/Toolbar/TransferChangeStatus", false);

			InputFields.setProperty("/Inputs/Toolbar/Undo", false);

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelBillSummary", "toSummaryBillSummary", {
				parLineItemTransfer: "billSummary"
			});

		},
		
		
		onGlobalSearch: function(oEvent) {

			debugger;

			var searchValue = this.byId("searchText0").getValue();

			var result = [];

			this.BillEditModel.getProperty("/Inputs/results").forEach(
				function(value, index) {

					var date = value.Budat;

					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					var dateFormatted = dateFormat.format(date).toString();

					var myJSON = JSON.stringify(jQuery.extend({}, value));
					var obj1 = myJSON + dateFormatted;

					if (obj1.toLowerCase().includes(searchValue.toLowerCase())) {
						result.push(value);
					}

				}
			);
			this.BillEditModel.setProperty("/Inputs/HomeData", result);
			var Otable = this.getView().byId("homeTable");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/HomeData");

		},
		PrintFinalBillFuntion: function(oControlEvent) {
			this._getfinalbillsDialog().open();
			var ViewRowsData = this.BillEditModel.getProperty("/Inputs/results");
			var selectedRows = [];
			var indices = this.getView().byId("homeTable").getSelectedIndices();
			$.each(indices, function(i) {
				selectedRows.push(ViewRowsData[i]);
			});
			if (selectedRows.length === 1) {
				this.getfinalbilltypes();
			} else {
				this.getfinalmassbilltypes();
			}
		},
		_getfinalbillsDialog: function() {
			if (!this._finalBillDialog) {
				this._finalBillDialog = sap.ui.xmlfragment("dialogBill", "dbedit.Fragments.PrintFinalBill", this);
				this.getView().addDependent(this._finalBillDialog);
			}
			return this._finalBillDialog;
		},

		printDialogOk: function() {
			this._finalBillDialog.close();
		},
		printDialogCancel: function() {
			this._finalBillDialog.close();
		},

		getfinalbilltypes: function() {
			this.showBusyIndicator();
			var selRow = this.BillEditModel.getProperty("/Inputs/selectedRow");
			var that = this;

			$.when(MatterServices.getInstance().getfinalbilltypes(this.BillEditModel, selRow, this))
				.done(function(oData) {
					that.hideBusyIndicator();
					// if (!($.isUndefined(oData))) {
					//                     debugger;
					// 	for (var i = 0; i < oData.results.length; i++) {

					// 		var message = oData.results[i].Message;
					// 		if (oData.results[i].Iserror.toUpperCase() === 'X') {
					// 		var	sMsg = message;
					// 			that.showAlert("Error", sMsg);
					// 			that.printFinalDialogClosedWithCancel();
					// 			break;
					// 		} else {
					// 			var finalDr_Arr = $.filter(oData.results, function(o) {
					// 				return o.Default === 'X';
					// 			});
					// 			this.getFinalDr(finalDr_Arr[0].Kschl);
					// 		}
					// 	}
					// }
					// if (!($.isUndefined(oData.error))) {
					// 	debugger;
					// 	that.showAlert("Error", oData.error.message.value);
					// 	that.printFinalDialogClosedWithCancel();
					// }
					var message = oData.results[0].Message;
					MessageBox.show(
						message, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK]
						}
					);

					that.BillEditModel.setProperty("/printfinalData", oData.results);

				});
		},
		getfinalmassbilltypes: function() {
			// GET FBMassOutputTypeSet?$filter=(Kappl%20%20%20eq%20'V3'%20and%20(Vbeln%20%20%20eq%20'70001836'%20
			//or%20Vbeln%20%20%20eq%20'70002266'%20))&$format=json HTTP/1.1
			var that = this;
			var aSelRows = this.BillEditModel.getProperty("/Inputs/selectedRows");
			$.when(MatterServices.getInstance().getfinalmassbilltypes(this.BillEditModel, aSelRows, this))
				.done(function(oData) {
					that.hideBusyIndicator();
					// if (!($.isUndefined(oData))) {
					//                     debugger;
					// 	for (var i = 0; i < oData.results.length; i++) {

					// 		var message = oData.results[i].Message;
					// 		if (oData.results[i].Iserror.toUpperCase() === 'X') {
					// 		var	sMsg = message;
					// 			that.showAlert("Error", sMsg);
					// 			that.printFinalDialogClosedWithCancel();
					// 			break;
					// 		} else {
					// 			var finalDr_Arr = $.filter(oData.results, function(o) {
					// 				return o.Default === 'X';
					// 			});
					// 			this.getFinalDr(finalDr_Arr[0].Kschl);
					// 		}
					// 	}
					// }
					// if (!($.isUndefined(oData.error))) {
					// 	debugger;
					// 	that.showAlert("Error", oData.error.message.value);
					// 	that.printFinalDialogClosedWithCancel();
					// }
					var message = oData.results[0].Message;
					MessageBox.show(
						message, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK]
						}
					);

					that.BillEditModel.setProperty("/printfinalData", oData.results);

				});
		},
		// CancelDraftBillFuntion
		CancelDraftBillFuntion: function(oModel) {
			var InputFields = this.getModel("InputsModel");
			var data = InputFields.getProperty("/Inputs/results");
			var table = this.getView().byId("homeTable");
			var selectedIndices = table.getSelectedIndices();
			sap.ui.core.BusyIndicator.show();

			var oComponent = this.getOwnerComponent(),

				oFModel = oComponent.getModel(),

				tData = $.extend(true, [], data),

				urlParams,

				Vbeln = [];

			$.each(tData, function(i, o) {

				Vbeln.push(o.Vbeln);
			});

			urlParams = {

				Vbeln: Vbeln

			};

			var that = this;

			oFModel.callFunction("/DraftCancel", {
				method: "GET",
				urlParameters: urlParams,

				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();

					var res = oData.results;
					// for (var r = 0; r < res.length; r++) {

					var msgTxt = res[0].Message;
					// MessageBox.show(
					// 	msgTxt, {
					// 		icon: sap.m.MessageBox.Icon.SUCCESS,
					// 		title: "Save",
					// 		actions: [sap.m.MessageBox.Action.OK]
					// 	}
					// );

					// }

					for (var i = 0; i < selectedIndices.length; i++) {
						table.getRows()[selectedIndices[i]].getCells()[0].setVisible(true);
						table.getRows()[selectedIndices[i]].getCells()[1].setVisible(false);

						table.getRows()[selectedIndices[i]].getCells()[0].setTooltip(msgTxt);

					}

					that.hideShow();
				},
				error: function(oData) {
					MessageBox.show(JSON.parse(oData.responseText).error.message.value);

				}
			});
		},
		//print draft bill

		PrintDraftBillFuntion: function() {
			this._getPrintDraftBillFuntion();
		},
		_getPrintDraftBillFuntion: function() {

			var that = this;
			var oDialog = that._getbillsDialog();
			that.getView().addDependent(oDialog);
			oDialog.open();

			var billModel = this.BillEditModel.getProperty("/Inputs/selectedRow");

			$.when(MatterServices.getInstance().getOutPutTypesets(this.BillEditModel, billModel, this))
				.done(function(printbillsData) {

					that.BillEditModel.setProperty("/printbillsData", printbillsData);
					that._billsDialog.setModel(new JSONModel({
						data: that.BillEditModel.getProperty("/printbillsData"),
						selected: "ZDR1"
					}), "printbillsData");
				});
		},
		_getbillsDialog: function() {

			if (!this._billsDialog) {
				this._billsDialog = sap.ui.xmlfragment("dialogBill", "dbedit.Fragments.PrintDraftBill", this.getView().getController());
			}
			return this._billsDialog;
		},
		printDialogClosedWithCancel: function() {

			this._billsDialog.close();
		},
		printDialogClosedWithOk: function() {

			var billsModel = this._billsDialog.getModel("printbillsData");

			var serviceUrls = this.BillEditModel.getProperty("/Inputs/services");

			var Row = this.BillEditModel.getProperty("/Inputs/selectedRow");

			var qparams = this.BillEditModel.getProperty("/Inputs/qParms");

			var url = encodeURI(this.getOwnerComponent().getModel().sServiceUrl + serviceUrls.PDFOutCollection + "(Kappl='" +
				"V1" +
				"',Kschl='" + billsModel.getProperty("/selected") + "',DraftBill='" + Row.Vbeln + "')" + qparams.value);
			window.open(url, "_blank");

		},
		LineItemTransferfunction: function(oControlEvent) {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("homeChannelLineItemTransfer", "toSummaryLineItemTransfer", {
				parLineItemTransfer: "lineItemTransfer",
				button: oControlEvent.getSource().getText()
			});
		},

		//create final bill
		CreateFinalBillFuntion: function() {
			var oDialog = this._getfinalbillssuggestDialog();
			this.getView().addDependent(oDialog);
			oDialog.open();
		},
		_getfinalbillssuggestDialog: function() {
			if (!this._finalBillsuggestDialog) {
				this._finalBillsuggestDialog = sap.ui.xmlfragment("dialogfinalsuggestBill", "dbedit.Fragments.CreatefinalBillsuggest", this.getView()
					.getController());
			}
			return this._finalBillsuggestDialog;
		},
		onCreateFinalcloseDialog: function() {
			this._finalBillsuggestDialog.close();
		},
		onCreateFinalProceed: function() {
			this._finalBillsuggestDialog.close();
			var oDialog = this._getcreatefinalbillsDialog();
			this.getView().addDependent(oDialog);
			oDialog.open();
		},
		_getcreatefinalbillsDialog: function() {
			if (!this._finalBillDialog) {
				this._finalBillDialog = sap.ui.xmlfragment("dialogfinalBill", "dbedit.Fragments.CreateFinalBill", this.getView().getController());
			}
			return this._finalBillDialog;
		},
		onfinalbillClose: function() {
			this._finalBillDialog.close();
		},
		onCreateFinalBillok: function() {

			var InputFields = this.getModel("InputsModel");
			var data = InputFields.getProperty("/Inputs/results");
			var table = this.getView().byId("homeTable");
			var selectedIndices = table.getSelectedIndices();
			var oFModel = this.getOwnerComponent().getModel(),
				tData = $.extend(true, [], data),
				urlParams,
				Vbeln = [],
				FKDAT = [],
				FKART = [];

			var fkart = sap.ui.core.Fragment.byId("dialogfinalBill", "billtype").getSelectedKey();
			FKART.push(fkart);
			var date = sap.ui.core.Fragment.byId("dialogfinalBill", "datepicker").getValue();
			FKDAT.push(date);
			$.each(tData, function(i, o) {
				Vbeln.push(o.Vbeln);
			});

			urlParams = {
				Vbeln: Vbeln,
				GROUPBILL: "",
				FKDAT: FKDAT,
				FKART: FKART,
				PROCEED: "X"
			};

			var that = this;

			oFModel.callFunction("/DraftCancel", {
				method: "GET",
				urlParameters: urlParams,
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					var res = oData.results;
					var msgTxt = res[0].Message;
					for (var i = 0; i < selectedIndices.length; i++) {
						table.getRows()[selectedIndices[i]].getCells()[0].setVisible(true);
						table.getRows()[selectedIndices[i]].getCells()[1].setVisible(false);
						table.getRows()[selectedIndices[i]].getCells()[0].setTooltip(msgTxt);
					}
				},
				error: function(oData) {
					MessageBox.show(JSON.parse(oData.responseText).error.message.value);
				}
			});
			this._finalBillDialog.close();
		},

		//change status 
		_getStatusDialog: function() {
			if (!this._statusDialog) {
				this._statusDialog = sap.ui.xmlfragment("dialogBill", "dbedit.Fragments.changeStatus", this.getView().getController());
			}
			return this._statusDialog;
		},
		ChangeStatusFunction: function() {
			var oDialog = this._getStatusDialog();
			this.getView().addDependent(oDialog);
			oDialog.open();
			var that = this;
			var selectedRows = this.BillEditModel.getProperty("/Inputs/selectedRow");

			this.showBusyIndicator();
			$.when(MatterServices.getInstance().getBillSummarySetStatus(this.BillEditModel, selectedRows, this))
				.done(function(statusList) {
					that.hideBusyIndicator();
					that.BillEditModel.setProperty("/statusList", statusList);
					that._statusDialog.setModel(new JSONModel({
						data: that.BillEditModel.getProperty("/statusList")
					}), "statusList");
				});
		},
		selectStatus: function(oControlEvent) {
			var obj = oControlEvent.getSource().getBindingContext("statusList").getObject();
			var that = this;
			this.showBusyIndicator();
			var table = this.getView().byId("homeTable");
			var selectedRows = [];
			var selectedIndices = table.getSelectedIndices();
			if (selectedIndices.length === 1) {
				selectedRows.push(this.BillEditModel.getProperty("/Inputs/selectedRow"));
			} else if (selectedIndices.length >= 1) {
				selectedRows.push(this.BillEditModel.getProperty("/Inputs/selectedRow"));
			}

			var oFModel = this.getOwnerComponent().getModel(),
				tData = $.extend(true, [], selectedRows),
				urlParams,
				Vbeln = [],
				TypeofApproval = [],
				Estatus = [];

			var status = obj.Estat;
			Estatus.push(status);
			$.each(tData, function(i, o) {
				Vbeln.push(o.Vbeln);
				TypeofApproval.push(o.TypeofApprovaldat);
			});

			urlParams = {
				VBELN: Vbeln,
				TYPEOFAPPROVAL: 'M',
				STATUS: Estatus
			};
			var that = this;
			oFModel.callFunction("/ChangeStatus", {
				method: "GET",
				urlParameters: urlParams,
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					var res = oData.results;
					var msgTxt = res[0].Message;
					for (var i = 0; i < selectedIndices.length; i++) {
						table.getRows()[selectedIndices[i]].getCells()[0].setVisible(true);
						table.getRows()[selectedIndices[i]].getCells()[1].setVisible(false);
						table.getRows()[selectedIndices[i]].getCells()[0].setTooltip(msgTxt);
					}
					that.BillEditModel.setProperty("/Inputs/results", oData.results);

				},
				error: function(oData) {
					MessageBox.show(JSON.parse(oData.responseText).error.message.value);
				}
			});
			this._statusDialog.close();
		},
		statusDialogClosedWithOk: function() {
			this._statusDialog.close();
		},
		LinecommentsMethod: function(oEvent) {
			alert("comment open");
			debugger;
			var billEditSearchData = oEvent.getSource().getBindingContext().getObject();
			var that = this;

			this.BillEditModel.setProperty("/Inputs/comments", billEditSearchData.WfComments);

			LineItemsServices.getInstance().getWFComments(that.BillEditModel, billEditSearchData, that)
				.done(function(oData) {

					sap.ui.core.BusyIndicator.hide(0);

					var oDialog = that._getCommentsDialog();
					that.getView().addDependent(oDialog);
					oDialog.open();
					that.BillEditModel.setProperty("/Inputs/WfComments", oData.results);

				})
				.fail(function() {
					sap.ui.core.BusyIndicator.hide(0);

				});
			this.BillEditModel.setProperty("/Inputs/saveObjects", billEditSearchData);
		},
		_getCommentsDialog: function() {
			debugger;
			if (!this._commentsDialog) {
				this._commentsDialog = sap.ui.xmlfragment("dialogComment", "dbedit.Fragments.comments", this.getView().getController());

			}
			return this._commentsDialog;
		},
		DialogClosedWithOk: function() {
			debugger;
			this._commentsDialog.close();

		},
		DialogClosedWithCancel: function() {
			this._commentsDialog.close();
		},

	});

});
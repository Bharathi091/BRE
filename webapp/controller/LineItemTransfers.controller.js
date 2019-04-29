sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter"
], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("dbedit.controller.LineItemTransfers", {

		formatter: formatter,

		onInit: function() {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelLineItemTransfer", "toSummaryLineItemTransfer", this.LineItemTransferData, this);
		},
		LineItemTransferData: function(homeChannelLineItemTransfer, toSummaryLineItemTransfer, data) {
			if (!data.button) {
				debugger;
				this.BillEditModel = this.getModel("InputsModel");
				var Otable = this.getView().byId("lineItemtransfers");
				// var results = this.BillEditModel.getProperty("/Inputs/homeTable");
				Otable.setModel(this.BillEditModel);
				Otable.bindRows("/Inputs/LineitemsCopy");
				this.byId("searchText3").setValue("");
				// var OtableSmart0 = this.getView().byId("smartTable_ResponsiveTable11");
				// var oPersButton = OtableSmart0._oTablePersonalisationButton;
				// var that = this;
				// oPersButton.attachPress(function() {

				// 	var oPersController = OtableSmart0._oPersController;
				// 	var oPersDialog = oPersController._oDialog;

				// 	oPersDialog.attachOk(function(oEvent) {

				// 		// setTimeout(function() {

				// 		// this.BillEditModel.setProperty("/Inputs/LineitemsCopy", results);
				// 		// this.BillEditModel.setProperty("/Inputs/scope", "");
				// 		var Otablenew = this.getView().byId("lineItemtransfers");

				// 		Otablenew.bindRows("/Inputs/LineitemsCopy");

				// 		// 	that.jsonModel.setProperty("/modelData",that.getModel("InputsModel").getProperty("/Inputs/homeTable"));
				// 		// 	var Otablenew = that.getView().byId("WipDetailsSet3");
				// 		// 	Otablenew.bindRows("/modelData");
				// 		// }, 1000);

				// 	});

				// });
				// this.data(results);
				this.BillEditModel.setProperty("/Inputs/scope", "");
				var tableLineEdits = this.getView().byId("lineItemtransfers");

				var index = this.getModel("InputsModel").getProperty("/Inputs/rowLineCount");

				for (var i = 0; i < index.length; i++) {
					tableLineEdits.getRows()[index[i]].getCells()[0].setVisible(false);

				}
				var change = this.BillEditModel.getProperty("/Inputs/isChanged");

				if (change === true) {

					this._Dialog = sap.ui.xmlfragment("dbedit.Fragments.Fragment", this);
					this._Dialog.open();
				} else {

					this.ReloadTable();

				}
			} else {
				if (data.button === "Save") {
					this.onLineItemTransfersSave();
				} else if (data.button === "Updatecodes") {
					this.onUpdateCodes();
				} else if (data.button === "Consolidate") {
					this.onConsolidate();
				} else if (data.button === "Transfer") {
					this.onMassTransfer();
				} else if (data.button === "SplitTransfer") {
					this.onSplitTransfer();
				}

			}

		},
		onGlobalSearch: function(oEvent) {

			debugger;

			var searchValue = this.byId("searchText3").getValue();

			var result = [];

			this.BillEditModel.getProperty("/Inputs/LineitemsCopySearch").forEach(
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
			this.BillEditModel.setProperty("/Inputs/LineitemsCopy", result);
			var Otable = this.getView().byId("lineItemtransfers");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");

		},
		onConsolidate: function() {

			var passingArray = [];

			// var oModel = this.getOwnerComponent().getModel().sServiceUrl;
			var oModel1 = this.getOwnerComponent().getModel();
			var InputFields = this.getView().getModel("InputsModel");

			var oTable = this.getView().byId("smartTable_ResponsiveTable11").getTable();
			var index = oTable.getSelectedIndices();

			oTable.getSelectedIndices().forEach(function(j, o) {

				var ctx = oTable.getContextByIndex(o);
				var m = ctx.getObject();
				passingArray.push(m);

			});

			var docNumber = "";
			var docNumber1 = "";
			var docNumber2 = "";
			var docNumber3 = "";
			var docNumber4 = "";
			var docNumber5 = "";
			var docNumber6 = "";

			var q = 0;
			passingArray.forEach(function(item) {
				q++;
				debugger;
				item.Counter = q;
				docNumber = docNumber + item.Vbeln + ',';
				docNumber1 = docNumber1 + item.Posnr + ',';
				if (item.Percentage) {
					docNumber2 = docNumber2 + item.Percentage + ',';
				} else {
					docNumber2 = docNumber2 + 0 + ',';
				}
				if (item.ToMatter) {
					docNumber3 = docNumber3 + item.Phase + ',';
				}
				if (item.Counter) {
					docNumber4 = docNumber4 + item.Counter + ',';
				}
				if (item.ToVbeln) {
					docNumber5 = docNumber5 + item.ToVbeln + ',';
				}
				if (item.Hours) {
					docNumber6 = docNumber6 + item.Hours + ',';
				} else {
					docNumber6 = docNumber6 + 0 + ',';
				}

			});
			var lastIndex = docNumber.lastIndexOf(",");
			if (lastIndex) {
				docNumber = docNumber.substring(0, lastIndex);
			}
			var lastIndex1 = docNumber1.lastIndexOf(",");
			if (lastIndex1 > 1) {
				docNumber1 = docNumber1.substring(0, lastIndex1);
			}
			var lastIndex2 = docNumber2.lastIndexOf(",");
			if (lastIndex2 > 1) {
				docNumber2 = docNumber2.substring(0, lastIndex2);
			}
			var lastIndex3 = docNumber3.lastIndexOf(",");
			if (lastIndex3 > 1) {
				docNumber3 = docNumber3.substring(0, lastIndex3);
			}
			var lastIndex4 = docNumber4.lastIndexOf(",");
			if (lastIndex4 > 1) {
				docNumber4 = docNumber4.substring(0, lastIndex4);
			}
			var lastIndex5 = docNumber5.lastIndexOf(",");
			if (lastIndex5 > 1) {
				docNumber5 = docNumber5.substring(0, lastIndex5);
			}
			var lastIndex6 = docNumber6.lastIndexOf(",");
			if (lastIndex6 > 1) {
				docNumber6 = docNumber6.substring(0, lastIndex6);
			}
			oModel1.setUseBatch(false);
			oModel1.read("/BillTransfer", {
				urlParameters: {
					"Action": "'CONSOLIDATE'",
					"Vbeln": "'" + docNumber + "'",
					"Posnr": "'" + docNumber1 + "'",
					"Hours": "'" + docNumber6 + "'",
					"Percentage": "'" + docNumber2 + "'",
					"ToActivityCode": "''",
					"ToFfActivityCode": "''",
					"ToFfTaskCode": "''",
					"ToTaskCode": "''",
					"WBS_NODE2": "''",

					"ToMatter": "'" + docNumber3 + "'",
					"Counter": "'" + docNumber4 + "'",

					"ToVbeln": "'" + docNumber + "'",
					"ToPhaseCode": "','",
					"$format": "json"

				},
				success: function(oData, oResponse) {
					// 					var tableLineEdits = that.getView().byId(oTable.getId().substring(12));
					// 					// var index = that.getModel("InputsModel").getProperty("/Inputs/rowLineTransfersCount");
					// 					var i = 0;
					// debugger;
					// 					$.each(index, function(k, o) {

					// 						var errorDefined = oData.results[i].Message;
					// 						tableLineEdits.getRows()[o].getCells()[0].setVisible(true);

					// 						if (errorDefined.includes("ERROR")) {

					// 							tableLineEdits.getRows()[o].getCells()[0].setProperty("color", "red");
					// 							tableLineEdits.getRows()[o].getCells()[0].setTooltip(errorDefined);

					// 						} else {

					// 							tableLineEdits.getRows()[o].getCells()[0].setProperty("color", "red");
					// 							tableLineEdits.getRows()[o].getCells()[0].setTooltip(errorDefined);

					// 						}

					// 						i++;

					// 					});

					alert("Success");
				}

			});

			InputFields.setProperty("/Inputs/isChanged", true);
			InputFields.setProperty("/Inputs/scope", this.getView().byId("lineItemtransfers"));

		},

		LineItemTransferSelection: function() {
			var rowCount = this.byId("lineItemtransfers").getSelectedIndices();
			var rowLineCount1 = [];
			this.BillEditModel = this.getModel("InputsModel");

			for (var i = 0; i < rowCount.length; i++) {
				rowLineCount1.push(rowCount[i]);
			}
			this.getModel("InputsModel").setProperty("/Inputs/rowLineCount", rowLineCount1);

			if (rowCount.length === 1) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Save", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);

			} else if (rowCount.length === 2) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Save", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);
			} else if (rowCount.length >= 3) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Save", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);

			} else {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Save", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);
			}
		}

	});

});
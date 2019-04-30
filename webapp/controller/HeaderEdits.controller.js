sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/Services/LineItemsServices",
	"dbedit/model/formatter",
	"sap/m/MessageBox",
	"dbedit/model/ReportModel",
	"dbedit/Services/MatterServices",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function(BaseController, LineItemsServices, formatter, MessageBox, ReportModel, MatterServices, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("dbedit.controller.HeaderEdits", {
		formatter: formatter,

		onInit: function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelHeaderEdits", "toSummaryEditHeader", this.HeaderEditData, this);
		},
		HeaderEditData: function(homeChannelHeaderEdits, toSummaryEditHeader, data) {
			debugger;
			var that = this;
			this.BillEditModel = this.getModel("InputsModel");
			var selRowObject = this.BillEditModel.getProperty("/Inputs/selectedRow");
			var Otable = this.getView().byId("headerEdits");
			var headerData = [];
			headerData.push(selRowObject);
			this.BillEditModel.setProperty("/Inputs/SelectedRowArray", headerData);

			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/SelectedRowArray");

			setTimeout(function() {
				debugger;
				console.log(Otable.getRows());
				var selectedLines = that.getModel("InputsModel").getProperty("/Inputs/SelectedRowArray").length;
				if (selRowObject.WfComments === "X") {

					for (var i = 0; i < selectedLines; i++) {
						Otable.getRows()[i].getCells()[3].setVisible(true);
					}

				}
			}, 3000);

			if (data.button === "Re-Price") {
				this.fnReprice(data.button);
			} else if (data.button === "Add Comments") {
				this.fnaddCommentsMethod();
			} else if (data.button === "Save") {
				this.fnHeaderEditsSave();
			} else if (data.button === "Print Draft Bill") {
				this.fnPrintDraftBill();
			}else if (data.button === "Change Status") {
				this.ChangeStatusFunction();
			}
		},
		fnHeaderEditsSave: function() {
			debugger;
			var oTable = this.getView().byId("headerEdits");
			var batchChanges = [];
			var ServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;
			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/selectedRow");
			var comment = this.getModel("InputsModel").getProperty("/Inputs/comments");
			saveObjects.Action = "SAVE";
			saveObjects.WfComments = comment;
			delete saveObjects.__metadata;
			var oModel = new sap.ui.model.odata.ODataModel(ServiceUrl, true);
			batchChanges.push(oModel.createBatchOperation("/BillSummarySet", "POST", saveObjects));
			oModel.addBatchChangeOperations(batchChanges);
			oModel.setUseBatch(true);
			var that = this;
			this.getView().setBusy(true);
			oModel.submitBatch(function(data) {
				var batchResp = data.__batchResponses["0"].__changeResponses["0"],
					resp = batchResp.data;
				that.getView().setBusy(false);
				var message = resp.Message;
				MessageBox.show(
					message, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK]
					}
				);
			}, function(er) {});

		},
		fnaddCommentsMethod: function() {
			debugger;
			alert("add Comments");
			var selRowObject = this.getModel("InputsModel").getProperty("/Inputs/selectedRow");

			var oDialog = this._getAddCommentsDialog();
			this.getView().addDependent(oDialog);
			oDialog.open();
			var headerData = [];
			headerData.push(selRowObject);
			this.BillEditModel.setProperty("/Inputs/SelectedRowArray", headerData);

		},
		_getAddCommentsDialog: function() {
			debugger;
			if (!this._addCommentsDialog) {

				this._addCommentsDialog = sap.ui.xmlfragment("dialogAddComment", "dbedit.Fragments.Addcomments", this.getView().getController());

			}
			return this._addCommentsDialog;
		},
		comDialogClosedWithOk: function() {
			debugger;

			var selectedLines = this.getModel("InputsModel").getProperty("/Inputs/SelectedRowArray").length;

			var Otable = this.getView().byId("headerEdits");
			this.comment = [];
			var comment = sap.ui.core.Fragment.byId("dialogAddComment", "TypeHere");
			for (var c = 0; c < selectedLines; c++) {
				var selContext = Otable.getContextByIndex(c);
				var obj = selContext.getObject();
				var commnetValue = comment.getValue();
				console.log(commnetValue);
				obj.WfComments = commnetValue;
				this.getModel("InputsModel").setProperty("/Inputs/comments", commnetValue);
				if (commnetValue) {

					for (var i = 0; i < selectedLines; i++) {
						Otable.getRows()[i].getCells()[3].setVisible(true);

					}
				}
				this.comment.push(obj);
			}
			this.BillEditModel.setProperty("/Inputs/LineitemsCopy", this.comment);
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");
			this._addCommentsDialog.close();
		},
		comDialogClosedWithCancel: function() {
			this._addCommentsDialog.close();
		},
		LinecommentsMethod: function(oEvent) {
			alert("comment open");
			debugger;
			var billEditSearchData = oEvent.getSource().getBindingContext().getObject();
			var that = this;

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

		//reprice
		fnReprice: function() {

			var oDialog = this._getRePriceDialog();
			this.getView().addDependent(oDialog);
			oDialog.open();

		},

		_getRePriceDialog: function() {

			if (!this._RePriceDialog) {
				this._RePriceDialog = sap.ui.xmlfragment("RePriceDilog", "dbedit.Fragments.Re-Price", this.getView().getController());
			}
			return this._RePriceDialog;
		},

		selectReprice: function(oControlEvent) {

			var oTable = this.getView().byId("headerEdits");

			var batchChanges = [];
			var ServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;
			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/selectedRow");

			saveObjects.Action = "REPRICE";
			saveObjects.PriceCntrl = oControlEvent.getSource().data("key");
			delete saveObjects.__metadata;
			var oModel = new sap.ui.model.odata.ODataModel(ServiceUrl, true);

			batchChanges.push(oModel.createBatchOperation("/BillSummarySet", "POST", saveObjects));
			oModel.addBatchChangeOperations(batchChanges);
			oModel.setUseBatch(true);
			var message = "";
			var that = this;
			this.getView().setBusy(true);
			oModel.submitBatch(function(data) {
				that.getView().setBusy(false);
				var batchResp = data.__batchResponses["0"].__changeResponses["0"],
					resp = batchResp.data;
				message = resp.Message;
				var results = [];
				results.push(resp);

				oTable.getRows()[0].getCells()[0].setVisible(true);
				oTable.getRows()[0].getCells()[0].setTooltip(message);
				// that.BillEditModel.setProperty("/Inputs/SelectedRowArray", results);

			}, function(data) {
				MessageBox.show(JSON.parse(data.responseText).error.message.value);
			});

			this._RePriceDialog.close();

		},

		RePriceDialogClosedWithCancel: function() {
			this._RePriceDialog.close();
		},

		// print draft bill

		fnPrintDraftBill: function() {
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
		_getStatusDialog: function() {
			if (!this._statusDialog) {
				this._statusDialog = sap.ui.xmlfragment("dialogBill", "dbedit.Fragments.changeStatus", this.getView().getController());
			}
			return this._statusDialog;
		},
		ChangeStatusFunction: function() {
			debugger;
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
			debugger;
			var obj = oControlEvent.getSource().getBindingContext("statusList").getObject();
			var that = this;
			this.showBusyIndicator();
			var table = this.getView().byId("headerEdits");
			var selectedRows = [];
			selectedRows.push(this.BillEditModel.getProperty("/Inputs/selectedRow"));
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
					alert("success");
					sap.ui.core.BusyIndicator.hide();
					var res = oData.results;
					var msgTxt = res[0].Message;
					table.getRows()[0].getCells()[0].setVisible(true);
					table.getRows()[0].getCells()[1].setVisible(false);
					table.getRows()[0].getCells()[0].setTooltip(msgTxt);
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
		}

	});

});
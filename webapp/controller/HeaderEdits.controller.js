sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/Services/LineItemsServices",
		
	"dbedit/model/formatter",
	"sap/m/MessageBox"

], function(BaseController, LineItemsServices, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("dbedit.controller.HeaderEdits", {
		formatter: formatter,

		onInit: function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelHeaderEdits", "toSummaryEditHeader", this.HeaderEditData, this);
		},
		HeaderEditData: function(homeChannelHeaderEdits, toSummaryEditHeader,data) {
			debugger;
			this.BillEditModel = this.getModel("InputsModel");
			var selRowObject = this.BillEditModel.getProperty("/Inputs/selectedRow");
			var headerData = [];
			headerData.push(selRowObject);
			this.BillEditModel.setProperty("/Inputs/SelectedRowArray", headerData);
			var Otable = this.getView().byId("headerEdits");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/SelectedRowArray");
			
			if (data.button ==="Re-Price") {
				this.fnReprice(data.button);
			} else if (data.button === "Add Comments") {
				this.fnaddCommentsMethod();
			} else if (data.button === "Save") {
				this.fnHeaderEditsSave();
			}
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

				if (commnetValue) {
				
					for (var i = 0; i < selectedLines; i++) {
						Otable.getRows()[i].getCells()[2].setVisible(true);

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
				this.BillEditModel.setProperty("/Inputs/saveObjects",billEditSearchData);
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
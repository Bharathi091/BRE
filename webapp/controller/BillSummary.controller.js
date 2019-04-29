sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter"

], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("dbedit.controller.BillSummary", {

		formatter: formatter,

		onInit: function() {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelBillSummary", "toSummaryBillSummary", this.BillSummaryData, this);
		},
		BillSummaryData: function() {
			this.BillEditModel = this.getModel("InputsModel");
			var Otable = this.getView().byId("BillSummaryTable");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");
		}

	});

});
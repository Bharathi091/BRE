sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter"
], function(BaseController,formatter) {
	"use strict";

	return BaseController.extend("dbedit.controller.WrittenDown", {

	formatter: formatter,

		onInit: function() {
      
		   this.bus = sap.ui.getCore().getEventBus();

			this.bus.subscribe("homeChannelWrittenDown", "toSummaryWrittenDown", this.WrittenDownData, this);
		},
		WrittenDownData:function(){
			this.BillEditModel = this.getModel("InputsModel");
			var Otable = this.getView().byId("writtenDownTable");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");
		}

	});

});
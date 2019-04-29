sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter",
	"dbedit/Services/LineItemsServices",
], function(BaseController, formatter, LineItemsServices) {
	"use strict";

	return BaseController.extend("dbedit.controller.LineItemEdits", {

		formatter: formatter,

		onInit: function() {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelLineItemEdits", "toSummaryEditLineItem", this.LineItemEditData, this);
		},
		LineItemEditData: function(homeChannelLineItemEdits, toSummaryEditLineItem, data) {
			this.BillEditModel = this.getModel("InputsModel");
			this.serviceInstance = LineItemsServices.getInstance();
			var Otable = this.getView().byId("lineItemEdits");
			this.getLineItemsData(data['data']);
			// Otable.setModel(this.BillEditModel);
			// Otable.bindRows("/Inputs/LineitemsCopy");
		},
		LineItemEditsSelection: function() {
			var rowCount = this.byId("lineItemEdits").getSelectedIndices();
			var rowLineCount = [];
			this.BillEditModel = this.getModel("InputsModel");

			for (var i = 0; i < rowCount.length; i++) {
				rowLineCount.push(rowCount[i]);
			}
			this.getModel("InputsModel").setProperty("/Inputs/rowLineCount", rowLineCount);

			if (rowCount.length === 1) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Save", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/ReplaceWords", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/AddComments", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/RateOverride", true);
				this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", true);

			} else if (rowCount.length === 2) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/ReplaceWords", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/AddComments", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/RateOverride", false);
				this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", true);
			} else if (rowCount.length >= 3) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/ReplaceWords", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/AddComments", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", true);
				this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", false);

			} else {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Save", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Reviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UnReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/UpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/ReplaceWords", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/AddComments", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/RateOverride", false);
				this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", true);
			}
		},
		onGlobalSearch: function(oEvent) {

			debugger;

			var searchValue = this.byId("searchText2").getValue();

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
			var Otable = this.getView().byId("lineItemEdits");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");

		},
		getLineItemsData: function(Rowdata) {
			var Vbeln = Rowdata.Vbeln;
			var pspid = Rowdata.Pspid;
			this.showBusyIndicator();

			var that = this;

			$.when(that.serviceInstance.getLineItemsData(that.BillEditModel, Vbeln, that), that.serviceInstance
					.getPhaseCodes(that.BillEditModel, pspid, that), that.serviceInstance
					.getTaskcodes(that.BillEditModel, "", that), that.serviceInstance
					.getActivitycodes(that.BillEditModel, Rowdata, pspid, that), that.serviceInstance
					.getFFtaskcodes(that.BillEditModel, Rowdata, pspid, that))
				.done(function(lineItemsData, phaseCodes, taskCodes, activityCodes, ffTskCodes) {

					sap.ui.core.BusyIndicator.hide(0);

					if (lineItemsData.results.length > 0) {

						that.BillEditModel.setProperty("/LinetableResults", lineItemsData.results.length);
						var lineItems = lineItemsData.results;

						for (var i = 0; i < lineItems.length; i++) {

							lineItems[i].phaseCodes = lineItems[i].Zzphase.length ? [{
								Phasecode: lineItems[i].Zzphase,
								PhasecodeDesc: ""
							}].concat(phaseCodes.results) : phaseCodes.results;
							lineItems[i].taskCodes = lineItems[i].Zztskcd.length ? [{
								TaskCodes: lineItems[i].Zztskcd,
								TaskCodeDesc: ""
							}].concat(taskCodes.results) : taskCodes.results;
							lineItems[i].actCodes = lineItems[i].Zzactcd.length ? [{
								ActivityCodes: lineItems[i].Zzactcd,
								ActivityCodeDesc: ""
							}].concat(activityCodes.results) : activityCodes.results;
							lineItems[i].ffTskCodes = lineItems[i].Zzfftskcd.length ? [{
								FfTaskCodes: lineItems[i].Zzfftskcd,
								FfTaskCodeDesc: ""
							}].concat(ffTskCodes.results) : ffTskCodes.results;
							lineItems[i].ffActCodes = lineItems[i].Zzffactcd.length ? [{
								FfActivityCodes: lineItems[i].Zzffactcd,
								FfActivityCodeDesc: ""
							}] : [];
							lineItems[i].index = i;
							lineItems[i].indeces = i;
							lineItems[i].selectedPhaseCode = lineItems[i].Zzphase;
							lineItems[i].selectedTaskCode = lineItems[i].Zztskcd;
							lineItems[i].selectedActCode = lineItems[i].Zzactcd;
							lineItems[i].selectedFFTaskCode = lineItems[i].Zzfftskcd;
							lineItems[i].selectedFFActCode = lineItems[i].Zzffactcd;
							lineItems[i].isRowEdited = false;
						}

						that.BillEditModel.setProperty("/Inputs/LineitemsCopy", lineItems);
						var Otable = that.getView().byId("lineItemEdits");
						Otable.setModel(that.BillEditModel);
						Otable.bindRows("/Inputs/LineitemsCopy");
					} else {
						that.showAlert("Bill Edit", "No Data Found");
					}

				});

		},
		phaseCodesChange: function(oEvent) {
			var item = oEvent.getSource().getParent();
			var idx = item.getIndex();
			var thisRow = oEvent.getSource().getParent().getParent().getContextByIndex(idx).getObject();
			//var thisRow = oEvent.getSource().getBindingContext("InputsModel").getObject();
			var phaseCodeSelected = oEvent.getSource().getSelectedItem().getKey();
			var pspid = this.BillEditModel.getProperty("/Inputs/LineitemsCopy/0/Matter");
			sap.ui.core.BusyIndicator.show(0);
			var that = this;

			$.when(that.serviceInstance.getTaskcodes(that.BillEditModel, phaseCodeSelected, that),
					that.serviceInstance.getActivitycodes(that.BillEditModel, thisRow, pspid, that),
					that.serviceInstance.getFFtaskcodes(that.BillEditModel, thisRow, pspid, that))
				.done(function(taskCodes, activityCodes, ffTskCodes) {
					sap.ui.core.BusyIndicator.hide(0);

					var isTask = that.BillEditModel.getProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/Zztskcd");
					that.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/taskCodes", isTask.length ? [{
						TaskCodes: isTask,
						TaskCodeDesc: ""
					}].concat(taskCodes.results) : taskCodes.results);

					if (that.BillEditModel.getProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/Zzphase") === that.BillEditModel.getProperty(
							"/Inputs/LineitemsCopy/" + thisRow.index + "/selectedPhaseCode")) {
						that.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/selectedTaskCode", that.BillEditModel.getProperty(
							"/Inputs/LineitemsCopy/" + thisRow.index + "/Zzphase"));
					} else {
						that.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/selectedTaskCode", that.BillEditModel.getProperty(
							"/Inputs/LineitemsCopy/" + thisRow.index + "/Zztskcd"));
					}
					var isAct = that.BillEditModel.getProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/Zzactcd");
					that.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/actCodes", isAct.length ? [{
						ActivityCodes: isAct,
						ActivityCodeDesc: ""
					}].concat(activityCodes.results) : activityCodes.results);

					var isFFtsk = that.BillEditModel.getProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/Zzfftskcd");
					that.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + thisRow.index + "/ffTskCodes", isFFtsk.length ? [{
						FfTaskCodes: isFFtsk,
						FfTaskCodeDesc: ""
					}].concat(ffTskCodes.results) : ffTskCodes.results);
				});
		},
		getFFActivitycodes: function(oEvent) {

			debugger;
			var InputFields = this.getView().getModel("InputsModel");

			InputFields.setProperty("/Inputs/isChanged", true);
			var item = oEvent.getSource().getParent();
			var idx = item.getIndex();
			var thisRow = oEvent.getSource().getParent().getParent().getContextByIndex(idx).getObject();
			var ffTaskcodeselected = oEvent.getSource().getSelectedItem().getKey();
			var pspid = this.BillEditModel.getProperty("/Inputs/LineitemsCopy/0/Matter");
			var results = InputFields.getProperty("/Inputs/LineitemsCopy");
			sap.ui.core.BusyIndicator.show(0);
			var that = this;
			this.serviceInstance = LineItemsServices.getInstance();

			$.when(
				that.serviceInstance.getFFActivitycodes(that.BillEditModel, ffTaskcodeselected, pspid, that)
			)

			.done(function(ffActCodes) {

				sap.ui.core.BusyIndicator.hide(0);
				if (results.length > 0) {

					var isffact = that.BillEditModel.getProperty("/Inputs/LineitemsCopy/" + idx + "/Zzffactcd");
				that.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + idx + "/ffActCodes", isffact.length ? [{
						FfActivityCodeDesc: isffact,
						FfActivityCodeSetDesc: ""
					}].concat(ffActCodes.results) : ffActCodes.results);

				} else {
					that.showAlert("Wip Edit", "No Data Found");
				}

			});
			InputFields.setProperty("/Inputs/isChanged", true);


		}

	});

});
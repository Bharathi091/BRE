sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter",
	"dbedit/Services/LineItemsServices",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, formatter, LineItemsServices, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("dbedit.controller.LineItemEdits", {

		formatter: formatter,

		onInit: function() {

			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelLineItemEdits", "toSummaryEditLineItem", this.LineItemEditData, this);
		},
		LineItemEditData: function(homeChannelLineItemEdits, toSummaryEditLineItem, data) {
			debugger;
			if (!data.button) {
				this.BillEditModel = this.getModel("InputsModel");
				this.serviceInstance = LineItemsServices.getInstance();
				var Otable = this.getView().byId("lineItemEdits");
				this.getLineItemsData(data['data']);
			}
			// Otable.setModel(this.BillEditModel);
			// Otable.bindRows("/Inputs/LineitemsCopy");
			else {
				if (data.button === "Full Write Down") {
					this.fullWriteDown();
				} else if (data.button === "Update Codes") {
					this.onUpdateCodes(data.button);
				} else if (data.button === "Save") {
					this.fnlineItemEditsSave();
				} else if (data.button === "Reviewed" || data.button === "UnReviewed") {
					this.ReviewUnreview(data.button);
				} else if (data.button === "Add Comments") {
					this.fnaddCommentsMethod();
				} else if (data.button === "Line Item Re-Price") {
					this.fnlineItemReprice();
				} else if (data.button === "Rate Override") {
					this.fnrateOverride();
				} else if (data.button === "Bill Exact Amount") {
					this.fnbillExactAmount();
				}

				for (var i = 0; i < this.getModel("InputsModel").getProperty("/Inputs/LineitemsCopy").length; i++) {
					Otable.getRows()[this.getModel("InputsModel").getProperty("/Inputs/rowLineCount")[i]].getCells()[0].setVisible(false);
				}
			}

		},
		LineItemEditsSelection: function(oEvt) {
			debugger;
			var isAwtyp = false;
			var awtypFee = false;
			var rowCount = this.byId("lineItemEdits").getSelectedIndices();
			var rowLineCount = [];
			var lineItemEditsArr = [];
			var viewtableData = this.getModel("InputsModel").getProperty("/Inputs/LineitemsCopy");
			this.BillEditModel = this.getModel("InputsModel");

			var that = this;
			for (var i = 0; i < rowCount.length; i++) {
				rowLineCount.push(rowCount[i]);
				lineItemEditsArr.push(viewtableData[rowCount[i]]);
				if (viewtableData[rowCount[i]].Awtyp === "HARD COST") {
					isAwtyp = true;
				} else if (this.BillEditModel.getProperty("/Inputs/LineitemsCopy")[rowCount[i]].Awtyp === "FEE") {
					awtypFee = "FEE";
				}

			}
			this.getModel("InputsModel").setProperty("/Inputs/lineItemEditsSelArr", lineItemEditsArr);
			this.getModel("InputsModel").setProperty("/Inputs/rowLineCount", rowLineCount);

			if (rowCount.length === 1) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemSave", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemAddComments", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReplaceWords", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", true);
				if (awtypFee === "FEE") {
					this.BillEditModel.setProperty("/Inputs/ToolbarEnable/RateOverride", true);
				} else {
					this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", false);
				}
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemUpdateCodes", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemUnReviewed", true);

			} else if (rowCount.length >= 2) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemSave", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemAddComments", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReplaceWords", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/RateOverride", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemUpdateCodes", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemUnReviewed", true);
				if (awtypFee === "FEE") {
					this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", true);
				} else {
					this.BillEditModel.setProperty("/Inputs/Toolbar/RateOverride", false);
				}
			} else {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemSave", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Postpone", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemAddComments", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReplaceWords", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/FullWriteDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReprice", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/WriteUpDown", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/BillExactAmount", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/RateOverride", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemUpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemUnReviewed", false);
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
			debugger;
			var Vbeln = Rowdata.Vbeln;
			var pspid = Rowdata.Pspid;
			this.showBusyIndicator();

			var that = this;

			$.when(that.serviceInstance.getLineItemsData(that.BillEditModel, Vbeln, that), that.serviceInstance
					.getPhaseCodes(that.BillEditModel, pspid, that), that.serviceInstance
					.getTaskcodes(that.BillEditModel, "", that), that.serviceInstance
					.getActivitycodes(that.BillEditModel, pspid, that), that.serviceInstance
					.getFFtaskcodes(that.BillEditModel, pspid, that))
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
					that.serviceInstance.getActivitycodes(that.BillEditModel, pspid, that),
					that.serviceInstance.getFFtaskcodes(that.BillEditModel, pspid, that))
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

		},
		onUpdateCodes: function(eve) {
			debugger;

			var indices = this.getView().byId("lineItemEdits").getSelectedIndices();
			var InputFields = this.getView().getModel("InputsModel");
			var indexes = InputFields.getProperty("/Inputs/indexes");
			for (var j = 0; j < indices.length; j++) {
				indexes.push(indices[j]);
			}

			var sMsg;
			var check = false;
			if (indices.length < 1) {
				sMsg = "Please Select Atleast One item";
				this.showAlert("WIP Edit", sMsg);

			} else {

				var oView = this.getView();

				var oDialog = this._getupdateCodesDialog();
				oView.addDependent(oDialog);
				oDialog.open();
				var i = 0;
				check = true;

				if (check) {
					sap.ui.core.Fragment.byId("update", "phaseCodeChk" + i).setSelected(false);
					sap.ui.core.Fragment.byId("update", "taskCodeChk" + i).setSelected(false);
					sap.ui.core.Fragment.byId("update", "ActivityCodeChk" + i).setSelected(false);
					sap.ui.core.Fragment.byId("update", "FFTaskCodeChk" + i).setSelected(false);
					sap.ui.core.Fragment.byId("update", "FFActCodeChk" + i).setSelected(false);

					this.updatesCodes = {
						rowData: {},
						phaseCodes: {},
						taskCodes: {},
						actCodes: {},
						ffTskCodes: {},
						ffActCodes: {},
						selectedPhaseCode: "",
						selectedTaskCode: "",
						selectedActCode: "",
						selectedFFTaskCode: "",
						selectedFFActCode: ""

					};

					this.selectedRows = new JSONModel(this.updatesCodes);

					var selectedrow = this.BillEditModel.getProperty("/Inputs/LineitemsCopy/" + indices[0]);
					this.selectedRows.setProperty("/phaseCodes", selectedrow.phaseCodes);
					this.selectedRows.setProperty("/taskCodes", selectedrow.taskCodes);
					this.selectedRows.setProperty("/actCodes", selectedrow.actCodes);
					this.selectedRows.setProperty("/ffTskCodes", selectedrow.ffTskCodes);
					this.selectedRows.setProperty("/ffActCodes", selectedrow.ffActCodes);
					this.selectedRows.setProperty("/rowData", selectedrow);

					this._UpdateCodesDialog.setModel(this.selectedRows, "updatesCodesModel");

				}
			}
			InputFields.setProperty("/Inputs/isChanged", true);
			InputFields.setProperty("/Inputs/scope", this.getView().byId("WipDetailsSet2"));

		},
		_getupdateCodesDialog: function() {
			if (!this._UpdateCodesDialog) {
				this._UpdateCodesDialog = sap.ui.xmlfragment("update", "dbedit.Fragments.Dialog", this.getView().getController());
			}
			return this._UpdateCodesDialog;

		},
		UpdateCodesCancel: function() {

			this._UpdateCodesDialog.close();

		},
		UpdateCodes: function() {

			debugger;
			this.UpdateCodesCancel();

			var i = 0;

			var selectedLines = this.getModel("InputsModel").getProperty("/Inputs/rowLineCount");

			for (var c = 0; c < selectedLines.length; c++) {

				var phaseCodeChk = sap.ui.core.Fragment.byId("update", "phaseCodeChk" + i).getSelected();
				var taskCodeChk = sap.ui.core.Fragment.byId("update", "taskCodeChk" + i).getSelected();
				var ActivityCodeChk = sap.ui.core.Fragment.byId("update", "ActivityCodeChk" + i).getSelected();
				var FFTaskCodeChk = sap.ui.core.Fragment.byId("update", "FFTaskCodeChk" + i).getSelected();
				var FFActCodeChk = sap.ui.core.Fragment.byId("update", "FFActCodeChk" + i).getSelected();

				if (taskCodeChk === true && phaseCodeChk === true) {

					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/taskCodes", this.selectedRows.getProperty(
						"/taskCodes"));
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/selectedTaskCode", sap.ui.core.Fragment.byId(
						"update",
						"selectedTaskCode" + i).getSelectedKey());

				}
				if (phaseCodeChk === true) {

					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/taskCodes", this.selectedRows.getProperty(
						"/taskCodes"));
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/phaseCodes", this.selectedRows.getProperty(
						"/phaseCodes"));
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/selectedPhaseCode", sap.ui.core.Fragment.byId(
						"update",
						"selectedPhaseCode" + i).getSelectedKey());

				}
				if (ActivityCodeChk === true) {

					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/actCodes", this.selectedRows.getProperty(
						"/actCodes"));
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/selectedActCode", sap.ui.core.Fragment.byId(
						"update",
						"selectedActCode" + i).getSelectedKey());

				}
				if (FFTaskCodeChk === true) {

					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/ffTskCodes", this.selectedRows.getProperty(
						"/ffTskCodes"));
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/selectedFFTaskCode", sap.ui.core.Fragment.byId(
						"update",
						"selectedFFTaskCode" + i).getSelectedKey());
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/ffActCodes", this.selectedRows.getProperty(
						"/ffActCodes"));

				}
				if (FFActCodeChk === true && FFTaskCodeChk === true) {

					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/ffActCodes", this.selectedRows.getProperty(
						"/ffActCodes"));
					this.BillEditModel.setProperty("/Inputs/LineitemsCopy/" + selectedLines[c] + "/selectedFFActCode", sap.ui.core.Fragment.byId(
						"update",
						"selectedFFActCode" + i).getSelectedKey());
				}

			}

		},
		UpdateCodesphasecodechange: function(oEvent) {

			var phaseCodeSelected = oEvent.getSource().getSelectedItem().getKey();
			var pspid = this.BillEditModel.getProperty("/Inputs/LineitemsCopy/0/Matter");

			var that = this;

			$.when(that.serviceInstance.getTaskcodes(that.BillEditModel, phaseCodeSelected, that),
					that.serviceInstance.getActivitycodes(that.BillEditModel, pspid, that),
					that.serviceInstance.getFFtaskcodes(that.BillEditModel, pspid, that))
				.done(function(taskCodes, activityCodes, ffTskCodes) {
					that.selectedRows.setProperty("/taskCodes", taskCodes.results);
					that.selectedRows.setProperty("/actCodes", activityCodes.results);
					that.selectedRows.setProperty("/ffTskCodes", ffTskCodes.results);

				});
		},

		UpdateCodesffTaskcodechange: function(oEvent) {

			var ffTaskcodeselected = oEvent.getSource().getSelectedItem().getKey();

			var InputFields = this.getView().getModel("InputsModel");
			var pspid = this.BillEditModel.getProperty("/Inputs/LineitemsCopy/0/Matter");

			var that = this;
			this.serviceInstance = LineItemsServices.getInstance();

			$.when(
				that.serviceInstance.getFFActivitycodes(InputFields, ffTaskcodeselected, pspid, that)
			)

			.done(function(updateffActCodes) {

				that.selectedRows.setProperty("/ffActCodes", updateffActCodes.results);

			});
		},
		fullWriteDown: function() {
			var detaildata = [];
			var object = [];
			var otable = this.getView().byId("lineItemEdits");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowLineCount");

			$.each(aIndices, function(k, o) {
				var selContext = otable.getContextByIndex(o);
				var obj = selContext.getObject();
				object.push(obj);

			});

			var sMsg;
			if (object.length < 1) {
				sMsg = "Please Select Atleast One item";

			} else {

				$.each(object, function(k, o) {
					var ip_data = $.extend({}, o);
					delete ip_data.__metadata;
					delete ip_data.DBToStatus;
					delete ip_data.taxlistcopy;
					delete ip_data.FileList;
					delete ip_data.info;
					delete ip_data.imagedisplay;
					delete ip_data.isRowEdited;
					delete ip_data.isRowEditedValid;
					delete ip_data.isSelect;
					delete ip_data.ToVbeln;
					delete ip_data.ToPhase;
					delete ip_data.Ffactivitycodesdetails;
					delete ip_data.taxlistcopy;
					delete ip_data.taskcodesdetails;
					delete ip_data.activitycodesdetails;
					delete ip_data.Fftaskcodesdetails;
					delete ip_data.ToMatter;
					//new items
					delete ip_data.lineworkDate;
					delete ip_data.msg;
					delete ip_data.color;
					delete ip_data.src;
					delete ip_data.Item;
					delete ip_data.showReview;
					delete ip_data.Index;
					delete ip_data.phaseCodes;
					delete ip_data.taskCodes;
					delete ip_data.actCodes;
					delete ip_data.ffActCodes;
					delete ip_data.ffTskCodes;
					delete ip_data.index;
					delete ip_data.indeces;
					delete ip_data.selectedFFActCode;
					delete ip_data.selectedActCode;
					delete ip_data.selectedTaskCode;
					delete ip_data.selectedPhaseCode;
					delete ip_data.selectedFFTaskCode;
					delete ip_data.selectedFFActCode;

					ip_data.Narrativechange = "X";

					ip_data.ToMegbtr = "0";
					ip_data.ToWtgbtr = "0";
					ip_data.ToPercent = "100";
					detaildata.push(ip_data);

				});

				console.log(detaildata);
				var jsontopush = $.extend({}, this.BillEditModel.getProperty("/Inputs/selectedRow"));
				jsontopush.Audat = this.convertToJSONDate(jsontopush.Audat);
				jsontopush.Bstdk = this.convertToJSONDate(jsontopush.Bstdk);
				jsontopush['OrderItemSet'] = detaildata;
				this.showBusyIndicator();

				var that = this;
				LineItemsServices.getInstance().saveBillDetailOrderItemSet(that.BillEditModel, jsontopush, 'WRITEUP', that)
					.done(function(oData) {
						sap.ui.core.BusyIndicator.hide(0);

						debugger;
						// that.hideBusyIndicator();
						var LineitemsCopy = that.BillEditModel.getProperty("/Inputs/LineitemsCopy");
						var tableLineEdits = that.getView().byId("lineItemEdits");
						if (oData) {
							console.log(oData);
							// that.hideBusyIndicator();
							var results = oData;
							for (var i = 0; i < object.length; i++) {
								var message = results.Iserror;
								if (message === "") {
									message = results.Message;
								}
								object[i].info = message;
								if (
									object[i].info.indexOf("ERROR") !== -1 ||
									object[i].info.indexOf("Error") !== -1 ||
									object[i].info.indexOf("error") !== -1
								) {
									tableLineEdits.getRows()[aIndices[i]].getCells()[0].setVisible(true);
									tableLineEdits.getRows()[aIndices[i]].getCells()[0].setColor("green");
								} else {
									if (
										results.OrderItemSet.results[i].IsError !== "X" &&
										results.Iserror !== "X"
									) {
										object[i].imagedisplay =
											"./assets/images/alertsuccess.png";
									} else {
										tableLineEdits.getRows()[aIndices[i]].getCells()[0].setVisible(true);
										tableLineEdits.getRows()[aIndices[i]].getCells()[0].setColor("red");

										if (
											results.OrderItemSet.results[i].IsError !==
											"X" &&
											results.Iserror !== "X"
										) {
											tableLineEdits.getRows()[aIndices[i]].getCells()[0].setVisible(true);
											tableLineEdits.getRows()[aIndices[i]].getCells()[0].setColor("green");
										} else {
											tableLineEdits.getRows()[aIndices[i]].getCells()[0].setVisible(true);
											tableLineEdits.getRows()[aIndices[i]].getCells()[0].setColor("red");
										}
									}
								}
							}

							that.BillEditModel.setProperty("/Inputs/LineitemsCopy", LineitemsCopy);
						}
					})
					.fail(function() {
						alert("fail");
					});

			}
		},
		ReviewUnreview: function(button) {
			debugger;

			var otable = this.getView().byId("lineItemEdits");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowLineCount");
			this.BillEditModel.setProperty("/Inputs/saveObjects", []);

			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/saveObjects");

			var sMsg;
			if (aIndices.length < 1) {
				sMsg = "Please Select Atleast One item";

			} else {

				$.each(aIndices, function(k, o) {
					var selContext = otable.getContextByIndex(o);
					var obj = selContext.getObject();

					if (button === "Reviewed") {
						selContext.getModel().setProperty(selContext.getPath() + "/Zzreview", "X");
						obj.Zzreview = "X";

					} else {
						selContext.getModel().setProperty(selContext.getPath() + "/Zzreview", "");
						obj.Zzreview = "";

					}

					saveObjects.push(obj);

				});

			}

			var transferitems = [];
			$.each(saveObjects, function(i, el) {
				if ($.inArray(el, transferitems) === -1) transferitems.push(el);
			});
			var detaildata = [];
			var sMsg = '';
			if (transferitems.length < 1) {
				sMsg = "Please change Atleast One item";

			} else {
				if (transferitems.length !== 0) {
					$.each(transferitems, function(item, Obj) {
						var ip_data = $.extend({}, Obj);
						delete ip_data.__metadata;
						delete ip_data.DBToStatus;
						delete ip_data.taxlistcopy;
						delete ip_data.FileList;
						delete ip_data.info;
						delete ip_data.imagedisplay;
						delete ip_data.isRowEdited;
						delete ip_data.isRowEditedValid;
						delete ip_data.isSelect;
						delete ip_data.ToVbeln;
						delete ip_data.ToPhase;
						delete ip_data.Ffactivitycodesdetails;
						delete ip_data.taxlistcopy;
						delete ip_data.taskcodesdetails;
						delete ip_data.activitycodesdetails;
						delete ip_data.Fftaskcodesdetails;
						delete ip_data.ToMatter;
						//new items
						delete ip_data.lineworkDate;
						delete ip_data.msg;
						delete ip_data.color;
						delete ip_data.src;
						delete ip_data.Item;
						delete ip_data.showReview;
						delete ip_data.Index;
						delete ip_data.phaseCodes;
						delete ip_data.taskCodes;
						delete ip_data.activityCodes;
						delete ip_data.actCodes;
						delete ip_data.selectedActCode;
						delete ip_data.selectedPhaseCode;
						delete ip_data.selectedTaskCode;
						delete ip_data.selectedFFTaskCode;
						delete ip_data.selectedFFActCode;
						delete ip_data.ffTskCodes;
						delete ip_data.ffActCodes;
						delete ip_data.indeces;
						delete ip_data.index;
						delete ip_data.isRowEdited;
						ip_data.Narrativechange = "X";

						ip_data.ToMegbtr = ip_data.ToMegbtr.toString();
						ip_data.ToWtgbtr = ip_data.ToWtgbtr.toString();
						detaildata.push(ip_data);
					});
					console.log(detaildata);
					var jsontopush = $.extend({}, this.BillEditModel.getProperty("/Inputs/selectedRow"));
					jsontopush.Audat = this.convertToJSONDate(jsontopush.Audat);
					jsontopush.Bstdk = this.convertToJSONDate(jsontopush.Bstdk);
					jsontopush['OrderItemSet'] = detaildata;

					var that = this;
					LineItemsServices.getInstance().saveBillDetailOrderItemSet(that.BillEditModel, jsontopush, 'LINEEDIT', that)
						.done(function(oData) {
							// that.hideBusyIndicator();
							var LineitemsCopy = that.BillEditModel.getProperty("/Inputs/LineitemsCopy");
							if (oData) {
								// that.hideBusyIndicator();
								var results = oData;
								var message = results.Message;
								// that.showAlert("Bill Edit", message);

								if (!button) {
									MessageBox.show(
										message, {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Success",
											actions: [sap.m.MessageBox.Action.OK]
										}
									);
								} else {
									MessageBox.show(button);
									for (var i = 0; i < aIndices.length; i++) {
										otable.getRows()[aIndices[i]].getCells()[0].setVisible(true);

										if (button === "Reviewed") {
											otable.getRows()[aIndices[i]].getCells()[0].setTooltip("Reviewed");
										} else {
											otable.getRows()[aIndices[i]].getCells()[0].setTooltip("Unreviewed");
										}

									}

								}
								that.BillEditModel.setProperty("/Inputs/LineitemsCopy", LineitemsCopy);
								that.BillEditModel.setProperty("/Inputs/saveObjects", []);
								// that.refreshTable();
							}

						})
						.fail(function() {
							// that.hideBusyIndicator();
						});

				}
			}
		},
		fnaddCommentsMethod: function() {
			debugger;
			alert("add Comments");
			var index = this.getModel("InputsModel").getProperty("/Inputs/rowLineCount");
			this.results = this.getModel("InputsModel").getProperty("/Inputs/LineitemsCopy");
			var selRowObject = this.results[index];
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

				this._addCommentsDialog = sap.ui.xmlfragment("dialogAddCommentLineItem", "dbedit.Fragments.Addcomments", this.getView().getController());

			}
			return this._addCommentsDialog;
		},
		comDialogClosedWithOk: function() {
			debugger;

			var selectedLines = this.getModel("InputsModel").getProperty("/Inputs/SelectedRowArray").length;

			var Otable = this.getView().byId("lineItemEdits");
			this.comment = [];
			var comment = sap.ui.core.Fragment.byId("dialogAddCommentLineItem", "TypeHere");
			for (var c = 0; c < selectedLines; c++) {
				var selContext = Otable.getContextByIndex(c);
				var obj = selContext.getObject();
				var commnetValue = comment.getValue();
				console.log(commnetValue);
				obj.WfComments = commnetValue;

				if (commnetValue) {

					for (var i = 0; i < selectedLines; i++) {
						Otable.getRows()[i].getCells()[27].setVisible(true);

					}
				}
				this.results[c] = obj;
			}
			this.BillEditModel.setProperty("/Inputs/LineitemsCopy", this.results);
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
				this._commentsDialog = sap.ui.xmlfragment("dialogCommentLineItem", "dbedit.Fragments.comments", this.getView().getController());

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

		//lineItem Reprice

		fnlineItemReprice: function() {
			var selectedIndices = this.byId("lineItemEdits").getSelectedIndices();
			this.getModel("InputsModel").setProperty("/Inputs/lineItemEditIndexes", selectedIndices);

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
			debugger;
			var oTable = this.getView().byId("lineItemEdits");
			var selectedIndices = this.getModel("InputsModel").getProperty("/Inputs/lineItemEditIndexes");

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

				for (var i = 0; i < selectedIndices.length; i++) {
					oTable.getRows()[selectedIndices[i]].getCells()[0].setVisible(true);
					oTable.getRows()[selectedIndices[i]].getCells()[1].setVisible(false);
					oTable.getRows()[selectedIndices[i]].getCells()[0].setTooltip(message);
				}

				// that.BillEditModel.setProperty("/Inputs/SelectedRowArray", results);

			}, function(data) {
				MessageBox.show(JSON.parse(data.responseText).error.message.value);
			});

			this._RePriceDialog.close();

		},

		RePriceDialogClosedWithCancel: function() {
			this._RePriceDialog.close();
		},
	
		fnbillExactAmount: function() {
			debugger;
			this._getBillExactDialog().open();
			var billAmt = this.BillEditModel.getProperty("/Inputs/selectedRow").NetAmount;
			this.BillEditModel.setProperty("/Inputs/BillAmount", billAmt);
			this.BillEditModel.setProperty("/Inputs/message", "");
		},
		_getBillExactDialog: function() {

			if (!this._billExactDialog) {
				this._billExactDialog = sap.ui.xmlfragment("billExactAmount", "dbedit.Fragments.BillExactAmount", this);
				this.getView().addDependent(this._billExactDialog);
			}
			return this._billExactDialog;
		},
		closeBillExactAmountDialog: function() {

			this._getBillExactDialog().close();
		},
		fnsaveBillExactAmount: function() {
			var batchChanges = [];
			var billExactAmt = sap.ui.core.Fragment.byId("billExactAmount", "billExactAmt").getValue();
			this.BillEditModel = this.getModel("InputsModel");
			var sel1 = sap.ui.core.Fragment.byId("billExactAmount", "sel1").getSelectedKey();
			var sel2 = sap.ui.core.Fragment.byId("billExactAmount", "sel2").getSelectedKey();
			var ServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;
			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/selectedRow");
			saveObjects.Action = "AMOUNTUPD";
			saveObjects.Zzbeamount = billExactAmt;
			saveObjects.Zzbeflag = sel1;
			saveObjects.Zzawtypflag = sel2;
			saveObjects.OrderItemSet = [];
			saveObjects.isattachment = this.BillEditModel.getProperty("/Inputs/selectedRow").Vbeln;
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
				that.BillEditModel.setProperty("/Inputs/message", message);

			}, function(er) {});
		},
		fnlineItemEditsSave: function() {
			debugger;
			var otable = this.getView().byId("lineItemEdits");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowLineCount");
			var saveArr = this.getModel("InputsModel").getProperty("/Inputs/lineItemEditsSelArr");
			var transferitems = [];
			$.each(saveArr, function(i, el) {
				if ($.inArray(el, transferitems) === -1) transferitems.push(el);
			});
			var detaildata = [];
			var sMsg = '';
			if (transferitems.length < 1) {
				sMsg = "Please change Atleast One item";

			} else {
				if (transferitems.length !== 0) {
					$.each(transferitems, function(item, Obj) {
						var ip_data = $.extend({}, Obj);
						delete ip_data.__metadata;
						ip_data.Zzactcd = ip_data.selectedActCode;
						ip_data.Zztskcd = ip_data.selectedTaskCode;
						ip_data.Zzphase = ip_data.selectedPhaseCode;
						ip_data.Zzffactcd = ip_data.selectedFFActCode;
						ip_data.Zzfftskcd = ip_data.selectedFFTaskCode;
						delete ip_data.selectedActCode;
						delete ip_data.selectedTaskCode;
						delete ip_data.selectedPhaseCode;
						delete ip_data.selectedFFActCode;
						delete ip_data.selectedFFTaskCode;
						delete ip_data.taskCodes;
						delete ip_data.phaseCodes;
						delete ip_data.actCodes;
						delete ip_data.ffActCodes;
						delete ip_data.ffTskCodes;
						delete ip_data.indeces;
						delete ip_data.index;
						delete ip_data.isRowEdited;
						delete ip_data.DBToStatus;
						delete ip_data.taxlistcopy;
						delete ip_data.FileList;
						delete ip_data.info;
						delete ip_data.imagedisplay;
						delete ip_data.isRowEdited;
						delete ip_data.isRowEditedValid;
						delete ip_data.isSelect;
						delete ip_data.ToVbeln;
						delete ip_data.ToPhase;
						delete ip_data.Ffactivitycodesdetails;
						delete ip_data.taxlistcopy;
						delete ip_data.taskcodesdetails;
						delete ip_data.activitycodesdetails;
						delete ip_data.Fftaskcodesdetails;
						delete ip_data.ToMatter;
						//new items
						delete ip_data.lineworkDate;
						delete ip_data.msg;
						delete ip_data.color;
						delete ip_data.src;
						delete ip_data.Item;
						delete ip_data.showReview;
						delete ip_data.Index;

						ip_data.ToMegbtr = ip_data.ToMegbtr.toString();
						ip_data.ToWtgbtr = ip_data.ToWtgbtr.toString();
						detaildata.push(ip_data);
					});
					console.log(detaildata);
					var jsontopush = $.extend({}, this.BillEditModel.getProperty("/Inputs/selectedRow"));
					jsontopush.Audat = this.convertToJSONDate(jsontopush.Audat);
					jsontopush.Bstdk = this.convertToJSONDate(jsontopush.Bstdk);
					jsontopush['OrderItemSet'] = detaildata;

					var that = this;
					LineItemsServices.getInstance().saveBillDetailOrderItemSet(that.BillEditModel, jsontopush, 'LINEEDIT', that)
						.done(function(oData) {
							// that.hideBusyIndicator();
							// var LineitemsCopy = that.BillEditModel.getProperty("/Inputs/LineitemsCopy");
							if (oData) {
								// that.hideBusyIndicator();
								var results = oData;
								var message = results.Message;
								// that.showAlert("Bill Edit", message);
								for (var i = 0; i < aIndices.length; i++) {
									otable.getRows()[aIndices[i]].getCells()[0].setVisible(true);
									otable.getRows()[aIndices[i]].getCells()[0].setTooltip(message);

								}

							
							}

						})
						.fail(function() {
							// that.hideBusyIndicator();
						});

				}
			}
		},
			fnrateOverride: function() {
			debugger;

			var oTable = this.getView().byId("lineItemEdits");
			this._getrateOverrideDialog().open();
			var idx = oTable.getSelectedIndex();
			var oTbl = sap.ui.core.Fragment.byId("RateOverride", "rateOverridetable");
			var ctx = oTable.getContextByIndex(idx);
			var obj = ctx.getObject();
			var RateOverrideobj = [];
			RateOverrideobj.push(obj);
			this.BillEditModel.setProperty("/Inputs/RateOverrideobj1", RateOverrideobj);
			$.each(oTable.getSelectedIndices(), function(i, o) {

				var Action = obj.Action;
				var Sname = obj.Sname;
				var BaseRate = obj.BaseRate;
				var BaseQty = obj.BaseQty;
				var BaseValue = obj.BaseValue;
				var ActualRate = obj.ActualRate;
				var ActualQty = obj.ActualQty;
				var ActualValue = obj.ActualValue;
				oTbl.addItem(new sap.m.ColumnListItem({
					cells: [new sap.ui.core.Icon({
							src: "sap-icon://alert",
							visible: false,
							color: "red",
							useIconTooltip: true
						}),
						new sap.m.Text({
							width: "100%",
							text: Sname
						}),
						new sap.m.Text({
							width: "100%",
							text: BaseRate
						}),
						new sap.m.Text({
							width: "100%",
							text: BaseQty
						}),
						new sap.m.Text({
							width: "100%",
							text: BaseValue
						}),
						new sap.m.Text({
							width: "100%",
							text: ActualRate
						}),
						new sap.m.Text({
							width: "100%",
							text: ActualQty
						}),
						new sap.m.Text({
							width: "100%",
							text: ActualValue
						})

					]
				}));
			});

		},
		_getrateOverrideDialog: function() {
			if (!this._rateOverrideDialog) {
				this._rateOverrideDialog = sap.ui.xmlfragment("RateOverride", "dbedit.Fragments.RateOverride", this.getView().getController());

			}
			return this._rateOverrideDialog;
		},
		closeRateOverrideDialog: function() {
			this._getrateOverrideDialog().close();
			var oTable = sap.ui.core.Fragment.byId("RateOverride", "rateOverridetable");
			$.each(oTable.getItems(), function(i, o) {
				var rowid = o.getId();
				oTable.removeItem(rowid);
			});

		},
		onRateOverrideSave: function() {
			debugger;
			var transferitems = [];
			var RateOverrideobj = this.BillEditModel.getProperty("/Inputs/RateOverrideobj1");
			$.each(RateOverrideobj, function(i, el) {
				if ($.inArray(el, transferitems) === -1) transferitems.push(el);
			});
			var detaildata = [];
			var sMsg = '';
			if (transferitems.length < 1) {
				sMsg = "Please change Atleast One item";

			} else {
				if (transferitems.length !== 0) {
					$.each(transferitems, function(item, Obj) {
						var ip_data = $.extend({}, Obj);
						delete ip_data.__metadata;
						delete ip_data.DBToStatus;
						delete ip_data.taxlistcopy;
						delete ip_data.FileList;
						delete ip_data.info;
						delete ip_data.imagedisplay;
						delete ip_data.isRowEdited;
						delete ip_data.isRowEditedValid;
						delete ip_data.isSelect;
						delete ip_data.ToVbeln;
						delete ip_data.ToPhase;
						delete ip_data.Ffactivitycodesdetails;
						delete ip_data.taxlistcopy;
						delete ip_data.taskcodesdetails;
						delete ip_data.activitycodesdetails;
						delete ip_data.Fftaskcodesdetails;
						delete ip_data.ToMatter;
						//new items
						delete ip_data.lineworkDate;
						delete ip_data.msg;
						delete ip_data.color;
						delete ip_data.src;
						delete ip_data.Item;
						delete ip_data.showReview;
						delete ip_data.Index;
						delete ip_data.phaseCodes;
						delete ip_data.taskCodes;
						delete ip_data.activityCodes;
						delete ip_data.actCodes;
						delete ip_data.selectedActCode;
						delete ip_data.selectedPhaseCode;
						delete ip_data.selectedTaskCode;
						delete ip_data.selectedFFTaskCode;
						delete ip_data.selectedFFActCode;
						delete ip_data.ffTskCodes;
						delete ip_data.ffActCodes;
						delete ip_data.indeces;
						delete ip_data.index;
						delete ip_data.isRowEdited;
						ip_data.Narrativechange = "X";

						ip_data.ToMegbtr = ip_data.ToMegbtr.toString();
						ip_data.ToWtgbtr = ip_data.ToWtgbtr.toString();
						detaildata.push(ip_data);
					});
					console.log(detaildata);
					var jsontopush = $.extend({}, this.BillEditModel.getProperty("/Inputs/selectedRow"));
					jsontopush.Audat = this.convertToJSONDate(jsontopush.Audat);
					jsontopush.Bstdk = this.convertToJSONDate(jsontopush.Bstdk);
					jsontopush['OrderItemSet'] = detaildata;

					var that = this;
					LineItemsServices.getInstance().saveBillDetailOrderItemSet(that.BillEditModel, jsontopush, 'RATE', that)
						.done(function(oData) {
							// that.hideBusyIndicator();
							var LineitemsCopy = that.BillEditModel.getProperty("/Inputs/LineitemsCopy");
							if (oData) {
								// that.hideBusyIndicator();
								var results = oData;
								var message = results.OrderItemSet.results[0].Message;
								// that.showAlert("Bill Edit", message);

								var oTable = sap.ui.core.Fragment.byId("RateOverride", "rateOverridetable");

								var cells = oTable.getItems()[0].getCells();

								cells[0].setProperty("visible", true);
								cells[0].setTooltip(message);

								that.BillEditModel.setProperty("/Inputs/LineitemsCopy", LineitemsCopy);

								// that.refreshTable();

							}

						})
						.fail(function() {
							// that.hideBusyIndicator();
						});

				}
			}

		}

	});

});
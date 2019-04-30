sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter",
	"dbedit/Services/LineItemsServices",
		"sap/m/MessageBox"
], function(BaseController, formatter, LineItemsServices,MessageBox) {
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
					this.fnLineItemTransfersSave();
				} else if (data.button === "Updatecodes") {
					this.onUpdateCodes();
				} else if (data.button === "Consolidate") {
					this.onConsolidate();
				} else if (data.button === "Transfer") {
					this.onMassTransfer();
				} else if (data.button === "Split Transfer") {
					this.onSplitTransfer();
				} else if(data.button === "Reviewed" || data.button === "UnReviewed"){
					this.ReviewUnreview(data.button);
				}

			}

		},
		LineItemTransferSelection: function() {
			var rowCount = this.byId("lineItemtransfers").getSelectedIndices();
			var rowLineCount1 = [];
			this.BillEditModel = this.getModel("InputsModel");
			var lineItemTransfersArr = [];
			var viewtableData = this.getModel("InputsModel").getProperty("/Inputs/LineitemsCopy");
			for (var i = 0; i < rowCount.length; i++) {
				rowLineCount1.push(rowCount[i]);
				lineItemTransfersArr.push(viewtableData[rowCount[i]]);
			}
			this.getModel("InputsModel").setProperty("/Inputs/lineItemTransfersSelArr", lineItemTransfersArr);
			this.getModel("InputsModel").setProperty("/Inputs/rowLineTransferCount", rowLineCount1);

			if (rowCount.length === 1) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferSave", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", true);

			} else if (rowCount.length === 2) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferSave", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);
			} else if (rowCount.length >= 3) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferSave", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);

			} else {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferSave", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUnReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/LineItemTransferUpdateCodes", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Transfer", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/Consolidate", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/SplitTransfer", false);
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
		ReviewUnreview: function(button) {
			debugger;

			var otable = this.getView().byId("lineItemtransfers");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowLineTransferCount");
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
		onSplitTransfer: function() {
			debugger;
			var oTable = this.getView().byId("lineItemtransfers");
			this._getSplitDialog().open();
			var idx = oTable.getSelectedIndex();
			var ctx = oTable.getContextByIndex(idx);
			var obj = ctx.getObject();
			var matter = obj.Phase;
			var quantity = obj.ActualQty;
			var draftBill = obj.Vbeln;
			this.docno = obj.Belnr;
			var selPhase = obj.ToPhase;
			var selTask = obj.ToZztskcd;
			var selAct = obj.ToZzactcd;
			var selFfTsk = obj.ToZzfftskcd;
			var selFfAct = obj.ToZzffactcd;
			this.BillEditModel.setProperty("/matter", matter);
			this.BillEditModel.setProperty("/draftBill", draftBill);
			this.BillEditModel.setProperty("/quantity", quantity);
			this.BillEditModel.setProperty("/docno", this.docno);
			this.BillEditModel.setProperty("/selPhase", selPhase);
			this.BillEditModel.setProperty("/selTask", selTask);
			this.BillEditModel.setProperty("/selAct", selAct);
			this.BillEditModel.setProperty("/selFfTsk", selFfTsk);
			this.BillEditModel.setProperty("/selFfAct", selFfAct);
			this.createNewtableColumns();
			this.handleAddRow(1);

		},
		_getSplitDialog: function() {

			if (!this._splitDialog) {
				this._splitDialog = sap.ui.xmlfragment("splitTransfer", "dbedit.Fragments.splittransfer", this);
				this.getView().addDependent(this._splitDialog);
			}
			return this._splitDialog;
		},
		closeSplitDialog: function() {

			this._getSplitDialog().close();
			var oTable = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			$.each(oTable.getItems(), function(i, o) {
				var rowid = o.getId();
				oTable.removeItem(rowid);
			});
			this.getView().getModel("InputsModel").setProperty("/Inputs/Columns", [{
				Pspid: "",
				Zzphase: [],
				Zzactcd: [],
				Zztskcd: [],
				Zzfftskcd: [],
				Zzffactcd: [],
				Megbtr: "",
				Percent: ""
			}]);
			oTable.destroyColumns();
		},
		createNewtableColumns: function() {

			var oTbl = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var columns = this.getView().getModel("InputsModel").getProperty("/Inputs/createcontrols");
			for (var k = 0; k < columns.length; k++) {
				var col = columns[k];
				oTbl.addColumn(new sap.m.Column({
					header: new sap.m.Label({
						text: col.userCol

					})

				}));
			}

		},
		handleAddRow: function(count, userObj) {

			var arr = [];
			if (typeof userObj === "object" && userObj.constructor === Array) {
				arr = userObj;

			} else {
				arr.push(userObj);
			}

			var oTbl = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var columnsCount = 0;
			if (count > 0) {
				columnsCount = count;
			} else {
				columnsCount = arr.length;
			}

			var that = this;
			for (var i = 0; i < columnsCount; i++) {

				var obj = jQuery.extend({}, that.getView().getModel("InputsModel").getProperty("/Inputs/Columns"));
				var FirstTableitems;
				var oContext;
				if (count > 0) {
					FirstTableitems = this.getTableItems();
					oContext = this._createTableItemContext(obj);
				} else {
					var currentObj = jQuery.extend({}, arr[i]);
					FirstTableitems = this.getTableItems(currentObj);
					var obj1 = that.getView().getModel("InputsModel").getProperty("/Inputs/currentCol");
					oContext = this._createTableItemContext(obj1);
				}
				FirstTableitems.setBindingContext(oContext);
				oTbl.addItem(FirstTableitems);
				var rows = oTbl.getItems();
				for (var k = 0; k <= rows.length; k++) {
					if (k === 0) {
						var delayInvk = (function(itm) {
							return function() {
								var smartfieldIndexes = that.getView().getModel("InputsModel").getProperty("/Inputs/editableIndexes");
								for (var j = 0; j < smartfieldIndexes.length; j++) {
									var c = itm.getCells()[smartfieldIndexes[j]];
									c.setEditable(true);
								}
							};
						})(FirstTableitems);
					}
					if (k > 1) {
						var delayInvk = (function(itm) {
							return function() {
								var smartfieldIndexes = that.getView().getModel("InputsModel").getProperty("/Inputs/editableIndexes");
								for (var j = 0; j < smartfieldIndexes.length; j++) {
									var c = itm.getCells()[smartfieldIndexes[j]];
									c.setEditable(false);
								}
							};
						})(FirstTableitems);
					}
				}
				jQuery.sap.delayedCall(500, this, delayInvk);
			}

		},
		_createTableItemContext: function(data) {

			var sets = "BillSummarySet";
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry(sets, {
				properties: data
			});
			return oContext;
		},
		getTableItems: function(items) {

			var oTbl = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var rows = oTbl.getItems();
			var len = rows.length;
			var newcolumns = this.getView().getModel("InputsModel").getProperty("/Inputs/createcontrols");
			var col = [];
			var currentObj = {};

			for (var i = 0; i < newcolumns.length; i++) {
				var item = newcolumns[i];
				if (item.type === "smartfield") {
					var field = new sap.ui.comp.smartfield.SmartField({
						value: "{" + item.key + "}",
						editable: "{InputsModel>isEditable}",
						change: $.proxy(this.handlChange, this)

					});
					col.push(field);
					if (items) {
						if (items.hasOwnProperty(item.key)) {
							currentObj[item.key] = items[item.key];
						} else {
							currentObj[item.key] = "";
						}
					} else {
						currentObj[item.key] = "";
					}
				}
				if (item.type === "Select") {
					if (item.key === "ToPhase") {
						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Columns/" + len + "/selPhaseKey}",
							items: {
								path: "InputsModel>/Inputs/Columns/" + len + "/ToPhase",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>Phasecode}",
									text: "{InputsModel>Phasecode} {InputsModel>PhasecodeDesc}"
								}),
								templateShareable: true
							},
							change: $.proxy(this.splitPhaseCodesChange, this)
						});

						col.push(field);
						if (items) {
							if (items.hasOwnProperty(item.key)) {
								currentObj[item.key] = items[item.key];
							} else {
								currentObj[item.key] = "";
							}
						} else {
							currentObj[item.key] = "";
						}

					} else if (item.key === "ToZzactcd") {
						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Columns/" + len + "/selActKey}",

							items: {
								path: "InputsModel>/Inputs/Columns/" + len + "/ToZzactcd",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>ActivityCodes}",
									text: "{InputsModel>ActivityCodes} {InputsModel>ActivityCodeDesc}"
								}),
								templateShareable: true
							}

						});

						col.push(field);
						if (items) {
							if (items.hasOwnProperty(item.key)) {
								currentObj[item.key] = items[item.key];
							} else {
								currentObj[item.key] = "";
							}
						} else {
							currentObj[item.key] = "";
						}

					} else if (item.key === "ToZztskcd") {

						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Columns/" + len + "/selTskKey}",
							items: {
								path: "InputsModel>/Inputs/Columns/" + len + "/ToZztskcd",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>TaskCodes}",
									text: "{InputsModel>TaskCodes} {InputsModel>TaskCodeDesc}"

								}),
								templateShareable: true
							}

						});

						col.push(field);
						if (items) {
							if (items.hasOwnProperty(item.key)) {
								currentObj[item.key] = items[item.key];
							} else {
								currentObj[item.key] = "";
							}
						} else {
							currentObj[item.key] = "";
						}

					} else if (item.key === "ToZzfftskcd") {

						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Columns/" + len + "/selFfTskKey}",
							items: {
								path: "InputsModel>/Inputs/Columns/" + len + "/ToZzfftskcd",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>FfTaskCodes}",
									text: "{InputsModel>FfTaskCodes} {InputsModel>FfTaskCodeDesc}"

								}),
								templateShareable: true
							},
							change: $.proxy(this.splitFfTaskCodesChange, this)

						});

						col.push(field);
						if (items) {
							if (items.hasOwnProperty(item.key)) {
								currentObj[item.key] = items[item.key];
							} else {
								currentObj[item.key] = "";
							}
						} else {
							currentObj[item.key] = "";
						}
					} else if (item.key === "ToZzffactcd") {
						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Columns/" + len + "/selFfActKey}",
							items: {
								path: "InputsModel>/Inputs/Columns/" + len + "/ToZzffactcd",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>FfActivityCodes}",
									text: "{InputsModel>FfActivityCodes} {InputsModel>FfActivityCodeDesc}"

								}),
								templateShareable: true
							}

						});

						col.push(field);
						if (items) {
							if (items.hasOwnProperty(item.key)) {
								currentObj[item.key] = items[item.key];
							} else {
								currentObj[item.key] = "";
							}
						} else {
							currentObj[item.key] = "";
						}

					} else  {
						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Columns/" + len + "/seldbno}",
							items: {
								path: "InputsModel>/Inputs/Columns/" + len + "/Vbeln",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>Vbeln}",
									text: "{InputsModel>Vbeln}"

								}),
								templateShareable: true
							},
							change: $.proxy(this.fnSplitDraftBillNoChange, this)

						});

						col.push(field);
						if (items) {
							if (items.hasOwnProperty(item.key)) {
								currentObj[item.key] = items[item.key];
							} else {
								currentObj[item.key] = "";
							}
						} else {
							currentObj[item.key] = "";
						}
					}

				}

				if (item.type === "Input") {
					var field = new sap.m.Input({
						value: "{" + item.key + "}"
					});
					col.push(field);
					if (items) {
						if (items.hasOwnProperty(item.key)) {
							currentObj[item.key] = items[item.key];
						} else {
							currentObj[item.key] = "";
						}
					} else {

						currentObj[item.key] = "";

					}

				}
				if (item.type === "DatePicker") {
					var field = new sap.m.DatePicker({
						value: {
							path: item.key,
							type: 'sap.ui.model.type.Date',
							formatOptions: {
								displayFormat: "medium",
								strictParsing: true
									//	UTC: true
							}
						}

					});
					col.push(field);
					if (items) {
						if (items.hasOwnProperty(item["key"])) {
							currentObj[item.key] = items[item.key];
						} else {
							currentObj[item.key] = "";
						}
					} else {

						currentObj[item.key] = "";

					}

				}
				if (item.type === "Icon") {
					var field = new sap.ui.core.Icon({
						src: "sap-icon://alert",
						visible: false,
						color: "red"

					});
					col.push(field);
				}
				if (item.type === "Text") {
					var field = new sap.m.Text({
						text: "{" + item.key + "}"

					});
					col.push(field);
					if (items) {
						if (items.hasOwnProperty(item.key)) {
							currentObj[item.key] = items[item.key];
						} else {
							currentObj[item.key] = "";
						}
					} else {

						currentObj[item.key] = "";

					}

				}
				if (len <= 0) {
					if (item.type === "Button") {
						var field = new sap.m.Button({
							// text: "ADD",
							icon: "sap-icon://add",
							press: $.proxy(this.onAdd, this)
						});
						col.push(field);

					}
				} else {
					if (item.type === "Button") {
						var field = new sap.m.Button({
							// text: "Delete",
							icon: "sap-icon://delete",
							press: $.proxy(this.onDelete, this)
						});
						col.push(field);
					}
				}
			}
			var tableitems = new sap.m.ColumnListItem({
				cells: col
			});
			this.getView().getModel("InputsModel").setProperty("/Inputs/currentCol", currentObj);
			return tableitems;
		},
		handlChange: function(evt) {
			debugger;
			var oSource = evt.getSource();
			var items = oSource.getParent();
			var delayInvk = (function(itm) {
				return function() {
					var c = itm.getCells()[0];
					c.setEditable(true);
				};
			})(items);
			var aPath = oSource.getBindingContext().getPath();
			var Model = oSource.getBindingContext().getModel();
			var Pspid = evt.getParameter("value");
			if (evt.getParameter("value")) {
				Model.setProperty(aPath + "/" + oSource.getBindingPath('value'), evt.getParameter("value"));

			} else {
				Model.setProperty(aPath + "/" + oSource.getBindingPath('value'), evt.getParameter("value"));
				Pspid = evt.getParameter("value");
			}
			jQuery.sap.delayedCall(500, this, delayInvk);
			this.BillEditModel = this.getModel("InputsModel");
			this.serviceInstance = LineItemsServices.getInstance();
			var InputFields = this.getView().getModel("InputsModel");
			var that = this;
			$.when(
				that.serviceInstance.getPhaseCodes(that.BillEditModel, Pspid, that),
				that.serviceInstance.getActivitycodes(that.BillEditModel, Pspid, that),
				that.serviceInstance.getFFtaskcodes(that.BillEditModel, Pspid, that),
				that.serviceInstance.getDraftBillNumbers(that.BillEditModel, Pspid, that))

			.done(function(phaseCodes, activityCodes, ffTskCodes, draftBillNos) {
				debugger;
				phaseCodes.results.unshift("");
				activityCodes.results.unshift("");
				ffTskCodes.results.unshift("");
				InputFields.getProperty("/Inputs/Columns")[0].Pspid = Pspid;
				InputFields.getProperty("/Inputs/Columns")[0].ToPhase = phaseCodes.results;
				InputFields.getProperty("/Inputs/Columns")[0].ToZzactcd = activityCodes.results;
				InputFields.getProperty("/Inputs/Columns")[0].ToZzfftskcd = ffTskCodes.results;
				InputFields.getProperty("/Inputs/Columns")[0].Vbeln = draftBillNos.results;
				InputFields.setProperty("/Inputs/Columns/0/ToPhase", phaseCodes.results);
				InputFields.setProperty("/Inputs/Columns/0/ToZzactcd", activityCodes.results);
				InputFields.setProperty("/Inputs/Columns/0/ToZzfftskcd", ffTskCodes.results);
				InputFields.setProperty("/Inputs/Columns/0/Vbeln", draftBillNos.results);
			});
		},
		onAdd: function(oEvt) {

			var InputFields = this.getView().getModel("InputsModel");
			var oTable = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var rows = oTable.getItems();
			var len = rows.length;
			var cells = oTable.getItems()[0].getCells();
			var hours = cells[7].getValue();
			var percentage = cells[8].getValue();
			var selDbKey = cells[1].getSelectedKey();
			var selPhaseKey = cells[2].getSelectedKey();
			var selTskKey = cells[3].getSelectedKey();
			var selActKey = cells[4].getSelectedKey();
			var selFfTskKey = cells[5].getSelectedKey();
			var selFfActKey = cells[6].getSelectedKey();
			if (hours) {
				InputFields.getProperty("/Inputs/Columns")[0].ActualQty = parseFloat(hours);
			}
			if (percentage) {
				InputFields.getProperty("/Inputs/Columns")[0].Percent = parseFloat(percentage);
			}
			if (selDbKey) {
				InputFields.getProperty("/Inputs/Columns")[0].seldbno = selDbKey;
			}
			if (selPhaseKey) {
				InputFields.getProperty("/Inputs/Columns")[0].selPhaseKey = selPhaseKey;
			}
			if (selTskKey) {
				InputFields.getProperty("/Inputs/Columns")[0].selTskKey = selTskKey;
			}
			if (selActKey) {
				InputFields.getProperty("/Inputs/Columns")[0].selActKey = selActKey;
			}
			if (selFfTskKey) {
				InputFields.getProperty("/Inputs/Columns")[0].selFfTskKey = selFfTskKey;
			}
			if (selFfActKey) {
				InputFields.getProperty("/Inputs/Columns")[0].selFfActKey = selFfActKey;
			}

			InputFields.getProperty("/Inputs/Columns").push(InputFields.getProperty("/Inputs/Columns")[0]);
			var iRowIndex = 0;
			var oModel = oTable.getModel();
			var aItems = oTable.getItems();
			this.handleAddRow(0, InputFields.getProperty("/Inputs/Columns")[len]);
			InputFields.getProperty("/Inputs/Columns")[0] = {
				Pspid: "",
				Vbeln: [],
				ToPhase: [],
				ToZztskcd: [],
				ToZzactcd: [],
				ToZzfftskcd: [],
				ToZzffactcd: [],
				ActualQty: "",
				Percent: "",
				selPhaseKey: ""
			};
			oModel.setProperty(aItems[iRowIndex].getBindingContext().getPath() + "/Pspid", "");
			cells[1].setSelectedKey("");
			cells[2].setSelectedKey("");
			cells[3].setSelectedKey("");
			cells[4].setSelectedKey("");
			cells[5].setSelectedKey("");
			cells[6].setSelectedKey("");
			cells[7].setValue("");
			cells[8].setValue("");

		},
		onDelete: function(oEvt) {
			var src = oEvt.getSource().getParent();
			var rowid = src.getParent().indexOfItem(src);
			var InputFields = this.getView().getModel("InputsModel");
			var tablelength = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2").getItems().length;
			var oTable = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			if (tablelength - 1 === rowid) {
				InputFields.getProperty("/Inputs/Columns").pop(InputFields.getProperty("/Inputs/Columns")[rowid]);
				src.getParent().removeItem(rowid);
			} else {
				InputFields.getProperty("/Inputs/Columns").splice(rowid, 1);
				oTable.removeAllItems();
				this.handleAddRow(0, InputFields.getProperty("/Inputs/Columns"));
			}

		},
		onTransfer: function(oModel) {
			this.cols = [];
			var oTable = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var rows = oTable.getItems();
			if (rows.length === 1) {
				MessageBox.alert("Please add Matters to Split Transfer.");
			} else {
				for (var i = 1; i < rows.length; i++) {
					var cells = rows[i].getCells();
					var matter = cells[0].getValue();
					var selDbKey = cells[1].getSelectedKey();
					var selPhaseKey = cells[2].getSelectedKey();
					var selTskKey = cells[3].getSelectedKey();
					var selActKey = cells[4].getSelectedKey();
					var selFfTskKey = cells[5].getSelectedKey();
					var selFfActKey = cells[6].getSelectedKey();
					var hours = cells[7].getValue();
					var percentage = cells[8].getValue();
					var vbeln = this.BillEditModel.getProperty("/Inputs/LineitemsCopy")[this.getModel("InputsModel").getProperty("/Inputs/rowLineTransferCount")].Vbeln;
					  var posnr = this.BillEditModel.getProperty("/Inputs/LineitemsCopy")[this.getModel("InputsModel").getProperty("/Inputs/rowLineTransferCount")].Posnr;
					this.userObject = {
				     	Pspid: matter,
						ToVbeln:selDbKey,
						Posnr:posnr,
						Zzphase: selPhaseKey,
						ToZztskcd: selTskKey,
						ToZzactcd: selActKey,
						ToZzfftskcd: selFfTskKey,
						ToZzffactcd: selFfActKey,
						Megbtr: hours,
						Percent: percentage,
						Counter: i,
						Vbeln: vbeln
					};
					this.cols.push(this.userObject);
					this.userObject = {
						Pspid: "",
						ToVbeln:"",
						Posnr:"",
						Zzphase: "",
						ToZztskcd: "",
						ToZzactcd: "",
						ToZzfftskcd: "",
						ToZzffactcd: "",
						Megbtr: "",
						Percent: "",
						Counter: "",
					    Vbeln: ""
					};
				}
				var changedTableData = this.cols;
				this.makeSplitBatchCalls(changedTableData, oModel);

			}
		},
		makeSplitBatchCalls: function(oList, oModel1) {
			debugger;
			sap.ui.core.BusyIndicator.show();
			this.Action = "SPLIT";
			var oComponent = this.getOwnerComponent(),

				oFModel = oComponent.getModel(),
				tData = $.extend(true, [], oList),
				urlParams,
				Vbeln = [],
				Posnr = [],
				Percentage = [],
				Hours = [],
				ToActivityCode = [],
				ToFfActivityCode = [],
				ToFfTaskCode = [],
				ToTaskCode = [],
				ToMatter = [],
				Counter = [],
				ToVbeln = [],
				ToPhaseCode = [];

			$.each(tData, function(i, o) {
				Vbeln.push(o.Vbeln);
				Posnr.push(o.Posnr);
				Percentage.push(o.Percent);
				Hours.push(o.Megbtr);
				ToActivityCode.push(o.ToZzactcd);
				ToFfActivityCode.push(o.ToZzffactcd);
				ToFfTaskCode.push(o.ToZzfftskcd);
				ToTaskCode.push(o.ToZztskcd);
				ToMatter.push(o.Pspid);
				Counter.push(o.Counter);
				ToVbeln.push(o.ToVbeln);
				ToPhaseCode.push(o.Zzphase);
			});

			urlParams = {

				Action: "SPLIT",
				Vbeln: Vbeln,
				Posnr: Posnr,
				Percentage: Percentage,
				Hours: Hours,
				ToActivityCode: ToActivityCode,
				ToFfActivityCode: ToFfActivityCode,
				ToFfTaskCode: ToFfTaskCode,
				ToTaskCode: ToTaskCode,
				ToMatter: ToMatter,
				Counter: Counter,
				ToVbeln: ToVbeln,
				ToPhaseCode: ToPhaseCode

			};
			var rows = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2").getItems();
			var that = this;

			oFModel.callFunction("/BillTransfer", {
				method: "GET",
				urlParameters: urlParams,
				success: function(oData) {

					sap.ui.core.BusyIndicator.hide();
					var res = oData.results;
					for (var i = 0; i < res.length; i++) {
						that.msgTxt = res[i].Message;

						if (that.msgTxt !== "") {
							var cells = rows[i + 1].getCells();
							cells[10].setProperty("visible", true);
							cells[10].setTooltip(that.msgTxt);
						}

					}

				}
			});
		},

		splitPhaseCodesChange: function(oEvent) {

			var item = oEvent.getSource().getParent();
			var oTable = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var idx = oTable.indexOfItem(item);
			var phaseCodeSelected = oEvent.getSource().getSelectedItem().getKey();
			var InputFields = this.getView().getModel("InputsModel");
			var userArray = InputFields.getProperty("/Inputs/Columns");
			var pspid = item.getCells()[0].getValue();
			this.BillEditModel = this.getModel("InputsModel");

			var that = this;

			$.when(that.serviceInstance.getTaskcodes(that.BillEditModel, phaseCodeSelected, that),
					that.serviceInstance.getActivitycodes(that.BillEditModel, pspid, that))
				.done(function(taskCodes, activityCodes) {

					taskCodes.results.unshift("");
					activityCodes.results.unshift("");
					userArray.taskCodes = taskCodes.results;
					userArray.activityCodes = activityCodes.results;
					InputFields.getProperty("/Inputs/Columns")[idx].ToZztskcd = userArray.taskCodes;
					InputFields.getProperty("/Inputs/Columns")[idx].ToZzactcd = userArray.activityCodes;
					that.getTableItems();
				});

		},
		splitFfTaskCodesChange: function(oEvent) {
			var item = oEvent.getSource().getParent();
			var oTable = sap.ui.core.Fragment.byId("splitTransfer", "splitTable2");
			var idx = oTable.indexOfItem(item);
			var taskCodeSelected = oEvent.getSource().getSelectedItem().getKey();
			var InputFields = this.getView().getModel("InputsModel");
			var userArray = InputFields.getProperty("/Inputs/Columns");
			var pspid = item.getCells()[0].getValue();
			this.BillEditModel = this.getModel("InputsModel");
			var that = this;
			$.when(that.serviceInstance.getFFActivitycodes(that.BillEditModel, taskCodeSelected, pspid, that))
				.done(function(ffActCodes) {

					ffActCodes.results.unshift("");
					userArray.ffActCodes = ffActCodes.results;
					InputFields.getProperty("/Inputs/Columns")[idx].ToZzffactcd = userArray.ffActCodes;
					that.getTableItems();

				});
		},
		fnSplitDraftBillNoChange: function(oEvent) {

		},

	    fnLineItemTransfersSave: function(oEvent) {
            debugger;
	        var otable = this.getView().byId("lineItemtransfers");
			var saveArr = this.getModel("InputsModel").getProperty("/Inputs/lineItemTransfersSelArr");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowLineTransferCount");
			var transferitems = [];
			$.each(saveArr, function(i, el) {
				if ($.inArray(el, transferitems) === -1) transferitems.push(el);
			});
			sap.ui.core.BusyIndicator.show();

			var oComponent = this.getOwnerComponent(),

				oFModel = oComponent.getModel(),
				tData = $.extend(true, [], transferitems),
				urlParams,
				Vbeln = [],
				Posnr = [],
				Percentage = [],
				Hours = [],
				ToActivityCode = [],
				ToFfActivityCode = [],
				ToFfTaskCode = [],
				ToTaskCode = [],
				ToMatter = [],
				Counter = [],
				ToVbeln = [],
				ToPhaseCode = [];
debugger;
		$.each(tData, function(i, o) {
				Vbeln.push(o.Vbeln);
				Posnr.push(o.Posnr);
				Percentage.push(o.ToPercent);
				Hours.push(o.Megbtr);
				ToActivityCode.push(o.ToZzactcd);
				ToFfActivityCode.push(o.ToZzffactcd);
				ToFfTaskCode.push(o.ToZzfftskcd);
				ToTaskCode.push(o.ToZztskcd);
				ToMatter.push(o.Matter);
				Counter.push(o.Counter);
				ToVbeln.push(o.ToVbeln);
				ToPhaseCode.push(o.Zzphase);
			});

			urlParams = {

				Action: "TRANSFER",
				Vbeln: Vbeln,
				Posnr: Posnr,
				Percentage: Percentage,
				Hours: Hours,
				ToActivityCode: ToActivityCode,
				ToFfActivityCode: ToFfActivityCode,
				ToFfTaskCode: ToFfTaskCode,
				ToTaskCode: ToTaskCode,
				ToMatter: ToMatter,
				Counter: Counter,
				ToVbeln: ToVbeln,
				ToPhaseCode: ToPhaseCode

			};
		
			var that = this;

			oFModel.callFunction("/BillTransfer", {
				method: "GET",
				urlParameters: urlParams,
				success: function(oData) {
debugger;
					sap.ui.core.BusyIndicator.hide();
					var res = oData.results;
				if (oData) {
								// that.hideBusyIndicator();
								var results = oData;
							
								// that.showAlert("Bill Edit", message);
								for (var i = 0; i < aIndices.length; i++) {
										var message = oData.results[i].Message;
									otable.getRows()[aIndices[i]].getCells()[0].setVisible(true);
									otable.getRows()[aIndices[i]].getCells()[0].setTooltip(message);

								}

							
							}

				}
			});
		},
	
		
		
		onMassTransfer: function() {
			debugger;
			var odialog = this._getDialogmass();
			odialog.open();
			var oTable = this.getView().byId("lineItemtransfers");
			var ofrag = sap.ui.core.Fragment.byId("masstransfer", "masstransfertable");
			var oTbl = sap.ui.core.Fragment.byId("masstransfer", "matter");
			var len = oTbl.getColumns().length;
			if (len === 0) {
				var columns = this.BillEditModel.getProperty("/Inputs/createmassMatter");
				for (var k = 0; k < columns.length; k++) {
					var col = columns[k];
					oTbl.addColumn(new sap.m.Column({
						header: new sap.m.Label({
							text: col.userCol
						})

					}));
				}
				this.handleAddRowMass(1);
			}
			$.each(oTable.getSelectedIndices(), function(i, o) {
				var tableContext = oTable.getContextByIndex(o);
				var obj = tableContext.getObject();
				var itemno = obj.Buzei;
				var docno = obj.Belnr;
				ofrag.addItem(new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
							width: "100%",
							text: docno
						}),
						new sap.m.Text({
							width: "100%",
							text: itemno
						}),
						new sap.m.Button({
							text: "delete",
							press: function(oEvent) {
								var tbl = sap.ui.core.Fragment.byId("masstransfer", "masstransfertable");
								var src = oEvent.getSource().getParent();
								var rowid = src.getId();
								tbl.removeItem(rowid);
							}
						})

					]
				}));
			});

		},
		handleAddRowMass: function(count) {
			debugger;
			var columnsCount = count;
			var that = this;
			for (var i = 0; i < columnsCount; i++) {
				var obj = jQuery.extend({}, that.BillEditModel.getProperty("/Inputs/Column"));
				var tableitems = this.getMatterField();
				var oContext = this._createTableItemContext(obj);
				var oTbl = sap.ui.core.Fragment.byId("masstransfer", "matter");
				tableitems.setBindingContext(oContext);
				oTbl.addItem(tableitems);
				var delayInvk = (function(itm) {
					return function() {
						var smartfieldIndexes = that.BillEditModel.getProperty("/Inputs/editableIndexes");
						for (var j = 0; j < smartfieldIndexes.length; j++) {
							var c = itm.getCells()[smartfieldIndexes[j]];
							c.setEditable(true);
						}
					};
				})(tableitems);
				jQuery.sap.delayedCall(500, this, delayInvk);
			}
		},
		getMatterField: function() {
			debugger;
			var columns = this.BillEditModel.getProperty("/Inputs/createmassMatter");
			var cols = [];
			for (var m = 0; m < columns.length; m++) {
				var item = columns[m];
				if (item.type === "smartfield") {
					var field = new sap.ui.comp.smartfield.SmartField({
						value: "{" + item.key + "}",
						editable: "{InputsModel>isEditable}",
						id: "masspspid",
						change: $.proxy(this.handlemassChange, this)
					});
					cols.push(field);
				}
				debugger;
				if (item.type === "select") {
						var field = new sap.m.Select({
							selectedKey: "{InputsModel>/Inputs/Column/seldbno}",
							items: {
								path: "InputsModel>/Inputs/Column/Vbeln",
								template: new sap.ui.core.ListItem({
									key: "{InputsModel>Vbeln}",
									text: "{InputsModel>Vbeln}"

								}),
								templateShareable: true
							},
							change: $.proxy(this.fnSplitDraftBillNoChange, this)

						});
					cols.push(field);
				}
			}
			var tableitems = new sap.m.ColumnListItem({
				cells: cols
			});

			return tableitems;
		},
		handlemassChange: function(evt) {
			debugger;
			var oSource = evt.getSource();
			var items = oSource.getParent();
			var delayInvk = (function(itm) {
				return function() {
					var c = itm.getCells()[0];
					c.setEditable(true);
				};
			})(items);
			var aPath = oSource.getBindingContext().getPath();
			var Model = oSource.getBindingContext().getModel();
			var Pspid = evt.getParameter("value");
			if (evt.getParameter("value")) {
				Model.setProperty(aPath + "/" + oSource.getBindingPath('value'), evt.getParameter("value"));
			} else {
				Model.setProperty(aPath + "/" + oSource.getBindingPath('value'), evt.getParameter("value"));
				Pspid = evt.getParameter("value");
			}
			jQuery.sap.delayedCall(500, this, delayInvk);
			this.BillEditModel = this.getModel("InputsModel");
			this.serviceInstance = LineItemsServices.getInstance();
			var InputFields = this.getView().getModel("InputsModel");
			var that = this;
			$.when(
					that.serviceInstance.getDraftBillNumbers(that.BillEditModel, Pspid, that))
				.done(function(draftBillNos) {
					InputFields.setProperty("/Inputs/Column/Vbeln", draftBillNos.results);
				});
		},
		_getDialogmass: function() {
			if (!this._omassDialog) {
				this._omassDialog = sap.ui.xmlfragment("masstransfer", "dbedit.Fragments.masstransfer", this);
				this.getView().addDependent(this._omassDialog);

			}
			return this._omassDialog;
		},
		closemassDialog: function() {
			sap.ui.core.Fragment.byId("masstransfer", "percentage").setValue("100");
			var tbl = sap.ui.core.Fragment.byId("masstransfer", "masstransfertable");
			$.each(tbl.getItems(), function(i, o) {
				var rowid = o.getId();
				tbl.removeItem(rowid);
			});
			this._omassDialog.close();

		},
		onmassTransferchange: function() {
			var oTbl = sap.ui.core.Fragment.byId("masstransfer", "matter");
			var matter = oTbl.getItems()[0].getCells()[0].getValue();
			var Vbeln = oTbl.getItems()[0].getCells()[1].getSelectedKey();
			this.BillEditModel = this.getModel("InputsModel");
			var data = this.BillEditModel.getProperty("/Inputs/LineitemsCopy");

			this.serviceInstance = LineItemsServices.getInstance();
			var percent = sap.ui.core.Fragment.byId("masstransfer", "percentage").getValue();
			var oTable1 = sap.ui.core.Fragment.byId("masstransfer", "masstransfertable");
			var items = oTable1.getItems();
			var Docno = [];
			$.each(items, function(l, obj) {
				var cells = obj.getCells();
				var string = cells[0].getText();
				Docno.push(string);
			});
			var check = false;
			var oView = this.getView(),
				oTable = oView.byId("lineItemtransfers");
			var selectindex = this.BillEditModel.getProperty("/Inputs/rowLineTransferCount");
			if (matter != "") {
				var Pspid = matter;
				var billno = Vbeln;
				var lineItems = data;
				var that = this;
				$.when(
				that.serviceInstance.getPhaseCodes(that.BillEditModel, Pspid, that),
				that.serviceInstance.getTaskcodes(that.BillEditModel, "", that),
				that.serviceInstance.getActivitycodes(that.BillEditModel, Pspid, that),
				that.serviceInstance.getFFtaskcodes(that.BillEditModel, Pspid, that))
			
				.done(function(phaseCodes, taskCodes, activityCodes, ffTskCodes) {
					
					$.each(selectindex, function(j, o) {
					debugger;
						var ctx = oTable.getContextByIndex(o);
						var m = ctx.getObject();
						var docno = m.Belnr;
						check = Docno.includes(docno);
						if (check) {
							lineItems[o].ToMatter = matter;
							lineItems[o].ToVbeln = billno;
							// lineItems[o].Percent = percent;
							lineItems[o].phaseCodes = lineItems[o].Zzphase.length ? [{
								Phasecode: "",
								PhasecodeDesc: ""
							}].concat(phaseCodes.results) : phaseCodes.results;
							lineItems[o].taskCodes = lineItems[o].Zztskcd.length ? [{
								TaskCodes: "",
								TaskCodeDesc: ""
							}].concat(taskCodes.results) : taskCodes.results;
							lineItems[o].actCodes = lineItems[o].Zzactcd.length ? [{
								ActivityCodes: "",
								ActivityCodeDesc: ""
							}].concat(activityCodes.results) : activityCodes.results;
							lineItems[o].ffTskCodes = lineItems[o].Zzfftskcd.length ? [{
								FfTaskCodes: "",
								FfTaskCodeDesc: ""
							}].concat(ffTskCodes.results) : ffTskCodes.results;
							// lineItems[o].ffActCodes = lineItems[o].Zzffactcd.length ? [{
							// 	FfActivityCodes: "",
							// 	FfActivityCodeDesc: ""
							// }].concat(ffActCodes.results) : ffActCodes.results;
							lineItems[o].index = o;
							lineItems[o].indeces = o;
							lineItems[o].isRowEdited = true;

						} else {
							var indes = selectindex.indexOf(o);
							selectindex[indes] = " ";
						}

					});
					
					that.BillEditModel.setProperty("/Inputs/LineitemsCopy", lineItems);
					oTable.setModel(that.BillEditModel);
					oTable.bindRows("/Inputs/LineitemsCopy");
					for (var s = 0; s < selectindex.length; s++) {
						var value = selectindex[s];
						if (value !== " ") {
							// oTable.setSelectedIndex(value);
							oTable.addSelectionInterval(value, value);
							selectindex.splice(value, 1);
						}

					}
					that.BillEditModel.setProperty("/Inputs/rowLineTransferCount", selectindex);
					that.onEditTable(selectindex);
				});
			}
			sap.ui.core.Fragment.byId("masstransfer", "percentage").setValue("100");
			var tbl = sap.ui.core.Fragment.byId("masstransfer", "masstransfertable");
			$.each(tbl.getItems(), function(i, o) {
				var rowid = o.getId();
				tbl.removeItem(rowid);
			});
			this._omassDialog.close();

		},
		// onEditTable: function() {
		// 	var selindexes = this.BillEditModel.getProperty("/Inputs/rowLineTransferCount");
		// 	var oView = this.getView(),
		// 		oTable = oView.byId("lineItemtransfers");

		// 	for (var i = 0; i < selindexes.length; i++) {
		// 		var value = selindexes[i];
		// 		if (value !== " ") {
		// 			var ctx = oTable.getContextByIndex(value);
		// 			var m = ctx.getModel(ctx.getPath());
		// 			m.setProperty(ctx.getPath() + "/Edit", true);
		// 			oTable.addSelectionInterval(value, value);

		// 		}
		// 	}

		// }
		

	});

});
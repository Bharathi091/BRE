sap.ui.define([
	"dbedit/controller/BaseController",
	"dbedit/model/formatter",
	"dbedit/Services/LineItemsServices",
	"dbedit/spell/spellChek",
	"sap/m/MessageBox"
], function(Controller, formatter, LineItemsServices, spellChek, MessageBox) {
	"use strict";

	return Controller.extend("dbedit.controller.NarrativeEdits", {

		formatter: formatter,

		onInit: function() {
			debugger;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("homeChannelNarrative", "toSummaryEditNarrative", this.narrativeEditData, this);
			this.getView().setModel(this.jsonModel, "JSONModel");
		},
		spellCheck: function() {
			debugger;
			var that = this;
			var Otable = this.getView().byId("narrativeEditsTable");
			setTimeout(function() {

				$(document).ready(function() {
					$(".fulcrum-editor-textarea").spellCheker({

						lang_code:that.getView().getModel("InputsModel").getProperty("/Inputs/dicDefLanguage"),
						scope1: that,
						table: Otable,
						scope: that.getModel("InputsModel").getProperty("/Inputs"),
						outputTex: 'Narrative',
						dictionaryPath: location.protocol + '//' + location.host + "/webapp/spell/typo/dictionaries" // to run it in sand box
							// "./spell/typo/dictionaries"      //to run with index.html 
					});
				});
			}, 1000);
		},
		narrativeEditData: function(homeChannelNarrative, toSummaryEditNarrative, data) {
			this.BillEditModel = this.getModel("InputsModel");
			var Otable = this.getView().byId("narrativeEditsTable");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");
			this.spellCheck();
			if (data.button === "Reviewed" || data.button === "UnReviewed") {
				this.ReviewUnreview(data.button);
			} else if (data.button === "Replace Words") {
				this.onReplacewords(data.button);
			} else if (data.button === "Save") {
				this.onNarrativeEditsSave();
			}

		},
		narrativeTableSelection: function(oEvt) {
			var rowCount = this.byId("narrativeEditsTable").getSelectedIndices();
			var rowNarrativeCount = [];
			this.BillEditModel = this.getModel("InputsModel");
			for (var i = 0; i < rowCount.length; i++) {
				rowNarrativeCount.push(rowCount[i]);
			}
			this.getModel("InputsModel").setProperty("/Inputs/rowNarrativeCount", rowNarrativeCount);

			if (rowCount.length > 0) {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/NarrativeReplaceWords", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/NarrativeReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/NarrativeUnReviewed", true);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/GlobalSpellCheck", true);
			} else {
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/NarrativeReplaceWords", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/NarrativeReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/NarrativeUnReviewed", false);
				this.BillEditModel.setProperty("/Inputs/ToolbarEnable/GlobalSpellCheck", false);
			}

		},
		dictionaryChange: function(oEvent) {
			var key;
			var that = this;
			var selectedText = this.getView().byId("comboPosition").getSelectedItem().getText();
			var otable = this.getView().byId("narrativeEditsTable");
			var InputFields = this.getView().getModel("InputsModel");
			var dictionary = InputFields.getProperty("/Inputs/Countries_collection");
			for (var i = 0; i < dictionary.length; i++) {
				if (dictionary[i].Text === selectedText) {
					key = dictionary[i].Key;

					var language = dictionary[i].lang;
					InputFields.setProperty("/Inputs/changeLang", language);
					that.getView().getModel("InputsModel").setProperty("/Inputs/dicDefLanguage", dictionary[i].Key);

			
					this.spellCheck();
				}
			}

		},
		scrollChange: function(oEvent) {
			this.logValueScroll = 1;
			this.spellCheck();
			//this.getModel("InputsModel").setProperty("/Inputs/spellCheckLogValue",0);

		},
		capitalizeFirstLetter: function(string) {

			return string.charAt(0).toUpperCase() + string.slice(1);

		},
		capitalization: function() {

			var InputFields = this.getView().getModel("InputsModel");

			InputFields.setProperty("/Inputs/isChanged", true);
			var data = InputFields.getProperty("/Inputs/LineitemsCopy");
			var saveObjects = InputFields.getProperty("/Inputs/saveObjects");
			var res = [];
			var Otable = this.getView().byId("narrativeEditsTable");

			var NarStr;

			var that = this;

			var endChars = [".", "?", "!", "\"", "'"];

			res = $.each(data, function(item) {
				var narString = data[item].Narrative.trim();
				NarStr = that.capitalizeFirstLetter(data[item].Narrative.trim());
				data[item].Narrative = NarStr;

				if (NarStr !== "") {
					var lastChar = NarStr.charAt(NarStr.length - 1);
					if (endChars.indexOf(lastChar.slice(-1)) === -1) {
						NarStr = NarStr + ".";

						data[item].Narrative = NarStr;

					}

					if (narString != data[item].Narrative) {
						saveObjects.push(data[item]);
					}
					InputFields.setProperty("/Inputs/saveObjects", saveObjects);

					return data[item].Narrative;
				}

			});
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");
			InputFields.setProperty("/Inputs/isChanged", true);
			InputFields.setProperty("/Inputs/scope", this.getView().byId("narrativeEditsTable"));

			this.spellCheck();

		},
		remove_character: function(str, char_pos) {
			var part1 = str.substring(0, char_pos);
			var part2 = str.substring(char_pos + 1, str.length);
			return (part1 + part2);
		},
		removeSpaces: function(oEvt) {

			var InputFields = this.getView().getModel("InputsModel");
			InputFields.setProperty("/Inputs/isChanged", true);
			var data = InputFields.getProperty("/Inputs/LineitemsCopy");
			var saveObjects = InputFields.getProperty("/Inputs/saveObjects");
			var result;

			var that = this;
			var res = [];
			res = $.each(data, function(item) {
				var narStr = data[item].Narrative;

				result = data[item].Narrative.replace(/\s+/g, " ").trim();
				var lastChar = result.charAt(result.length - 1);
				var spaceLastChar = result.charAt(result.length - 2);

				if (lastChar === "." && spaceLastChar === " ") {

					result = that.remove_character(result, result.length - 2);

				}

				data[item].Narrative = result;

				if (narStr != result) {
					saveObjects.push(data[item]);
				}

				return data[item].Narrative;
			});

			var Otable = this.getView().byId("narrativeEditsTable");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");
			InputFields.setProperty("/Inputs/isChanged", true);
			InputFields.setProperty("/Inputs/scope", this.getView().byId("narrativeEditsTable"));
			this.spellCheck();

		},
		onReplacewords: function(evt) {
			debugger;
			var selectedIndex = this.BillEditModel.getProperty("/Inputs/rowNarrativeCount");
			if (selectedIndex.length === 0) {

				MessageBox.show(
					"Select atleast one item!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Replace",
						actions: [sap.m.MessageBox.Action.OK]
					}
				);
				return;
			} else {
				var odialog = this._getreplaceDialogbox();
				odialog.open();

			}
		},
		_getreplaceDialogbox: function() {
			if (!this._oreplaceDialog) {
				this._oreplaceDialog = sap.ui.xmlfragment("replaceword", "dbedit.Fragments.popup", this);
				this.getView().addDependent(this._oreplaceDialog);
			}
			return this._oreplaceDialog;
		},
		closereplaceDialog: function() {
			sap.ui.getCore().byId("replaceword--string0").setValue("");
			sap.ui.getCore().byId("replaceword--replace0").setValue("");
			sap.ui.getCore().byId("replaceword--word").setSelected(true);
			var tbl = sap.ui.core.Fragment.byId("replaceword", "bottomTable0");
			$.each(tbl.getItems(), function(d, o) {
				if (d > 0) {
					var rowid = o.getId();
					tbl.removeItem(rowid);
				}
			});
			this.getModel("InputsModel").setProperty("/Inputs/rowNarrativeCount", []);
			this._oreplaceDialog.close();
		},
		onreplace: function() {
			debugger;
			var oTable = this.getView().byId("narrativeEditsTable");
			var oTable1 = sap.ui.core.Fragment.byId("replaceword", "bottomTable0");
			this.replaceItems = [];
			var that = this;
			var data = this.getModel("InputsModel").getProperty("/Inputs/LineitemsCopy");
			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/saveObjects");
			var selectedIndex = this.getModel("InputsModel").getProperty("/Inputs/rowNarrativeCount");
			$.each(selectedIndex, function(i, o) {
				var ctx = oTable.getContextByIndex(o);
				var m = ctx.getObject();
				var str = m.Narrative;
				var res;
				var items = oTable1.getItems();
				$.each(items, function(l, obj) {
					var cells = obj.getCells();
					var string = cells[0].getValue();
					var replacewith = cells[1].getValue();
					var check = cells[3].getSelected();
					if (check) {
						var stringarr = str.split(" ");
						$.each(stringarr, function(d, o) {
							if (stringarr[d] === string) {
								stringarr[d] = replacewith;
							} else {
								if (stringarr[d].endsWith(".")) {
									var newSplitWord = stringarr[d].split(".");
									if (newSplitWord[0] === string) {
										stringarr[d] = replacewith + ".";
									}
								}
							}
						});
						res = stringarr.join(" ");
					} else {

						res = str.split(string).join(replacewith);
					}
					// data.forEach(function(obj, k) {
					// 	that.replaceItems[k] = obj;
					// });
					that.replaceItems = data;
					that.replaceItems[o].Narrative = res;

					if (str != res) {
						saveObjects.push(that.replaceItems[o]);
					}

					str = that.replaceItems[o].Narrative;

				});

				that.BillEditModel.setProperty("/Inputs/LineitemsCopy", that.replaceItems);
				oTable.setModel(that.BillEditModel);
				oTable.bindRows("/Inputs/LineitemsCopy");

			});
			sap.ui.getCore().byId("replaceword--string0").setValue("");
			sap.ui.getCore().byId("replaceword--replace0").setValue("");
			sap.ui.getCore().byId("replaceword--word").setSelected(true);
			var tbl = sap.ui.core.Fragment.byId("replaceword", "bottomTable0");
			$.each(tbl.getItems(), function(d, o) {
				if (d > 0) {
					var rowid = o.getId();
					tbl.removeItem(rowid);
				}
			});
			this._getreplaceDialogbox().close();
			this.getView().getModel("InputsModel").setProperty("/Inputs/isChanged", true);
			this.getView().getModel("InputsModel").setProperty("/Inputs/scope", this.getView().byId("WipDetailsSet1"));
			this.spellCheck();

		},
		replaceall: function() {

			var oTable = this.getView().byId("narrativeEditsTable");
			var oTable1 = sap.ui.core.Fragment.byId("replaceword", "bottomTable0");

			var replaceItems = [];
			var data = this.getModel("InputsModel").getProperty("/Inputs/LineitemsCopy");
			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/saveObjects");
			data.forEach(function(obj, k) {
				replaceItems[k] = obj;
			});
			this.replace = [];
			var that = this;
			var result = $.each(replaceItems, function(i, o) {

				var m = o;
				var str = m.Narrative;
				var res;
				var items = oTable1.getItems();
				$.each(items, function(l, obj) {
					var cells = obj.getCells();
					var string = cells[0].getValue();
					var replacewith = cells[1].getValue();
					var check = cells[3].getSelected();
					if (check) {
						var stringarr = str.split(" ");
						$.each(stringarr, function(d, o) {
							if (stringarr[d] === string) {
								stringarr[d] = replacewith;
							} else {
								if (stringarr[d].endsWith(".")) {
									var newSplitWord = stringarr[d].split(".");
									if (newSplitWord[0] === string) {
										stringarr[d] = replacewith + ".";
									}
								}
							}
						});
						res = stringarr.join(" ");
						that.replace = data;
						that.replace[i].Narrative = res;

						if (str != res) {
							saveObjects.push(that.replace[i]);
						}

						str = that.replace[i].Narrative;

					} else {

						var searchindex = str.search(string);
						if (searchindex >= 0) {
							res = str.split(string).join(replacewith);
							that.replace = data;
							that.replace[i].Narrative = res;
							str = that.replace[i].Narrative;
						}
					}

				});
				return that.replace;
			});

			this.BillEditModel.setProperty("/Inputs/LineitemsCopy", result);
			oTable.setModel(this.BillEditModel);
			oTable.bindRows("/Inputs/LineitemsCopy");

			sap.ui.getCore().byId("replaceword--string0").setValue("");
			sap.ui.getCore().byId("replaceword--replace0").setValue("");
			sap.ui.getCore().byId("replaceword--word").setSelected(true);
			var tbl = sap.ui.core.Fragment.byId("replaceword", "bottomTable0");
			$.each(tbl.getItems(), function(d, o) {
				if (d > 0) {
					var rowid = o.getId();
					tbl.removeItem(rowid);
				}
			});
			this._getreplaceDialogbox().close();
			this.getView().getModel("InputsModel").setProperty("/Inputs/isChanged", true);
			this.getModel("InputsModel").setProperty("/Inputs/scope", this.getView().byId("WipDetailsSet1"));
			this.spellCheck();
		},
		onGlobalSearch: function(oEvent) {

			debugger;

			var searchValue = this.byId("searchText1").getValue();

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
			var Otable = this.getView().byId("narrativeEditsTable");
			Otable.setModel(this.BillEditModel);
			Otable.bindRows("/Inputs/LineitemsCopy");

			this.spellCheck();

		},
		onNarrativeEditsSave: function(button) {
		
			// this.showBusyIndicator();
			var saveObjects = this.getModel("InputsModel").getProperty("/Inputs/saveObjects");
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
		ReviewUnreview: function(button) {
			debugger;

			var otable = this.getView().byId("narrativeEditsTable");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowNarrativeCount");

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

			this.onNarrativeEditsSave(button);
		}

	});

});
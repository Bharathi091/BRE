sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"dbedit/Services/LineItemsServices",
		"sap/m/Dialog",
			"sap/m/Button",
			"sap/ui/core/format/DateFormat",
	"sap/ui/export/Spreadsheet"
], function(Controller, LineItemsServices,Dialog,Button,DateFormat,Spreadsheet) {
	"use strict";

	return Controller.extend("dbedit.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		 
		 	showAlert: function(title, message) {

			var dialog = new Dialog({
				title: title,
				type: 'Message',
				content: new Text({
					text: message
				}),
				beginButton: new Button({
					text: 'OK',
					press: function() {
						dialog.close();

					}
				}),

				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		convertToJSONDate: function(strDate) {
			var dt = new Date(strDate);
			var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
			return '/Date(' + newDate.getTime() + ')/';
		},
		showBusyIndicator: function() {
			sap.ui.core.BusyIndicator.show(0);
		},
		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide(0);
		},

		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		Reload: function(oEvent) {
			debugger;

			this.table = oEvent.getSource().getParent().getParent().getTable();

			var InputFields = this.getModel("InputsModel");

			var change = InputFields.getProperty("/Inputs/isChanged");

			if (change === true) {

				this._Dialog = sap.ui.xmlfragment("dbedit.Fragments.Fragment", this);
				this._Dialog.open();
			} else {
				this.ReloadTable();

			}

		},

		ReloadTable: function() {
			debugger;
			this.ignoreLog = 1;
			var aFilter = [];
			var table = this.table;
			var that = this;

			var Vbeln = this.BillEditModel.getProperty("/Inputs/selectedRow").Vbeln;
			sap.ui.core.BusyIndicator.show(0);
			LineItemsServices.getInstance().getLineItemsData(this.BillEditModel, Vbeln, that)
				.done(function(oData) {
					sap.ui.core.BusyIndicator.hide(0);
					alert("Data received");
					that.BillEditModel.setProperty("/Inputs/tableData", oData.results);
					that.BillEditModel.setProperty("/Inputs/LineitemsCopy", oData.results);
					if (that.table.getId().substring(12) === "narrativeEditsTable") {
						setTimeout(function() {

							$(document).ready(function() {
								$(".fulcrum-editor-textarea").spellCheker({

									lang_code: "en_US",
									scope1: that,
									table: that.table,
									scope: that.getModel("InputsModel").getProperty("/Inputs"),
									outputTex: 'Narrative',
									dictionaryPath: location.protocol + '//' + location.host + "/webapp/spell/typo/dictionaries" // to run it in sand box
										// "./spell/typo/dictionaries"      //to run with index.html 
								});
							});
						}, 1000);
					}
				})
				.fail(function() {});

			this.BillEditModel.setProperty("/Inputs/isChanged", false);
			this.BillEditModel.setProperty("/Inputs/scope", "");
			var aIndices = this.BillEditModel.getProperty("/Inputs/rowLineCount");
			for (var i = 0; i < aIndices.length; i++) {
				table.getRows()[aIndices[i]].getCells()[0].setVisible(false);
					}
			if (this._Dialog) {

				this._Dialog.close();

			}

		},
		closeDialog: function() {
			this._Dialog.close();

		},
			createColumnConfig: function(tableId) {

			var i18nLabel = this.getView().getModel("i18n").getResourceBundle();

			var iTotalCols = tableId.getColumns();
			var arr = [];
			var dateFields = ["Audat", "Budat", "Bstdk", "DbDate", "Erdat", "FKDAT", "Prsdt"];
			for (var colE = 0; colE < iTotalCols.length; colE++) {

				var obj = {
					label: i18nLabel.getText(iTotalCols[colE].mProperties.sortProperty),
					property: iTotalCols[colE].mProperties.sortProperty,
					width: iTotalCols[colE].mProperties.width
				};
				if (dateFields.includes(iTotalCols[colE].mProperties.sortProperty)) {
					obj.format = "MM/dd/YYY";
					obj.type = "date";
					obj.textAlign = 'begin';
				}
				arr.push(obj);
				if (colE === iTotalCols.length - 1) {
					return arr;
				}
			}

		},

		Export: function(Event) {
			
      debugger;
		
			var tableId = Event.getSource().getParent().getParent().getTable();

			var aCols, oSettings, oExcelDate, oDateFormat, oExcelFileName, oExportData;
			aCols = this.createColumnConfig(tableId);
		if(tableId.getId().substring(12) === "homeTable"){
				oExportData = this.getView().getModel("InputsModel").getProperty("/Inputs/results");
			}
			else {
				oExportData = this.getView().getModel("InputsModel").getProperty("/Inputs/LineitemsCopy");
			}

			oDateFormat = DateFormat.getDateInstance({
				pattern: "MM-dd-YYYY"
			});
			oExcelDate = oDateFormat.format(new Date());
			oExcelFileName = "WipEditor" + oExcelDate + ".xlsx";
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: oExportData,
				fileName: oExcelFileName
			};
			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.onprogress = function(iValue) {
				jQuery.sap.log.debug("Export: %" + iValue + " completed");
			};
			oSpreadsheet.build()
				.then(function() {
					jQuery.sap.log.debug("Export is finished");
				})
				.catch(function(sMessage) {
					jQuery.sap.log.error("Export error: " + sMessage);
				});
		}

	});

});
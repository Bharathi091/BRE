sap.ui.define([
	"dbedit/model/BaseObject",
	"sap/ui/model/resource/ResourceModel"
], function(BaseObject, ResourceModel) {
	"use strict";
	return BaseObject.extend("dbedit.model.ReportModel", {

		constructor: function(data) {
			BaseObject.call(this);

			this.Inputs = {
				indexes: [],
				lineItemEditIndexes: [],
				results: [],
				selectedRow: {},
				selectedRows: [],
				rowNarrativeCount: [],
				rowLineCount: [],
				rowLineTransferCount: [],
				tableData: [],
				printbillsData: {},
				printfinalData: {},
				createmassMatter: [{
					"key": "Pspid",
					"type": "smartfield",
					"userCol": "To Matter",
					"width": "90px"
				}, {
					"key": "Vbeln",
					"type": "select",
					"userCol": "Bill no",
					"width": "90px"

				}],
			
				Column: [{
					Pspid: "",
					Vbeln: []
				}],
				qParms: {
					SESSION_ID: "?session_id=",
					FILTER: "?$filter=",
					JSON: "&$format=json",
					DATAJSON: "?$format=json",
					METADATA: "/$metadata",
					ACTION: "?Action=",
					ACTION2: "?ACTION=",
					DBToStatus: "/DBToStatus",
					HeaderToGroupInfo: "/HeaderToGroupInfo",
					PriceByMatnr: "/PriceByMatnr",
					value: "/$value",
					Top20: "&$top=20"

				},
				lsValues: {
					SESSION_ID: localStorage.getItem("sid"),
					USER_ID: localStorage.getItem("uid"),
					CONUMBER: "&CoNumber=",
					Buzei: "&Buzei=",
					Hours: "&Hours=",
					WBS_NODE2: "&WBS_NODE2=",
					Percentage: "&Percentage=",
					ToActivityCode: "&ToActivityCode=",
					ToFfActivityCode: "&ToFfActivityCode=",
					ToFfTaskCode: "&ToFfTaskCode=",
					ToMatter: "&ToMatter=",
					ToTaskCode: "&ToTaskCode=",
					PSPID: "&PSPID=",
					Submit: "&Submit=",
					budat_to: "&budat_to=",
					budat_from: "&budat_from=",
					Budat: "&Budat=",
					Belnr: "?Belnr=",
					Vbeln: "&Vbeln=",
					FinalVbeln: "VBELN=",
					GROUPBILL: "&GROUPBILL=",
					FKDAT: "&FKDAT=",
					FKART: "&FKART=",
					STATUS: "&STATUS=",
					TYPEOFAPPROVAL: "&TYPEOFAPPROVAL=",
					CancelVbeln: "Vbeln=",
					Posnr: "&Posnr=",
					ToVbeln: "&ToVbeln=",
					Counter: "&Counter=",
					ToPhaseCode: "&ToPhaseCode="
				},

				saveObjects: [],
				isChanged: false,
				spellCheckLogValue: 0,
				scope: {},
				"InputFields": ["Client", "Mpatner", "Pspid", "Rptgroup", "Mgbill", "Werks", "Vkorg", "Vbeln"],
				"services": {
					"InitialuserDataset": "/UserDataSet(Uname='')",
					"UpdateduserDataset": "/UserDataSet(Bname='",
					"Matter": "/Matter",
					"OrderItemSet": "/OrderItemSet",
					"CreateFinal": "CreateFinal",
					"DraftCancel": "DraftCancel",
					"MatterSet": "/MatterSet",
					"FileListSet": "/FileListSet",
					"WipMattersSet": "/WipMattersSet",
					"WipDetailsSet": "/WipDetailsSet",
					"BillSelectSet": "/BillSelectSet",
					"BillDetailSet": "/BillDetailSet",
					"PricingTypeSet": "/PricingTypeSet",
					"PriceTypeItmSet": "/PriceTypeItmSet",
					"BillSummarySet": "/BillSummarySet",
					"batchBillSummarySet": "/BillSummarySet",
					"BillEditMatterDetailSet": "/BillEditMatterDetailSet",
					"PDFOutCollection": "/PDFOutCollection",
					"DbOutputTypeSet": "/DbOutputTypeSet",
					"FbOutputTypeSet": "/FbOutputTypeSet",
					"FBMassOutputTypeSet": "/FBMassOutputTypeSet",
					"ClientByCompanyCodeSet": "/ClientsGeneralSet",
					"PaymentTermsSet": "/PaymentTermsSet",
					"Tax1InfoSet": "/Tax1InfoSet",
					"TimeKeeper": "/TimeKeeper",
					"TimeKeeperSet": "/PartnerNumberSet",
					"PartnerTypeTKSet": "/PartnerTypeSet",
					"MatterGroupBillSet": "/MatterGrpBillSet",
					"PartnerDetailSet": "/ClientPayersSet",
					"MatterReportingGroupSet": "/MatterReportingGroupSet",
					"SalesOrgSet": "/SalesOrgSet",
					"ZWerksSet": "/BillingOfficeSet",
					"OpenDbForMatterSet": "/OpenDbForMatterSet",
					"WIPTRANSFER": "/WIPTRANSFER",
					"WIPMSPLIT": "/WIPMSPLIT",
					"BILLTRANSFER": "/BillTransfer",
					"CurrencySet": "/CurrencySet",
					"TaskCodeSet": "/TaskCodeSet",
					"BillTextsSet": "/BillTextsSet",
					"ActivityCodeSet": "/ActivityCodeSet",
					"ActCodeSet": "/ActCodeSet",
					"MatterSearchSet": "/MatterSearchSet",
					"MatterPhaseSet": "/MatterPhaseSet",
					"FfTaskCodeSet": "/FfTaskCodeSet",
					"FfActivityCodeSet": "/FfActivityCodeSet",
					"CreateDraft": "CreateDraft",
					"DBCreateLogSet": "DBCreateLogSet",
					"ADDLATEWIP": "/AddLateWip",
					"ReplaceWordsSet": "/ReplaceWordsSet",
					"UserDataSet": "/UserDataSet",
					"WFCommentsSet": "/WFCommentsSet",
					"FBillMassPrint": "FBillMassPrint",
					"DBillMassPrint": "/DBillMassPrint",
					"FinalBillTypeSet": "/FinalBillTypeSet",
					"DbStatusSet": "/DbStatusSet",
					"ChangeStatus": "ChangeStatus",
					"ZprsShZzmatrptgrpWfSet": "/MatterRptGrpSet",
					"VarinatSaveSet": "/VarinatSaveSet",
					"GetLogSet": "GetLogSet",
					"lookup": {
						"COUNTRY": "/countrylookup/"
					},
					"OfficeSet": "/BillingOfficeSet",
					"HT001Set": "/SalesOrgSet",
					"PhaseCodeSet": "/PhaseCodeSet",
					"BreGroupingSet": "/BreGroupingSet",
					"WipAmountsSet": "/WipAmountsSet",
					"billdataset": "/BillSummarySet('"

				},
				editableIndexes: [0],
				createcontrols: [{
						"key": "Pspid",
						"type": "smartfield",
						"userCol": "Target Matter",
						"width": "90px"
					}, {
						"key": "Vbeln",
						"type": "Select",
						"userCol": "To Draft Bill",
						"width": "80px"

					}, {
						"key": "ToPhase",
						"type": "Select",
						"userCol": "Phase Code",
						"width": "80px"

					}, {
						"key": "ToZztskcd",
						"type": "Select",
						"userCol": "Task Code",
						"width": "80px"
					}, {
						"key": "ToZzactcd",
						"type": "Select",
						"userCol": "Activity Code",
						"width": "80px"
					}, {
						"key": "ToZzfftskcd",
						"type": "Select",
						"userCol": "Flat Fee taskCode",
						"width": "80px"
					}, {
						"key": "ToZzffactcd",
						"type": "Select",
						"userCol": "Flat Fee ActivityCode",
						"width": "80px"
					}, {
						"key": "ActualQty",
						"type": "Input",
						"userCol": "Qty",
						"width": "80px"
					}, {
						"key": "Percent",
						"type": "Input",
						"userCol": "%",
						"width": "60px"
					}, {
						"type": "Button",
						"userCol": "",
						"width": "50px"
					}, {
						"type": "Icon",
						"userCol": "",
						"width": "50px"
					}

				],
				Columns: [{
					Pspid: "",
					Vbeln: [],
					ToPhase: [],
					ToZztskcd: [],
					ToZzactcd: [],
					ToZzfftskcd: [],
					ToZzffactcd: [],
					ActualQty: "",
					Percent: "",
					selPhaseKey: "",
					selTskKey: "",
					selActKey: "",
					selFfTskKey: "",
					selFfActKey: ""

				}],
				Toolbar: {
					CreateFinalBill: true,
					CancelDraftBill: true,
					PrintFinalBill: true,
					HomePrintDraftBill: true,
					HomeChangeStatus: true,

					NarrativeSave: false,
					NarrativeReplaceWords: false,
					NarrativeReviewed: false,
					NarrativeUnReviewed: false,
					GlobalSpellCheck: false,

					Reprice: false,
					HeaderAddComments: false,
					HeaderChangeStatus: false,
					HeaderSave: false,
					HeaderPrintDraftBill: false,

					LineItemSave: false,
					Postpone: false,
					LineItemAddComments: false,
					LineItemReplaceWords: false,
					FullWriteDown: false,
					LineItemReprice: false,
					WriteUpDown: false,
					BillExactAmount: false,
					RateOverride: false,
					LineItemUpdateCodes: false,
					LineItemReviewed: false,
					LineItemUnReviewed: false,

					LineItemTransferSave: false,
					LineItemTransferReviewed: false,
					LineItemTransferUnReviewed: false,
					Transfer: false,
					Consolidate: false,
					SplitTransfer: false,
					LineItemTransferUpdateCodes: false,
					TransferPrintDraftBill: false,
					TransferChangeStatus: false,

					Undo: false

				},

				ToolbarEnable: {
					CreateFinalBill: false,
					CancelDraftBill: false,
					PrintFinalBill: false,
					HomePrintDraftBill: false,
					HomeChangeStatus: false,

					NarrativeSave: false,
					NarrativeReplaceWords: false,
					NarrativeReviewed: false,
					NarrativeUnReviewed: false,
					GlobalSpellCheck: false,

					Reprice: true,
					HeaderAddComments: true,
					HeaderChangeStatus: true,
					HeaderSave: true,
					HeaderPrintDraftBill: true,

					LineItemSave: false,
					Postpone: false,
					LineItemAddComments: false,
					LineItemReplaceWords: false,
					FullWriteDown: false,
					LineItemReprice: false,
					WriteUpDown: false,
					BillExactAmount: true,
					RateOverride: false,
					LineItemUpdateCodes: false,
					LineItemReviewed: false,
					LineItemUnReviewed: false,

					LineItemTransferSave: false,
					LineItemTransferReviewed: false,
					LineItemTransferUnReviewed: false,
					Transfer: false,
					Consolidate: false,
					SplitTransfer: false,
					LineItemTransferUpdateCodes: false,
					TransferPrintDraftBill: false,
					TransferChangeStatus: false,

					Undo: false
				},
				dicDefLanguage: "en_US",
				Countries_collection: [
					//{
					// 	Key: "ca",
					// 	Text: "Catalan",
					// 	lang:"ca"
					// }, {
					// 	Key: "cs_CZ",
					// 	Text: "Czech",
					// 		lang:"cs"
					// }, {
					// 	Key: "de_DE_frami",
					// 	Text: "Dutch",
					// 		lang:"nl"
					// }, {
					// 	Key: "en_AU",
					// 	Text: "English(AU)",
					// 		lang:"en"
					// }, {
					// 	Key: "en_CA",
					// 	Text: "English(CA)",
					// 		lang:"en"
					// },
					{
						Key: "en_US",
						Text: "English(US)",
						lang: "en"
					}, {
						Key: "ar",
						Text: "Arabic",
						lang: "ar"
					},
					// {
					// 	Key: "en_GB",
					// 	Text: "English(UK)",
					// 		lang:"en"
					// }, 
					{
						Key: "fr",
						Text: "French",
						lang: "fr"
					}
					// {
					// 	Key: "dataEn",
					// 	Text: "German",
					// 		lang:"de"
					// }, {
					// 	Key: "hu_HU",
					// 	Text: "Hungarian",
					// 		lang:"hu"
					// }, {
					// 	Key: "id_ID",
					// 	Text: "Indonesian",
					// 		lang:"id"
					// },

					// {
					// 	Key: "it_IT",
					// 	Text: "Italian",
					// 		lang:"it"
					// }, {
					// 	Key: "pl_PL",
					// 	Text: "Polish",
					// 		lang:"pl"
					// }, {
					// 	Key: "pt_PT",
					// 	Text: "Portugese",
					// 		lang:"pt"
					// }, {
					// 	Key: "ru_RU",
					// 	Text: "Russian",
					// 		lang:"ru"
					// }, {
					// 	Key: "dataEn",
					// 	Text: "Spanish",
					// 		lang:"es"
					// }, {
					// 	Key: "sv_SE",
					// 	Text: "Swedish",
					// 		lang:"sv"
					// }, {
					// 	Key: "th_TH",
					// 	Text: "Thai",
					// 		lang:"th"
					// }, {
					// 	Key: "tr_TR",
					// 	Text: "Turkish",
					// 		lang:"tr"
					// }
				],

			};
		}
	});
});
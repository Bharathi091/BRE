jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"dbedit/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"dbedit/test/integration/pages/Worklist",
		"dbedit/test/integration/pages/Object",
		"dbedit/test/integration/pages/NotFound",
		"dbedit/test/integration/pages/Browser",
		"dbedit/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "dbedit.view."
	});

	sap.ui.require([
		"dbedit/test/integration/WorklistJourney",
		"dbedit/test/integration/ObjectJourney",
		"dbedit/test/integration/NavigationJourney",
		"dbedit/test/integration/NotFoundJourney",
		"dbedit/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});
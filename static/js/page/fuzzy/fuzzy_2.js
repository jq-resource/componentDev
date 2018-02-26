'use strict'
seajs.use(["request","fuzzy","common"],function(SMRequest,SMFuzzy,common){
	var request = new SMRequest();
	common.pageInit("fuzzy");
	request.use("../../data/userlist.json","",function(rel){
		new SMFuzzy({
			el:$("#username"),
			delay:300,
			resource:rel.slice(0)
		});
	});
})
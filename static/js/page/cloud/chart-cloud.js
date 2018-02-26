'use strict'
seajs.use(["common","cloud","request"],function(common,SMcloud,SMrequest){
	var request = new SMrequest(); 
	common.pageInit("cloud");
	
	request.use("../../data/cloud.json","",function(result){
		new SMcloud($("#cloud"),{
			resource:result.slice(0),
			limit:20,
			delayTime:100,
			removeOverflowing:false
		})
	});
	
});
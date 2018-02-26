'use strict'
seajs.use(["common","request","tree"],function(common,SMRequest,Tree){
	common.pageInit("tree");

	var request = new SMRequest();

	init();

	function init(){
		request.use("../../data/tree.json",{},function(result){
			var tree = new Tree({
				container:$("#tree"),
				resource:result.slice(0),
				limit:4,
				canAdd:true,
				canEdit:true,
				canDelete:true,
				expanded:false,
				param:{
					id           : "id",
					name         : "category",
					childrenList : "subCategory",
					addTxt       : "再来一条"
				}
			});
		});
	}
});
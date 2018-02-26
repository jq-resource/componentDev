seajs.use(["select","table","request","common"],function(SMSelect,SMTable,SMRequest,common){
	var keySet =[{key:"age",name:"年龄"},{key:"name",name:"用户姓名"},{key:"job",name:"职业"},{key:"address",name:"地址"},{key:"else",name:"其它"}];
	var param = new SMSelect({
			size       : 4,
			resource   : keySet.slice(0),
			container  : $("#params"),
			callback   : function(val){
				$("#paramVal").attr("data-key",val).val("");
				getInfo();
			}
		}),
		_request = new SMRequest(),
		_info = new SMTable({
			container:$("#infoList")
		});

	common.pageInit("fuzzy");

	getInfo();

	function getParam(){
		return {
			  key : $("#paramVal").attr("data-key"),
			  val : $.trim($("#paramVal").val()),
			exact : $("#exact").is(":checked")
		};
	}

	function getInfo(){
		var param = getParam();
		_request.use("../../data/info.json",param,function(result){
			var rel = param.key === "" ? result.slice(0) : result.filter(function(item){
					return param.exact ? item[param.key] == param.val : item[param.key].toString().indexOf(param.val) > -1 ;
				});
			showInfo(rel);
		});
	}
	function showInfo(data){
		_info.container.find("table").empty();
		_info.setTitle({
			resource:["序号","年龄","用户姓名","职业","地址","其它"]
		});
		for(var i=0;i<data.length;i++){
			_info.setView({
				resource:[i+1,data[i].age,data[i].name,data[i].job,data[i].address,data[i].else]
			});
		}
		_info.paintView();
	}

	$("#search-btn").click(function(){
		getInfo();
	});
	$("#exact").change(function(){
		getInfo();
	})
})
'use strict'
seajs.use(["request","table","common","pagenation","select"],function(SMRequest,SMTable,common,SMPagenation,SMSelect){
	common.pageInit("pagenation");
	//引用了表格，轮播，ajax请求3个组件
	var url = tool.getSearch(),
		request = new SMRequest(),
		table = new SMTable({
			container:$("#hobbyList")
		}),
		pagenation = new SMPagenation({
			container:$("#page-menu"),
			//mode:"link",
			//hrefFormer:"pagenation",
			//hrefLatter:".html",
			//lang:{
			//	firstPageText : '<<',
			//	lastPageText  : '>>',
			//	prePageText	  : '<',
			//	nextPageText  : '>'
			//},
			//theme:{
			//	defaultClass  : "paging-default-danger",
			//	currentClass  : "paging-active-danger",
			//	disableClass  : "paging-disable"
			//},
			selectPage:function(n){
				changePage(n)
			}
		}),
		select = new SMSelect({
			selected:20,
			resource:[{id:"10","name":10},{id:"20","name":20},{id:"50","name":50},{id:"100","name":100}],
			container:$("#page-size"),
			callback:function(){
				alert("吊起改变页面大小数据关联分页的操作");
			}
		});

	init();

	function init(){
		getHobbyImgs();
	}
	//获取图片展示数据
	function getHobbyImgs(){
		request.use("../../data/img-resource.json","",function(result){
			renderImgs(result);
			//pagenation.update(12,url.pageIndex);
			pagenation.update(12,1);
		})
	}
	function renderImgs(data){
		table.setTitle({
			resource:["序号","类别","内容"]
		});
		for(var i=0;i<data.length;i++){
			var $tr = table.setView({
					resource:[i+1,data[i].category,'<img src="'+data[i].resource[0]+'"/>']
				});
		}
		table.paintView();
	}

	function changePage(n){
		pagenation.update(12,n)
	}

});
'use strict'
seajs.use(["slide","request","table","common"],function(SMslide,SMRequest,SMTable,common){
	//引用了表格，轮播，ajax请求3个组件
	var slide = new SMslide({
			container:$("#bigshow")
		}),
		request = new SMRequest(),
		table = new SMTable({
			container:$("#hobbyList")
		});

	init();

	function init(){
		common.pageInit("slide");
		getHobbyImgs();
	}
	//获取图片展示数据
	function getHobbyImgs(){
		request.use("../../data/img-resource.json","",function(result){
			renderImgs(result);
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
			(function(idx){
				$tr.find("img").click(function(){
					slide.setView({
						resource:data[idx].resource,
						title:data[idx].title
					});
					slide.painBigImg();
				});
			})(i)
		}
		table.paintView();
	}

});
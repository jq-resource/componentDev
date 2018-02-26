'use strict'
seajs.use(["request","select","common"],function(SMRequest,SMSelect,common){
	var _request = new SMRequest(),
		province = new SMSelect({
			resource:[],
			container:$("#province"),
			callback:function(val){
				flagFirst(val);
			}
		}),
		city = new SMSelect({
			resource:[],
			container:$("#city"),
			callback:function(val){
				flagSecond(val);
			}
		}),
		town = new SMSelect({
			resource:[],
			container:$("#town")
		});

	var data = [],
		current = [];
	common.pageInit("select");

	//请求数据
	_request.use("../../data/area.json","",function(result){
		data = result.slice(0);
		province.resource = data.slice(0);
		province.refresh();
	});

	//切换一级更新二三级数据
	function flagFirst(val){
		current.length = 0;
		current = data.filter(function(item){
			return item.provinceId == val;
		});
		city.resource = !val ? [] : current[0].childList.slice(0);
		city.refresh();

		town.resource = [];
		town.refresh();
	}

	//切换二级更新三级
	function flagSecond(val){
		var townArr = current[0].childList.filter(function(item){
			return item.cityId == val;
		});
		town.resource = !val ? [] : townArr[0].childList.slice(0);
		town.refresh();
	}

});
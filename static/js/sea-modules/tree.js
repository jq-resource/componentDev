define(function(require,exports,module){
	var _config = {
			id           : "id",
			name         : "name",
			childrenList : "childrenList",
			addTxt       : "增加一条",
			level		 : "level"
		};

	var SMTree = function(opt){
		this.container = opt.container || null;
		this.resource  = opt.resource || [];
		this.limit     = opt.limit || 3;
		this.canEdit   = opt.canEdit || false;
		this.canDelete = opt.canDelete || false;
		this.canAdd    = opt.canAdd  || false;
		this.expanded  = opt.expanded || false;
		this.param     = $.extend({},_config,opt.param);
		this.init();
	}

	SMTree.prototype = {
		constructor:SMTree,
		init:function(){
			var self = this;
			self.Ele = $('<div class="tree-area"></div>');
			self.Ele.append(self.paint(self.resource,true));
			self.container.append(self.Ele);
			self.expand();
			self.edit();
			self.change();
			self.delete();
			self.adds();
		},
		paint:function(data,bool){
			var self = this,
				i,len=data.length,item,ul = '<ul class="'+((self.expanded || bool)? "" : "none")+'">';
			
			if(len === 0){//如果没有子级 && 不支持新增
				return self.canAdd ? '<ul class="'+(self.expanded ? "":"none")+'"><li><span class="icon"></span><span class="font font-warning">'+self.param.addTxt+'</span></li></ul>' : "";
			}else { 
				for(i=0;i<len;i++){
					item = data[i];
					ul += '<li>'
								+'<div class="tree-item">'
									+'<span class="icon '+(self.expanded ? "icon-reduce":"icon-add")+' flag" value="'+item[self.param.level]+'"></span>'
									+'<span class="tree-item-title" value="'+item[self.param.id]+'">'+item[self.param.name]+'</span>'
									+'<input type="text" class="input none">';
									if(self.canEdit){ul += '<span class="icon icon-edit"></span>';}
									if(self.canDelete){ul += '<span class="icon icon-delete"></span>';}
								ul += '</div>'
								+ self.paint(item[self.param.childrenList])
								+'</li>';
				}
				if(self.canAdd){
					ul += '<li><span class="icon"></span><span class="font font-warning">'+self.param.addTxt+'</span></li>';
				}
				ul += '</ul>';
				return ul;
			}
		},

		//点击+号展开紧邻着的下级元素
		expand:function(){
			var self = this;
			self.container.on("click",".flag",function(){
				var _this = $(this),
					_level = _this.attr("value"),
					_ul = _this.parent().next().is("ul");
				if(!_ul){
					new SMDialog.Toast({
						message:"当前类目下没有子级内容！",
						duration:3000
					});
					return;
				}
				if(_level >= self.limit){
					new SMDialog.Toast({
						message:"最大能到"+self.limit+"级！",
						duration:3000
					});
					return;
				}
				if(_this.hasClass("icon-add")){
					_this.removeClass("icon-add").addClass("icon-reduce");
					_this.parent().next().removeClass("none");
				}else{
					_this.removeClass("icon-reduce").addClass("icon-add");
					_this.parent().next().addClass("none");
				}
			});
		},
		//编辑
		edit:function(){
			var self = this;
			self.container.on("click",".icon-edit",function(){
				var _this = $(this),
					_input = _this.prev(),
					_title = _input.prev();
				_title.addClass("none");
				_input.removeClass("none").val(_title.text()).focus();
			});
		},
		change:function(){
			var self = this;
			self.container.on("blur",".input",function(){
				var _this = $(this),
					_title = _this.prev(),
					_val = $.trim(_this.val());
				if(_val){
					_this.addClass("none");
					_title.removeClass("none").text(_val);
				}else{
					new SMDialog.Toast({
						message:"内容不能为空！",
						duration:3000
					});
				}
			});
		},
		//删除
		delete:function(){
			var self = this;
			self.container.on("click",".icon-delete",function(){
				var _this = $(this),
					_li = _this.parents("li");
				var _confirm = new SMDialog.Confirm({
					message:"当前数据删除后无法恢复，请谨慎操作！",
					title:"删除",
					okBtnVal:"坚决不要",
					noBtnVal:"容我想想",
					showClose:true,
					cb:function(){
						_li.remove();
					}
				});
				_confirm.start();
			});
		},
		//增加一条
		adds:function(){
			var _num = new tool.SMNumber();
			var self = this,
				str = '<li>'
						+'<div class="tree-item">'
							+'<span class="icon '+(self.expanded ? "icon-reduce":"icon-add")+' flag" value=""></span>'
							+'<span class="tree-item-title none" value=""></span>'
							+'<input type="text" class="input">';
							if(self.canEdit){
								str += '<span class="icon icon-edit"></span>';
							}
							if(self.canDelete){
								str += '<span class="icon icon-delete"></span>';
							}
							
						str += '</div><ul class="'+(self.expanded ? "" : "none")+'">';
								if(self.canAdd){
									str += '<li><span class="icon"></span><span class="font font-warning">'+self.param.addTxt+'</span></li>';
								}
						str += '</ul></li>'
			self.container.on("click",".font-warning",function(){
				var _this = $(this),
					_prev = $(str),
					_li = _this.parent(),
					_last = _this.parent().parent().prev().find(".tree-item-title").attr("value"),
					_prevVal = _this.parent().prev().find(".tree-item-title").attr("value")*1,
					_len = _this.parent().parent().children().length,
					_level = _this.parent().parent().prev().find(".flag").attr("value")*1 || 0;
				_prev.find(".tree-item-title").attr("value",((_prevVal+1) || (_last + _num.format(_len))));
				_prev.find(".flag").attr("value",_level+1);
				_prev.insertBefore(_li).find("input").focus();
			});

		}

	}

	module.exports = SMTree;
});






//var Tree = function(con){
//	container:conf.con;
//
//
//}
//Tree.prototype = {
//	init: function(){
//		new Treex(data);
//	}
//}
//
//
//var Treex = function(data,parentTreex){
//	this.parent = parentTreex;
//	this.child = [];
//	this.data = data;
//}
//
//Tree.prototype = function(){
//	init: function(){
//		var self = this;
//
//		for(datat){
//			var treex = new Treex(self.data);
//			self.id = data[i].id;
//			self.chld.push(treex);
//		}
//	}
//	add:function(){
//
//	}
//	
//}
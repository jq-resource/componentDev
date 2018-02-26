/* 模糊搜索组件
* el:模糊搜索数据承载元素
* delay:延迟执行，设置为0即为不延时
* resource:模糊搜索数据源
*/
define(function(require,exports,module){
	var SMFuzzy = function(opt){
		this.el       = opt.el || null;
		this.delay    = opt.delay || 0;
		this.resource = opt.resource || [];
		this.init();
	}

	SMFuzzy.prototype = {
		constructor:SMFuzzy,
		init:function(){
			var self = this;
			self.fuzzyBox = $('<div class="fuzzy-body none"></div>'),
			self.ul = $('<ul></ul>');
			self.key = self.el.attr("data-key");
			self.val = self.el.attr("data-val");
			self.fuzzyBox.append(self.ul);
			self.fnSet();
		},
		setView:function(data){
			var self = this,
				len = data.length;
			for(var i=0;i<len;i++){
				self.ul.append('<li data-id="'+data[i][self.key]+'">'+data[i][self.val]+'</li>');
			}
			self.el.after(self.fuzzyBox);
		},
		change:function(){
			var self = this,
				data= self.resource.filter(function(item){
					return item[self.val].indexOf($.trim(self.el.val())) > -1;
				});
			self.el.attr("data-id","");
			self.ul.empty();
			setTimeout(function(){
				self.setView(data);
			},self.delay);
		},
		fnSet:function(){
			var self = this;
			self.el.focus(function(e){
				self.fuzzyBox.removeClass("none");
				self.change();
			}).keyup(function(){
				self.change();
			});
			$(document).on("click",function(e){
				if(e.target.tagName === "LI"){
					self.el.attr("data-id",$(e.target).attr("data-id")).val($(e.target).text());
				}else if(e.target.tagName === "INPUT"){
					return;
				}
				self.fuzzyBox.addClass("none");
			})
		}
	}

	module.exports = SMFuzzy;
});
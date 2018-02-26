define(function(require,exports,module){
	/*
	* size 下拉框显示的项个数
	* resource 数据源
	* container 下拉框的数据容器
	* callback 选项发生改变时的回调函数
	*/
	var SMSelect = function(opt){
			this.size       = opt.size || 5;
			this.selected	= opt.selected;
			this.resource   = opt.resource || [];
			this.container  = opt.container || null;
			this.callback   = opt.callback || null;
			this.init();
		};

	SMSelect.prototype = {
		constructor:SMSelect,
		init:function(){
			var self = this;
			self.Ele = $('<select class="select"></select>');
			self.setView();
			self.Ele.change(function(){
				self.callback && self.callback(self.Ele.val());
			});
		},
		setView:function(){
			var self = this,
				key  = self.container.attr("data-key") || "id",
				val  = self.container.attr("data-val") || "name",
				defaultVal =  self.container.attr("data-default") || "请选择",
				len  = self.resource.length;
			self.Ele.append('<option value="" >'+defaultVal+'</option>');
			for(var i=0;i<len;i++){
				var item = self.resource[i];
				var _tip = item[key] == self.selected ? "selected" :"" ;
				self.Ele.append('<option value="'+item[key]+'" '+_tip+'>'+item[val]+'</option>');
			}
			self.container.append(self.Ele);
		},
		refresh:function(){
			var self = this;
			self.Ele.empty();
			self.setView();
		}
	}

	module.exports = SMSelect;

})
define(function(require,exports,module){
	var SMTable  = function(opt){
	    this.container = opt.container;
	    this.init();
	};

	SMTable.prototype = {
		constructor:SMTable,
		init:function(){
			var self = this;
			self.listEle = $("<table></table");
		},
		setTitle:function(_o){
			var self = this;
			var $thead = $("<thead><tr></tr></thead><tbody></tbody>");
			for(var i=0;i<_o.resource.length;i++){
				$thead.find("tr").append('<th>'+_o.resource[i]+'</th>');
			}
			_o.trClass && $thead.find("tr").addClass(_o.trClass);
			_o.thClass && $thead.find("th").addClass(_o.thClass);
			self.listEle.append($thead);
		},
		addView:function(_tr){
			var self = this;
			self.listEle.find("tbody").append(_tr);
		},
		setView:function(_o){
			var self = this;
			var $tr = $("<tr></tr>");
			for(var i=0;i<_o.resource.length;i++){
				$tr.append('<td>'+_o.resource[i]+'</td>');
			}
			_o.trClass && $tr.addClass(_o.trClass);
			_o.tdClass && $tr.find("td").addClass(_o.tdClass);
			self.addView($tr);
			return $tr;
		},
		paintView:function(){
			var self = this;
			self.container.append(self.listEle);
		}
	}

	module.exports = SMTable;
});

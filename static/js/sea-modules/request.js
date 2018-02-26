define(function(require,exports,module){
	var SMRequest = function(){
	}
	SMRequest.prototype = {
		constructor:SMRequest,
		use:function(url,param,fn,opt){
			$.ajax({
				type: opt && opt.type || "get",
	            url: url,
	            data: param,
	            dataType: opt && opt.dataType || "json",
	            success: function(result){
	                fn(result);
	         	}
			});
		}
	}
	module.exports = SMRequest;
});

define(function(require,exports,module){

	var Page = require("page");

	/*
	* 弹框组件SMDialog
	*******警告框 alert
	*******确认框 confirm
	*******提示框 toast
	*******输入框 prompt
	*/
	window.SMDialog ={};

		/* 警告框
		* message  内容
		* title	   标题
		* okBtnVal 按钮文案
		* cb	   回调函数
		*/
		SMDialog.Alert = function(opt){
			this.message   = opt.message || "";
			this.title     = opt.title || "";
			this.okBtnVal    = opt.okBtnVal || "确定";
			this.cb        = opt.cb || null;
			this.showClose = opt.showClose === false ? false : true;
			this.container = null;
			this.init();
		}
		SMDialog.Alert.prototype = {
			constructor:SMDialog.Alert,
			init:function(){
				var self = this;
				self.container = $('<div class="container"></div>');
				self.container.append('<div class="dialog-bg"></div>');
			},
			add:function(){
				var self = this,
					$dialog = $('<div class="dialog"></div>');
				if(self.title){
					var $title = $('<div class="dialog-title"></div>');
					if(self.showClose){
						$title.append('<div class="tip"><span class="icon icon-close"></span></div>');
					}
					$title.append('<h2>'+self.title+'</h2>');
					$dialog.append($title);
				}
				$dialog.append('<div class="dialog-content">'+self.message+'</div>');
				$dialog.append('<div class="dialog-foot"><span class="btn btn-info">'+self.okBtnVal+'</span></div>');
				self.container.append($dialog);
				$("body").append(self.container);
				self.fn();
				
			},
			remove:function(){
				var self = this;
				self.container.remove();
			},
			fn:function(){
				var self = this;
				self.container.find(".icon-close").off().click(function(){
					self.remove();
				});
				if(self.cb != null){
					self.container.find(".btn-info").off().click(function(){
						self.remove();
						self.cb();
					});
				}
			}
		}

		/* 提示框
		* message  内容
		* duration 周期
		*/

		SMDialog.Toast = function(opt){
			this.message = opt.message || "";
			this.duration = opt.duration || 300;
			this.container = null;
			this.init();
		}
		SMDialog.Toast.prototype = {
			constructor: SMDialog.Toast,
			init:function(){
				var self = this;
				self.container = $('<div class="toast">'+self.message+'</div>');
				$("body").append(self.container);
				self.container.fadeOut(self.duration);
			}
		}

		/* 确认框
		* message   内容
		* title     标题
		* okBtnVal  ok按钮文案
		* noBtnVal  no按钮文案
		* showClose 是否显示关闭按钮
		* cb        回调函数 
		*/

		SMDialog.Confirm = function(opt){
			SMDialog.Alert.apply(this,arguments);
			this.noBtnVal = opt.noBtnVal || "取消";
		}

		function extend(Child, Parent) {
	　　　　var F = function(){};
	　　　　F.prototype = Parent.prototype;
	　　　　Child.prototype = new F();
	　　　　Child.prototype.constructor = Child;
	　　　　Child.uber = Parent.prototype;
	　　}
		extend(SMDialog.Confirm,SMDialog.Alert);

		SMDialog.Confirm.prototype.start = function(){
			var self = this;
			self.add();
			self.container.find(".dialog-foot").append('<span class="btn btn-disable">'+self.noBtnVal+'</span>');
			self.container.find(".btn-disable").off().click(function(){
				self.remove();
			});
		}

		/*  输入框
		* message     内容
		* title       标题
		* placeholder 占位文字
		* okBtnVal    ok按钮文案
		* noBtnVal    no按钮文案
		* showClose   是否显示关闭按钮
		* cb          回调函数 
		*/

		SMDialog.Prompt = function(opt){
			SMDialog.Confirm.apply(this,arguments);
			this.placeholder = opt.placeholder || "请输入……";
			this.defaultVal  = opt.value || "";
		}
		extend(SMDialog.Prompt,SMDialog.Confirm);

		SMDialog.Prompt.prototype.input = function(){
			var self = this;
			self.start();
			self.container.find(".dialog-content").append('<div><input type="text" class="input" placeholder="'+self.placeholder+'" value="'+self.defaultVal+'"/></div>');
			if(self.cb != null){
				self.container.find(".btn-info").off().click(function(){
					var val = $.trim(self.container.find("input").val());
					//self.remove();
					self.cb(val);
				});
			}
		}


	//各种工具
	window.tool = {}
		/*处理地址栏*/
		window.tool.getSearch = function(){
			var obj = {},
				url = location.search.slice(1).split("&");
			for(var i=0;i<url.length;i++){
				var arr = url[i].split("=");
				obj[arr[0]] = arr[1];
			}
			return obj;
		}


		/*处理数值*/
		window.tool.SMNumber = function (){

		}
		window.tool.SMNumber.prototype = {
			constructor:window.tool.SMNumber,
			format:function(val){
				return val < 10 ? "0"+val : val;
			}
		}



		/*处理颜色*/
		window.tool.SMColor = function(){}
		window.tool.SMColor.prototype = {
			onstructor:window.tool.SMColor,
			colorByRGB:function(opacity){
				var r = Math.floor(Math.random()*256),
					g = Math.floor(Math.random()*256),
					b = Math.floor(Math.random()*256),
					a = opacity || "";
				return a ? "rgba("+r+","+g+","+b+","+a+")" : "rgb("+r+","+g+","+b+")";
			},
			colorByRex:function(isShort){
				var charset = "0123456789abcdef".split(""),
					len = isShort ? 3 : 6,
					str = "#";
				for(var i=0;i<len;i++){
					var j = Math.floor(Math.random() * 16);
					str += charset[j];
				}
				return str;
			}
		}
		
	
	exports.pageInit = function(tagId){
		var page = new Page({
			username : "henyulee",
			   tagId : tagId || ""
		});
			
	}
})
define(function(require,exports,module){

	var config = {
			firstPageText : '首页',
			lastPageText  : '尾页',
			prePageText	  : '上一页',
			nextPageText  : '下一页'
		},
		_theme = {
			defaultClass  : "paging-default-info",
			currentClass  : "paging-active-info",
			disableClass  : "paging-disable"
		};
	
	var SMPager = function (opt) {
			this.container   = opt.container || null;
			this.mode        = opt.mode || "click";//有link 和click2种，默认click
			this.dotType     = opt.dotType || "...";
			this.hrefFormer  = opt.hrefFormer; //链接前部  适用于link模式
			this.hrefLatter  = opt.hrefLatter; //链接尾部  适用于link模式
			this.lang        = $.extend({},config,opt.lang);//适用于文案
			this.theme       = $.extend({},_theme,opt.theme);
			this.selectPage  = opt.selectPage || null;//点击页码的回调函数
			this.init();
		};

		SMPager.prototype = {
			constructor:SMPager,
			init:function(){
				var self = this;
				self.hasPrev = false;
				self.hasNext = false;
				self.prev = 0;
				self.next = 0;
				self.currentPage = 0;
				self.total = 0;				
				self.pagerInit();
				self._click();
			},
			pagerInit:function(){
				var self = this;
				var str_first='',str_prev='',str_next='',str_last='';
				self.div = $('<div class="none"></div')

				if(self.total == 0) return ;

				if(self.hasPrev){
					str_first = '<a class="paging paging-ctrl '+self.theme.defaultClass+'" '+self._getHandlerStr(1)+' title="'
						+self.lang.firstPageText+'">'+self.lang.firstPageText+'</a>';
					str_prev = '<a class="paging paging-ctrl '+self.theme.defaultClass+'" '+self._getHandlerStr(self.prev)+' title="'
						+ self.lang.prePageText +'">'+self.lang.prePageText+'</a>';
				}else{
					str_first = '<span class="paging paging-ctrl '+self.theme.disableClass+'">'+self.lang.firstPageText+'</span>';
					str_prev = '<span class="paging paging-ctrl '+self.theme.disableClass+'">'+self.lang.prePageText+'</span>';
				}	
				if(self.hasNext){
					str_next = '<a class="paging paging-ctrl '+self.theme.defaultClass+'" '+self._getHandlerStr(self.next)+' title="'
						+ self.lang.nextPageText +'">'+self.lang.nextPageText+'</a>';
					str_last = '<a class="paging paging-ctrl '+self.theme.defaultClass+'" '+self._getHandlerStr(self.total)+' title="'
						+ self.lang.lastPageText +'">'+self.lang.lastPageText+'</a>';
				}else{
					str_next = '<span class="paging paging-ctrl '+self.theme.disableClass+'">'+self.lang.nextPageText+'</span>';
					str_last = '<span class="paging paging-ctrl '+self.theme.disableClass+'">'+self.lang.lastPageText+'</span>';
				}
				self.div.append(str_first+str_prev);
				self.div.append(self.pageSet);
				self.div.append(str_next+str_last).removeClass("none");
				self.container.append(self.div);
			},
			generPageBody:function(){
				var self = this;
				var str = "",
					bool = false,
					dot = '<span class="">'+self.dotType+'</span>';
					self.pageSet = $('<div class="inline"></div>');
				//分页处理
				if(self.total <= 8){
					for(var i=1;i<=self.total;i++){
						if(self.currentPage == i){
							str += '<span class="paging paging-num '+self.theme.defaultClass+" "+self.theme.currentClass+'">'+i+'</span>';
						}else{
							str += '<a class="paging paging-num '+self.theme.defaultClass+'" '+self._getHandlerStr(i)+' title="第'+i+'页">'+i+'</a>';
						}
					}
				}else{
					if(self.currentPage <= 5){
						for(var i=1;i<=7;i++){
							if(self.currentPage == i){
								str += '<span class="paging paging-num '+self.theme.defaultClass+" "+self.theme.currentClass+'">'+i+'</span>';
							}else{
								str += '<a class="paging paging-num '+self.theme.defaultClass+'" '+self._getHandlerStr(i)+' title="第'+i+'页">'+i+'</a>';
							}
						}
						str += dot;
						str += '<a class="paging paging-num '+self.theme.defaultClass+'" '+self._getHandlerStr(i)+' title="第'+self.total+'页">'+self.total+'</a>';
					}else{
						str += '<a class="paging paging-num '+self.theme.defaultClass+'" '+self._getHandlerStr(1)+' title="第1页">1</a>';
						str += '<a class="paging paging-num '+self.theme.defaultClass+'" '+self._getHandlerStr(2)+' title="第2页">2</a>';
						str += dot;
						
						var begin = self.currentPage - 2;
						var end = self.currentPage*1 + 2;
						if(end > self.total){
							end = self.total;
							begin = end - 4;
							if(self.currentPage - begin < 2){
								begin = begin-1;
							}
						}else if(end*1 + 1 == self.total){
							end = self.total;
						}
						for(var i=begin;i<=end;i++){
							if(self.currentPage == i){
								str += '<span class="paging paging-num '+self.theme.defaultClass+" "+self.theme.currentClass+'">'+i+'</span>';
							}else{
								str += '<a class="paging paging-num '+self.theme.defaultClass+'" '+self._getHandlerStr(i)+' title="第'+i+'页">'+i+'</a>';
							}
						}
						if(end != self.total){
							str += dot;
						}
					}
				}
				self.pageSet.append(str);
			},
			update:function(total,pageIndex){
				var self = this;
				self.total = total;
				self.currentPage = pageIndex;
				self.btnStatus();
			},
			btnStatus:function(){
				var self = this;
				self.hasPrev = true;
				self.hasNext = true;
				if(self.currentPage == 1){
					self.hasPrev = false;
					self.next = self.currentPage*1 + 1;
				}else if(self.currentPage == self.total){
					self.hasNext = false;
					self.prev = self.currentPage -1;
				}else{
					self.prev = self.currentPage - 1;
					self.next = self.currentPage*1 + 1;
				}
				self.div.remove();
				self.generPageBody();
				self.pagerInit();
			},
			_click:function(){
				var self = this;
				self.container.on("click","a",function(e){
					self.selectPage($(this).attr("value"));
				});	
			},
			_getHandlerStr: function(n){
				var self = this;
				if(self.mode == 'click'){
					return 'href="#" value="'+n+'"';
				}
				return 'href="'+self.getLink(n)+'"';
			},
			getLink : function(n){
				var self = this;
				return self.hrefFormer + self.hrefLatter + "?pageIndex="+n;
			}
		}

	module.exports =  SMPager;

});


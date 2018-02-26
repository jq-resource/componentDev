define(function(require,exports,module){
	var SMSlide  = function(opt){
	    this.container = opt.container;
	    this.resource = [];
	    this.title = [];
	    this.index = opt.index || 0;
	    this.init();
	};
	SMSlide.prototype = {
	    constructor: SMSlide,
	    init:function () {
	        var self = this;
	        self.initStr();
	    },
	    initStr:function () {
	        var self = this;
	        var str = '<div class="dialog-bg"></div>'
	                    +'<div class="dialog-body">'
	                        +'<div class="slide slide-left"></div>'
	                        +'<div class="slide slide-right"></div>'
	                        +'<div class="dialog-close">'
	                            +'<span class="icon-close"></span>'
	                        +'</div>'
	                        +'<div class="slide-til">'
	                        	+'<div class="left title"></div>'
	                        	+'<div class="right"><span class="font font-danger currentNum"></span>/<span class="font totalNums"></span></div>'
	                        +'</div>'
	                        +'<div class="big-area">'
	                            +'<img src="" alt="设计图"/>'
	                        +'</div>'
	                    +'</div>';
	        self.container.html(str);
	    },
	    slide:function () {
	        var self = this;
	        self.container.find(".slide-left").off().click(function () {
	            self.slidePrev();
	        });
	        self.container.find(".slide-right").off().click(function () {
	            self.slideNext();
	        });
	        self.container.find(".dialog-close").off().click(function () {
	           self.closeSlide();
	        });
	    },
	    setView:function (_o) {
	        var self = this;
	        self.resource = _o.resource.slice(0);
	        self.title = _o.title.slice(0);
	        self.showBigView();
	    },
	    showBigView:function () {
	        var self = this;
	        self.container.find("img").attr("src",self.resource[self.index]);
	        self.container.find(".currentNum").text(self.index+1);
	        self.container.find(".totalNums").text(self.resource.length);
	        self.container.find(".title").text(self.title[self.index])
	    },
	    slidePrev:function(){
	        var self = this;
	        if(self.index == 0){
	            return;
	        }
	        self.index -= 1;
	        self.showBigView();
	    },
	    slideNext:function () {
	        var self = this;
	        var len = self.resource.length;
	        if(self.index == len-1){
	            return;
	        }
	        self.index += 1;
	        self.showBigView();
	    },
	    closeSlide:function () {
	        var self = this;
	        self.container.addClass("none");
	        self.index = 0;
	        self.resource.length = 0;
	        self.title.length = 0;
	    },
	    painBigImg:function(){
	        var self = this;
	        self.container.removeClass("none");
	        self.slide();
	    }
	};
	module.exports = SMSlide;
});

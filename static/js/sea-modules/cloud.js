define(function(require,exports, module){

	var common = require("common"),
		color = new tool.SMColor();

	var SMCloud = function (container,opt) {
		this.container         = container;
		this.style             = opt.style || "jqcloud";
		this.limit             = opt.limit || 50;
		this.delayTime         = opt.delayTime || 10,
		this.resource          = opt.resource || [];
		this.delayedMode       = this.resource.length > this.limit ;//何时进行延迟显示
		this.shape             = opt.shape || "elliptic";//默认以椭圆风格显示
		this.encodeURI         = opt.encodeURI || true;//是否对地址栏里的汉字进行处理
		this.removeOverflowing = opt.removeOverflowing || true;//是否对溢出的元素进行裁剪
		this.afterCloudRender  = opt.afterCloudRender || null;//云图绘制完毕后的回调函数
		this.init();
	};

	SMCloud.prototype = {
		constructor : SMCloud,
		init : function (){
			var self = this;
			self.computed();

			self.container.addClass(self.style);//渲染云的主题样式
			//外层元素的定位属性不能是静态定位
			if(self.container.css("position") === "static"){
				self.container.css("position","relative");
			}
			return setTimeout(function(){ self.drawCloud()},10);
		},
		computed : function(){
			var self = this;
			self.cloud_namespace = this.container.attr("id") || Math.floor(Math.random()*1000000).toString(36);//命名空间
			self.size = {
				width  : this.container.width(),
				height : this.container.height()
			};
			self.center = {
				x  : self.size.width / 2.0,
				y  : self.size.height / 2.0
			};
			//确保排序前，权重都为数字
			for(var i = 0;i < self.resource.length;i++){
				self.resource[i].weight = parseFloat(self.resource[i].weight,10);
			}
			self.resource.sort(function(a,b){ return b.weight - a.weight; });
			//未来计算时可能用到的变量数据
			self.data = {
				step                 : self.shape == "rectangular" ? 18.0 : 2.0,
				aspect_ratio         : self.size.width / self.size.height,//扁率
				already_placed_words : [],//已确定没有冲突的数据集合
				angle 				 : 6.28 * Math.random(),
	            radius 				 : 0.0,
	            weight               : 5.0,
	            // 这2个属性只适用于矩形风格
	            steps_in_direction   : 0.0,
	            quarter_turns 		 : 0.0
			};
		},
		//当前元素与其余剩余元素是否有冲突
		hitTest : function(ele,other_eles){
			var self = this;
			for(var i = 0; i < other_eles.length; i++) {
	          if (self.overlapping(ele, other_eles[i])) {
	            return true;
	          }
	        }
	        return false;
		},
		//验证2个元素间是否有冲突
		overlapping : function(current,target){
			if (Math.abs(2.0 * current.offsetLeft + current.offsetWidth - 2.0 * target.offsetLeft - target.offsetWidth) < current.offsetWidth + target.offsetWidth) {
	            if (Math.abs(2.0 * current.offsetTop + current.offsetHeight - 2.0 * target.offsetTop - target.offsetHeight) < current.offsetHeight + target.offsetHeight) {
	              return true;
	            }
	          }
	        return false;
		},
		//绘制单元
		drawOneWord : function(idx,item){
			var self = this,
				word_id = self.cloud_namespace + "_word_" + idx,
	            word_selector = "#" + word_id,
	            inner_html = "",
	            word_ele;

	        self.data.angle = 6.28 * Math.random();
	        self.data.radius = 0.0;
	        self.data.steps_in_direction = 0.0;
	        self.data.quarter_turns = 0.0;
	        self.data.weight = 5.0;

	        item.html = $.extend(item.html || {},{id:word_id});
	        //检验是否是从大到小的排序
	        if(self.resource[0].weight > self.resource[self.resource.length-1].weight){
	        	//线性化1-10的线形排列
	        	self.data.weight = (item.weight - self.resource[self.resource.length -1].weight) / 
	        		(self.resource[0].weight + self.resource[self.resource.length-1].weight) * 9.0 + 1;
	        }
	        word_ele = $("<span>").attr(item.html).css({
	        	"color" : color.colorByRGB(),
	        	"font-size": (self.data.weight * 100) + "%"
	        });

	        //处理超链接
	        if(item.link){
	        	if(typeof item.link === "string"){
	        		item.link = {href:item.link};
	        	}
	        	if(self.encodeURI){
	        		item.link.href = encodeURI(item.link.href).replace(/'/g,"%27");
	        	}
	        	inner_html = $('<a>').attr(item.link).text(item.text);
	        }else{
	        	inner_html = item.text;
	        }
	        word_ele.append(inner_html);

	        //绑定时间处理函数
	        if(!!item.handlers){
	        	for(var prop in item.handlers ){
	        		if(item.handlers.hasOwnProperty(prop) && typeof item.handlers[prop] === "function"){
	        			word_ele.bind(prop,item.handlers[prop]);
	        		}
	        	}
	        }

	        self.container.append(word_ele);
	        self.setWordPos(idx,word_ele,item);

		},
		//绘制单元样式(定位)
		setWordPos : function(idx,current,item){
			var self = this,
				width = current.width(),
	            height = current.height(),
	            left = self.center.x - width / 2.0,
	            top = self.center.y - height / 2.0;

	        // 为了更好的表现形式，设置一个参考点
	        var word_style = current[0].style;
		        word_style.position = "absolute";
		        word_style.left = left + "px";
		        word_style.top = top + "px";

	        while(self.hitTest(current[0], self.data.already_placed_words)) {
	          // 矩形状态下，设置矩形螺旋
	          if (self.shape === "rectangular") {
	            self.data.steps_in_direction++;
	            if (self.data.steps_in_direction * self.data.step > (1 + Math.floor(self.data.quarter_turns / 2.0)) * self.data.step * ((self.data.quarter_turns % 4 % 2) === 0 ? 1 : self.data.aspect_ratio)) {
	              self.data.steps_in_direction = 0.0;
	              self.data.quarter_turns++;
	            }
	            switch(self.data.quarter_turns % 4) {
	              case 1:
	                left += self.data.step * self.data.aspect_ratio + Math.random() * 2.0;
	                break;
	              case 2:
	                top -= self.data.step + Math.random() * 2.0;
	                break;
	              case 3:
	                left -= self.data.step * self.data.aspect_ratio + Math.random() * 2.0;
	                break;
	              case 0:
	                top += self.data.step + Math.random() * 2.0;
	                break;
	            }
	          } else { // Default settings: elliptic spiral shape
	            self.data.radius += self.data.step;
	            self.data.angle += (idx % 2 === 0 ? 1 : -1)*self.data.step;

	            left = self.center.x - (width / 2.0) + (self.data.radius*Math.cos(self.data.angle)) * self.data.aspect_ratio;
	            top = self.center.y + self.data.radius*Math.sin(self.data.angle) - (height / 2.0);
	          }
	          word_style.left = left + "px";
	          word_style.top = top + "px";
	        }
	        //如果区域超出被裁减则该元素不显示
	         if (self.removeOverflowing && (left < 0 || top < 0 || (left + width) > self.size.width || (top + height) > self.size.height)) {
	          current.remove()
	          return;
	        }
	        self.data.already_placed_words.push(current[0]);
	        //插入完成之后是否有回调函数
	        if($.isFunction(item.afterWordRender)){
	        	item.afterWordRender.call(current);
	        }
		},
		//是否延时绘制元素
		drawOneWordDelayed : function(idx){
			var self = this,
				idx = idx || 0;
			if(!self.container.is(":visible")){
				setTimeout(function(){self.drawOneWordDelayed(idx)},10);
			}
			if(idx < self.resource.length){
				self.drawOneWord.call(self,idx,self.resource[idx])
				setTimeout(function(){self.drawOneWordDelayed(idx*1+1)},self.delayTime);
			}
		},
		//绘制云图
		drawCloud : function(){
			var self = this;
			if(self.delayedMode){
				self.drawOneWordDelayed();
			}else{
				$.each(self.resource,function(idx,item){
					self.drawOneWord.call(self,idx,item);
				});
			}
			if($.isFunction(self.afterCloudRender)) {
	          self.afterCloudRender.call(self.container);
	        }
	    	return self.container;
		},

	}

	module.exports = SMCloud;

});
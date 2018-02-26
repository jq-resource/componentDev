define(function(require,exports,module){
	var Request = require("request");
	var _request = new Request();

	var navClass = {
			"dialog"     : "bgdialog",
			"fuzzy"      : "bgfuzzy",
			"select"     : "bgselect",
			"slide"      : "bgslide",
			"pagenation" : "bgpagenation",
			"tree"	     : "bgtree",
			"cloud"		 : "bgcloud"
		};

	var SMPage = function(opt){
			this.headUrl = opt.headUrl || "../../view/public/head.html";
			this.headResource = opt.headResource || "";
			this.navUrl = opt.navUrl || "../../data/nav.json";
			this.navResource = opt.navResource || [];
			this.headContainer = opt.headContainer || $(".header-bar");
			this.container = opt.container || $(".slide-bar");
			this.username = opt.username || "";
			this.tagId = opt.tagId || "";
			this.init();
		}

		SMPage.prototype = {
			constructor:SMPage,
			init:function(){
				var self = this;
				self.setHead();
				self.setNav();
			},
			setHead:function(){
				var self = this;
				if(self.headResource == ""){
					_request.use(self.headUrl,"",function(rel){
						self.headContainer.append(rel);
						$("#consumer").text(self.username);
					},{dataType:"html"});
				}else{
					self.headContainer.append(self.headResource);
					$("#consumer").text(self.username);
				}
			},
			setNav:function(){
				var self = this;
				if(self.navResource.length == 0){
					_request.use(self.navUrl,"",function(rel){
						self.createNav(rel);
					});
				}else{
					self.createNav(self.navResource);
				}
			},
			createNav:function(data){
				var self = this;
				var i,j,len1 = data.length,len2,
					item1,item2,_class,
					str = '<div class="list-group-list"><ul>';
				for(i=0;i<len1;i++){
					item1 = data[i];
					_class = navClass[self.tagId] == item1.iconClass ? "active" :"";

					len2 = item1.subMenu.length;
					str += '<li class="list-group">'
							+'<div class="list-group-title '+_class+' '+item1.iconClass+'">'+item1.menuName+'</div><ul class="list-group-content">';
					for(j=0;j<len2;j++){
						item2 = item1.subMenu[j];
						str += '<li><a href="'+item2.href+'">'+item2.submenuName+'</a></li>';
					}
					str += '</ul></li>'
				}
				str += '</ul></div>';
				self.container.append(str);
				self.container.on("click",".list-group-title",function(){
					var _this = $(this);
					if(_this.is(".active")){
						return ;
					}
					self.container.find(".active").removeClass("active");
					_this.addClass("active");
				});
			}
		}

	module.exports = SMPage;

});
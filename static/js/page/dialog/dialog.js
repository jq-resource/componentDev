'use strict'
seajs.use(['common'],function(common){
	common.pageInit("dialog");


	$("#alert").click(function(){
		var _alert = new SMDialog.Alert({
			message:"我是警告框",
			title:"警告框",
			okBtnVal:"知道了",
			cb:function(){
				new SMDialog.Toast({
					message:"hello SM……",
					duration:1000
				});
			}
		});
		_alert.add();
	});

	$("#toast").click(function(){
		new SMDialog.Toast({
			message:"hello world @@",
			duration:3000
		});
	});

	$("#confirm").click(function(){
		var _confirm = new SMDialog.Confirm({
			message:"我是确认框",
			title:"确认框",
			okBtnVal:"再用用看",
			noBtnVal:"残忍卸载",
			cb:function(){
				new SMDialog.Toast({
					message:"hello 3秒之后即将关闭",
					duration:3000
				});
			}
		});
		_confirm.start();
	});

	$("#prompt").click(function(){
		var _prompt = new SMDialog.Prompt({
			message:"请输入您的年龄：",
			title:"输入框",
			okBtnVal:"我已经输入完了",
			noBtnVal:"放弃输入",
			placeholder:"请输入您的年龄",
			value:"20",
			cb:function(val){
				judgeRel(val,_prompt);
			}
		});
		_prompt.input();
	})

	function judgeRel(val,obj){
		if(val < 18){
			new SMDialog.Toast({
				message:"对不起，未成年人不能进入……",
				duration:3000
			});
			obj.container.find("input").val("");
		}else{
			obj.remove();
		}
	}

	
});
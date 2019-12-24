/*	create by Byron in 2019/12/23
*	封装ajax框架
*	ajaxObj		json类型参数
*	required params
*		type 	：请求类型(string)
*	 	url 	：请求地址(string)
*	 	data 	：请求参数(json)
*	 	success ：请求回调(function)
*	eg:
*		window.ajaxSeal({
*			type:'get',
*			url:'phpfile/ajax.php',
*			data:{
*				user:'zhangsan',
*				pass:'123123'
*			},
*			success:function(res){
*				console.log(res);
*			}
*		})
*		tips:get无参请求 data参数可以不写
*	封装函数思路：
*		1.先处理参数ajaxObj，把这个json格式的参数转换成必要个格式，
*			如果是get请求，将参数拼接到url后面
*				参数->数组->join()->url+join()
*			如果是post请求，则构建fromData参数对象
*				fromData.append();
*		2.准备xhr对象，然后实现onreadystatechange，准备发送请求
*			注意兼容性
*		3.准备open（）
*		4.准备send（）
*			判断get请求还是post请求
*/
	(function(){
		function ajaxSeal(ajaxObj){
			// 判断type类型
			if (ajaxObj.type.toLowerCase()=='get') {
				// type类型为get
				// 开始遍历data数据并且存储至数组中
				// 定义存储get参数的数组
				var info = [];
				for(var pro in ajaxObj.data){
					// 定义接收数组参数
					var infoStr = pro +'='+ajaxObj.data[pro];
					// 接收的数据存入数组中
					info.push(infoStr);
				}
				// 定义最终get参数   join('&')以&为分隔符并且转换为字符串
				var infoGet = info.join('&');
				// 拼装url
				ajaxObj.url +=ajaxObj.url.indexOf('?')==-1 ? '?'+infoGet : '&'+infoGet;
			}else if (ajaxObj.type.toLowerCase()=='post') {
				// type类型为post
				// 定义formdata
				var formdata = new FormData();
				// 遍历data数据并且存入formdata中
				for(var pro in ajaxObj.data){
					formdata.append(pro,ajaxObj.data[pro]);
				}
			}else{
				console.log('请检查参数设置！！！');
			}
			// 准备xhr对象 设置兼容性
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('');
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4) {
					if (xhr.status==200) {
						ajaxObj.success(JSON.parse(xhr.responseText));
					}
				}
			}
			xhr.open(ajaxObj.type.toLowerCase(),ajaxObj.url,true);
			if (ajaxObj.type.toLowerCase()=='get') {
				xhr.send(null);
			}else if (ajaxObj.type.toLowerCase()=='post') {
				xhr.send(formdata);
			}else{
				console.log('数据错误！！！');
			}
		}
		//通过IIFE将框架文件包裹
		//并通过window对象进行绑定
		window.ajaxSeal=ajaxSeal;
	}())

	
		
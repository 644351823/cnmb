var dlg_upload;
var targetData;
var win2;
var winmn;
var winmn2;
var showY;
var grid;
var winCpt;
var add_edit;
var add_edit_form;
var num2 = 0;
var Max;
var keshi;//cpt导出时使用的参数
var keflg ;//判断点击的是月份还是科室
var dangerShowGrid; //风险展示
var showFlag;//用来标识项目关键信息的，是否进行了点击
var suppid;//供应商代码
var suppname;//供应商名称
var arrid;//零件号
var arrname;//零件名称
var cartypename;
var power;//动力配置
var office;//业务科室
var startTime;//sop开始时间
var endTime;//sop结束时间
var flg = 'false';//是否是模拟
var year = "";//当前年 cpt用
var columnxm = new Array();
var columnxm2 = new Array();
var columnxm3 = new Array();
var shijian = false;//当项目关键信息选择供应商零件交叉一览，产能查询时间段不能为空
var num;//产能查询时间段的差值
var jiaocha = false;
var targetidwh;
$(function() {
	Ment();
	showFlag=false;
	var p = $("#startTime").datebox('panel'); // 日期选择对象    
	var span = p.find('div.calendar-title span'); // 显示月份层的触发控件 
	var end = $("#endTime").datebox('panel'); // 日期选择对象    
	var endspan = end.find('div.calendar-title span'); // 显示月份层的触发控件 

$("#startTime").datebox({
	formatter:function(date){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		if(m<10){
			m="0"+m
		}
		return y+"-"+m;
	},
	parser:function(s){

		var t = Date.parse(s);
		if (!isNaN(t)){
			return new Date(t);
		} else {
			return new Date();
		}
	},
	onShowPanel : function() {// 显示日期选择对象后再触发弹出月份层的事件，初始化时没有生成月份层 
			span.trigger('click'); // 触发click事件弹出月份层
			setTimeout(function() {// 延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔    
				tds = p.find('div.calendar-menu-month-inner td'); 
				tds.click(function(e) {
					e.stopPropagation(); // 禁止冒泡执行easyui给月份绑定的事件
					var year=/\d{4}/.exec(span.html())[0];//年份
					var month=parseInt($(this).attr('abbr'), 10);//月份
					if(month<10){
						month="0"+month;
					}
					$("#startTime").datebox('hidePanel')// 隐藏日期对象    
					.datebox('setValue', year + '-' + month); // 设置日期的值 
				});
			}, 0);
	}	
})
$("#endTime").datebox({
	formatter:function(date){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		if(m<10){
			m="0"+m
		}
		return y+"-"+m;
	},
	parser:function(s){
		
		var t = Date.parse(s);
		if (!isNaN(t)){
			return new Date(t);
		} else {
			return new Date();
		}
	},
	onShowPanel : function() {// 显示日期选择对象后再触发弹出月份层的事件，初始化时没有生成月份层 
			endspan.trigger('click'); // 触发click事件弹出月份层
			setTimeout(function() {// 延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔    
				tds = end.find('div.calendar-menu-month-inner td'); 
				tds.click(function(e) {
					e.stopPropagation(); // 禁止冒泡执行easyui给月份绑定的事件
					var year=/\d{4}/.exec(endspan.html())[0];//年份
					var month=parseInt($(this).attr('abbr'), 10);//月份
					if(month<10){
						month="0"+month;
					}
					$("#endTime").datebox('hidePanel')// 隐藏日期对象    
					.datebox('setValue', year + '-' + month); // 设置日期的值 
				});
			}, 0);
	}	
})

	if(cartypenameY!=null && cartypenameY!=""){
		$('#south').show();
		$('#three').show();
		$('#newMn').hide();
		
		if(zhuti=='bootstrap'){
			  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx2.frm&cartypename='+cartypenameY
			 +'&startTime='+startTimeY+'&endTime='+endTimeY;
		  }else{
			  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx.frm&cartypename='+cartypenameY
				 +'&startTime='+startTimeY+'&endTime='+endTimeY;
		  }
		$('#cpt').attr('src', reportUrl);
	}
	var  Now= new Date();
    year = Now.getFullYear();
    
    
    var  hebingrow=0; 
	var  count=0; 
	var start;
	var end;
	var pend;
	var pstart;
	$("#targetData").datagrid({
		title:'',
        methord : 'post',
        rownumbers: false,
        fit:true,	
        columns: [[//{field: 'infoid',title: 'infoid',hidden : true,rowspan : 2},
                   {field: 'riskassessment', title: '风险评估', halign: 'center', width: 60,align: 'center',rowspan :2},
                   {field: 'departname', title: '业务科室', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'partsname', title: '零件名称', halign: 'center', width: 80,align: 'center',rowspan :2},
                   {field: 'suppliername', title: '供应商名称', halign: 'center', width: 180,align: 'center',rowspan :2},
                   {field: 'isnewtype', title: '是否四新', halign: 'center', width: 60,align: 'center',rowspan :2,
	                	   styler: function(value,row,index){
								if (value=="1"){
									return 'color:red;';
								}
							},
	     			    	formatter: function(value,row,index){
	     						if (value == "1"){
	     							return "Y";
	     						}else{
	     							return "N";
	     						}
	     					}}, 
                   {field: 'isnewfactory', title: '新建厂', halign: 'center', width: 60,align: 'center',rowspan :2,
 						styler: function(value,row,index){
							if (value=="1"){
								return 'color:red;';
							}
						},			
	   			    	formatter: function(value,row,index){
	   						if (value == "1"){
	   							return "Y";
	   						}else{
	   							return "N";
	   						}
	   					}},
                  {field: 'isonemore', title: '一品多点', halign: 'center', width: 60,align: 'center',rowspan :2,
	   						styler: function(value,row,index){
								if (value=="1"){
									return 'color:red;';
								}
							},	
	                	formatter: function(value,row,index){
		       				if (value == "1"){
		    					return "Y";
		    				}else{
		    					return "N";
		    				}
		    			    }},
                   
                   {field: 'ordercycle', title: '原材料<br>长周期', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'powerpz', title: '动力配置', halign: 'center', width: 130,align: 'center',rowspan :2},
                  // {field: 'sgmw', title: 'SGMW<br>设定配比', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'target', title: '产能目标<br>（台套）', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'processname', title: '工序（瓶颈或<br>最小产能）', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'designtakt',title: '设计节拍', halign: 'center', align: 'center',width:100,rowspan :2},
                   {field: 'actualbeat',title: '实际节拍', halign: 'center', align: 'center',width:100,rowspan :2},
                   {field: 'designproduction', title: '设计产能', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'actualproduction', title: '实际产能', halign: 'center', width: 100,align: 'center',rowspan :2},
                   {field: 'shejicnqk', title: '设计产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2}, //new
                   {field: 'shijicnqk', title: '实际产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2},//new
                   { field: 'promotionproject', title: '产能提升措施', halign: 'center', width: 120, align: 'center' ,rowspan :2},
                   { field: 'finalvalue', title: '提升后瓶颈<br>工序产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
                   { field: 'tsgxhlj', title: '提升后该零<br>件产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
                   { field: 'plantime', title: '初始计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2},
                   { field: 'currenttime', title: '当前计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
                   { field: 'currentprogress', title: '当前进展', halign: 'center', width: 120, align: 'center' ,rowspan :2},
                   {field: '', title: '项目负责团队', halign: 'center', width: 100,align: 'center',colspan: 4}, 
                   ],
			          	[
			          	 { field: 'buyer', title: '采购', halign: 'center', width: 80, align: 'center' },
	                     { field: 'plannername', title: '计划', halign: 'center', width: 80, align: 'center' },
	                     { field: 'sqe', title: 'SQE', halign: 'center', width: 80, align: 'center' },
	                     { field: 'purchasername', title: '平台', halign: 'center', width: 80, align: 'center' },
			          	 ]],
			          	onLoadSuccess:function(data){	
							$('#targetData').datagrid('tooltip', [ 'powerpz']);
							for(var i=0;i<data.rows.length;i++){
								var partsname = data.rows[i].partsname
								var suppliername = data.rows[i].suppliername
								var processname = data.rows[i].processname
								var actualbeat = data.rows[i].actualbeat
								var designtakt = data.rows[i].designtakt
								var designproduction = data.rows[i].designproduction
								var actualproduction = data.rows[i].actualproduction
								var shejicnqk = data.rows[i].shejicnqk
								var shijicnqk = data.rows[i].shijicnqk
								if(i+1==data.rows.length){
									partsname1 ="";
									suppliername1="";
									processname1="";
								}else{
									 var partsname1 =data.rows[i+1].partsname
									 var suppliername1= data.rows[i+1].suppliername
									 var processname1= data.rows[i+1].processname
									 var actualbeat1 = data.rows[i+1].actualbeat
									 var designtakt1 = data.rows[i+1].designtakt
									 var designproduction1 = data.rows[i+1].designproduction
									 var actualproduction1 = data.rows[i+1].actualproduction
									 var shejicnqk1 = data.rows[i+1].shejicnqk
									 var shijicnqk1 = data.rows[i+1].shijicnqk
									 
								}
									 if(partsname1==partsname&&suppliername1==suppliername){
										 hebingrow++; 		
									 }else{
										 start =i-hebingrow
										 end =hebingrow+1
//										 $("#dangerShow").datagrid({
//											 rowStyler:function(index,row){
//							
//											 }
//										 })
								
										//合并行
											$("#targetData").datagrid("mergeCells",{
												index:start,
												field:"partsname",
												rowspan:end,
											})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"riskassessment",
											rowspan:end,
										})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"departname",
											rowspan:end,
										})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"suppliername",
											rowspan:end,
										})
											$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"isnewtype",
											rowspan:end,
										})
											$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"isnewfactory",
											rowspan:end,
										})
											$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"isonemore",
											rowspan:end,
										})
											$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"islong",
											rowspan:end,
										})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"powerpz",
											rowspan:end,
										})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"sgmw",
											rowspan:end,
										})

										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"sqe",
											rowspan:end,
										})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"buyer",
											rowspan:end,
										})
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"purchasername",
											rowspan:end,
										})
											$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"plannername",
											rowspan:end,
										})
											$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"target",
											rowspan:end,
										})
										if(designtakt ==designtakt1){
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"designtakt",
											rowspan:end,
										})
									 }
										if( actualbeat == actualbeat1){
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"actualbeat",
											rowspan:end,
										})
									 }
										if(designproduction==designproduction1){
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"designproduction",
											rowspan:end,
										})
										}
										if(actualproduction==actualproduction1){
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"actualproduction",
											rowspan:end,
										})
										}
										if(shejicnqk==shejicnqk1){
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"shejicnqk",
											rowspan:end,
										})
										}
										if(shijicnqk==shijicnqk1){
										$("#targetData").datagrid("mergeCells",{
										index:start,
										field:"shijicnqk",
											rowspan:end,
										})
										}
										start =0;
										hebingrow=0;
										 end =0;
									 }
									 
									 if(partsname1 == partsname && suppliername1 == suppliername && processname1 ==processname){
										 count++
									 } else{
										 pstart = i-count
										 pend =count+1
											$("#targetData").datagrid("mergeCells",{
												index:pstart,
												field:"processname",
													rowspan:pend,
												})
												count=0;
												pstart=0;
												pend=0;
									 }
									if(i+1==data.rows.length){
										hebingrow=0;
										end =0;
									}
									
							}
						
						},
	})	
	});

function Ment(){
	
	 add_edit = $('#add_edit').dialog({
	        closed: true,
	        modal: true,
	        top: 5,
	        collapsible: false,
	        minimizable: false,
	        maximizable: false,
	       // height:totalHeight,
	     
	    });
	    add_edit_form = add_edit.find('form');
	    $('#suppid').combobox({
			url : virpath + 'Comm/GetSupplierCodeList/',
			valueField : 'key',
			textField : 'value',
			panelHeight : 200,
			onSelect: function(record){
				if(record) {	
						$('#suppname').combobox("select",record.key.split('&')[1]);
				}
			},
		});
		//加载供应商名称	
		$('#suppname').combobox({
	        	url : virpath + 'Comm/GetSupplierCodeListAll/',
	            valueField : 'key',
	            textField : 'value',
	            panelHeight : 200,
	            onSelect:function(record){
	            	  $('#suppid').combobox("select",record.key);
	            }
	        });  
		//零件下拉（一览查询用）
		$('#arrname').combobox({
		url : virpath + "/cninfoviewWh/GetPartsname2List",
		valueField : 'value',
		textField : 'value',
		panelHeight : 150,
		editable: true,
		limitToList:true,
		onSelect:function(record){
      	  $('#arrid').combobox("select",record.key);
      }
	});
		//零件下拉（一览查询用）
		$('#arrid').combobox({
		url : virpath + "/cninfoviewWh/GetPartscodeList",
		valueField : 'key',
		textField : 'key',
		panelHeight : 150,
		editable: true,
		limitToList:true,
		onSelect:function(record){
			 $('#arrname').combobox("select",record.value);
      }
	});
	//业务科室
	$("#office").combobox({
		editable : false,
		url : virpath + 'cnsysParts/GetDepCombo',
		valueField : 'value',
		textField : 'value',
		panelHeight : 180
	});
	
	//动力配置
	$('#power').combobox({
		editable : false,
		//url : virpath + "/cninfoview/getPowerList",
		valueField : "key",
		textField : "value",
		panelHeight : 180,
	});
	//车型
	$("#cartypename").combobox({
		url:virpath+'cnd01/getcartype1',
		valueField : 'key',
		textField : 'value',
		panelHeight : 200,
		editable:true,
		required:true,
		onLoadSuccess:function(){
			if(jiaocha==false){
			var cartypenamea = $('#cartypename').combobox('getData');
			 $('#cartypename').combobox('select',cartypenamea[0].key);
			 if(cartypenameY==null||cartypenameY==""){
					 Search(flg);
				 }
			 }
		},
		onSelect : function(rec) {
			//动力配置
			$('#power').combobox({
				url : virpath + "/cninfoview/getPowerList?cartype="+rec.value,
			});
		}
	

		
	});
	
	//项目关键信息
	$('#xmxx').combobox({
    	data: [{
            key: '0',
            value: '产能提升计划一览'
        },{
            key: '1',
            value: '风险件清单'
        },{
            key: '2',
            value: '新建厂进度'
        },{
            key: '3',
            value: '一品多点开发进度'
        },{
            key: '4',
            value: '长周期'
        },{
            key: '5',
            value: '供应商零件交叉一览'
        },{
            key: '6',
            value: '总项目清单'
        }],
		editable : false,
		valueField : 'key',
		textField : 'value',
		panelHeight :'auto',
		multiple : false,
		onSelect : function(rec) {
			if(rec.value=='风险件清单'){
				$('#xmxx').combobox('setText','1');
				jiaocha=false;
			}else if(rec.value=='新建厂进度'){
				$('#xmxx').combobox('setText','2');
				jiaocha=false;
			}else if(rec.value=='一品多点开发进度'){
				$('#xmxx').combobox('setText','3');
				jiaocha=false;
			}else if(rec.value=='长周期'){
				$('#xmxx').combobox('setText','4');
				jiaocha=false;
			}else if(rec.value=='产能提升计划一览'){
				$('#xmxx').combobox('setText','0');
				jiaocha=false;
			}else if(rec.value=='总项目清单'){
				$('#xmxx').combobox('setText','6');
				//车型
				$("#cartypename").combobox({
					url:virpath+'cnd01/getcartype1',
					valueField : 'key',
					textField : 'value',
					panelHeight : 200,
					editable:true,
					required:false,
					onSelect : function(rec) {
						$('#power').combobox({
							url : virpath + "/cninfoview/getPowerList?cartype="+rec.value,
						});
					}
				});
				
				jiaocha = true;
			}else if(rec.value=='供应商零件交叉一览'){
				$('#xmxx').combobox('setText','5');
				//车型
				$("#cartypename").combobox({
					url:virpath+'cnd01/getcartype1',
					valueField : 'key',
					textField : 'value',
					panelHeight : 200,
					editable:true,
					required:false,
					onSelect : function(rec) {
						$('#power').combobox({
							url : virpath + "/cninfoview/getPowerList?cartype="+rec.value,
						});
					}
				});
				
				jiaocha = true;
			}
		}
	});
	
	var totalHeight = 490;
	var totalWidth = ($(window).width()) * 0.88;
	win2 = $('#showGrid').dialog({
		closed: true,
		collapsible: false,
        minimizable: false,
        maximizable: true,
		width : totalWidth,
		height : totalHeight,
		modal : true,
		shadow : false,
		resizable:true,
		title : '风险零件分析一览'
	});
	
	winmn = $('#showMnGrid').dialog({
		closed: true,
		collapsible: false,
        minimizable: false,
        maximizable: true,
		width : totalWidth,
		height : totalHeight,
		modal : true,
		shadow : false,
		resizable:true,
		title : '产品提升计划一览——模拟'
	});
	
	winmn2 = $('#showMn2Grid').dialog({
		closed: true,
		collapsible: false,
        minimizable: false,
        maximizable: true,
		width : totalWidth,
		height : totalHeight,
		modal : true,
		shadow : false,
		resizable:true,
		title : '风险件清单一览——模拟'
	});
	winCpt = $('#showCpt').dialog({
		closed: true,
		collapsible: false,
        minimizable: false,
        maximizable: true,
		width : totalWidth,
		height : totalHeight,
		modal : true,
		shadow : false,
		resizable:true,
		title : '新建工厂信息一览'
	});
	showY = $('#showY').dialog({
		closed: true,
		collapsible: false,
        minimizable: false,
        maximizable: true,
		width : totalWidth,
		height : totalHeight,
		modal : true,
		shadow : false,
		resizable:true,
		title : '开发信息清单'
	});
}
//计算两个日期之间相差的月份
function getMonths(date1 , date2){
    //用-分成数组
    date1 = date1.substring(0,7).split("-");
    date2 = date2.substring(0,7).split("-");
    //获取年,月数
    var year1 = parseInt(date1[0]) , 
        month1 = parseInt(date1[1]) , 
        year2 = parseInt(date2[0]) , 
        month2 = parseInt(date2[1]) , 
        //通过年,月差计算月份差
        months = (year2 - year1) * 12 + (month2-month1);
    return months;    
}
//查询
function Search(flg){
	shijian = false;
	$('#south').hide();
	$('#newMn').hide();
	 suppid = $('#suppid').combobox('getText');//供应商代码
	 suppname = $('#suppname').combobox('getText');//供应商名称
	 arrid = $('#arrid').combobox('getText');//零件号
	 arrname = $('#arrname').combobox('getText');//零件名称
	 cartypename = $('#cartypename').combobox('getText');
	 targetidwh =  $('#cartypename').combobox('getValue');
	if(jiaocha==false){
		if(!cartypename){
			$.messager.alert('温馨提示', '请选择车型！', 'info');
			return;
		}
	}
	 power = $('#power').combobox('getValue');//动力配置
	 office = $('#office').combobox('getValue');//业务科室
	 startTime = $('#startTime').datebox('getValue');//sop开始时间
	 endTime = $('#endTime').datebox('getValue');//sop结束时间
	 if((endTime==""&&startTime!="")||(startTime==""&&endTime!="")){
		 $.messager.alert("提示","请输入产能查询时间段。","info")
		 return;
	 }
	 num = getMonths(startTime,endTime);
	 
	 if(startTime!=""){
			year = startTime.substring(0,4);
		}
	var xmgjxx =$('#xmxx').combobox('getValue');
	if(xmgjxx!="" && flg!='true'){
	creatGrid(xmgjxx);
	if(shijian == true){
		return;
	}
	$('#south').hide();
	$('#three').hide();
	$('#dang').show();
		if(xmgjxx==1){		
			$(".inmaincon_con").css("height","620px");
			$("#cc").css("height","620px");
			var  hebingrow=0; 
			var  count=0; 
			var start;
			var end;
			var pend;
			var pstart;
			$("#dangerShow").datagrid({
				url:virpath + 'cninfoview/getdangerShowInfo',
				onLoadSuccess:function(data){	
					$('#dangerShow').datagrid('tooltip', [ 'powerpz']);
					for(var i=0;i<data.rows.length;i++){
						var partsname = data.rows[i].partsname
						var suppliername = data.rows[i].suppliername
						var processname = data.rows[i].processname
						var actualbeat = data.rows[i].actualbeat
						var designtakt = data.rows[i].designtakt
						var designproduction = data.rows[i].designproduction
						var actualproduction = data.rows[i].actualproduction
						var shejicnqk = data.rows[i].shejicnqk
						var shijicnqk = data.rows[i].shijicnqk
						if(i+1==data.rows.length){
							partsname1 ="";
							suppliername1="";
							processname1="";
						}else{
							 var partsname1 =data.rows[i+1].partsname
							 var suppliername1= data.rows[i+1].suppliername
							 var processname1= data.rows[i+1].processname
							 var actualbeat1 = data.rows[i+1].actualbeat
							 var designtakt1 = data.rows[i+1].designtakt
							 var designproduction1 = data.rows[i+1].designproduction
							 var actualproduction1 = data.rows[i+1].actualproduction
							 var shejicnqk1 = data.rows[i+1].shejicnqk
							 var shijicnqk1 = data.rows[i+1].shijicnqk
							 
						}
							 if(partsname1==partsname&&suppliername1==suppliername){
								 hebingrow++; 		
							 }else{
								 start =i-hebingrow
								 end =hebingrow+1
//								 $("#dangerShow").datagrid({
//									 rowStyler:function(index,row){
//					
//									 }
//								 })
						
						
								//合并行
									$("#dangerShow").datagrid("mergeCells",{
										index:start,
										field:"partsname",
										rowspan:end,
									})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"riskassessment",
									rowspan:end,
								})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"departname",
									rowspan:end,
								})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"suppliername",
									rowspan:end,
								})
									$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"isnewtype",
									rowspan:end,
								})
									$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"isnewfactory",
									rowspan:end,
								})
									$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"isonemore",
									rowspan:end,
								})
									$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"islong",
									rowspan:end,
								})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"powerpz",
									rowspan:end,
								})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"sgmw",
									rowspan:end,
								})

								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"sqe",
									rowspan:end,
								})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"buyer",
									rowspan:end,
								})
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"purchasername",
									rowspan:end,
								})
									$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"plannername",
									rowspan:end,
								})
									$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"target",
									rowspan:end,
								})
								if(designtakt ==designtakt1){
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"designtakt",
									rowspan:end,
								})
							 }
								if( actualbeat == actualbeat1){
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"actualbeat",
									rowspan:end,
								})
							 }
								if(designproduction==designproduction1){
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"designproduction",
									rowspan:end,
								})
								}
								if(actualproduction==actualproduction1){
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"actualproduction",
									rowspan:end,
								})
								}
								if(shejicnqk==shejicnqk1){
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"shejicnqk",
									rowspan:end,
								})
								}
								if(shijicnqk==shijicnqk1){
								$("#dangerShow").datagrid("mergeCells",{
								index:start,
								field:"shijicnqk",
									rowspan:end,
								})
								}
								start =0;
								hebingrow=0;
								 end =0;
							 }
							 
							 if(partsname1 == partsname && suppliername1 == suppliername && processname1 ==processname){
								 count++
							 } else{
								 pstart = i-count
								 pend =count+1
									$("#dangerShow").datagrid("mergeCells",{
										index:pstart,
										field:"processname",
											rowspan:pend,
										})
										count=0;
										pstart=0;
										pend=0;
							 }
							if(i+1==data.rows.length){
								hebingrow=0;
								end =0;
							}
							
					}
				
				},
			})
			
		}else if(xmgjxx==2){
			$(".inmaincon_con").css("height","620px");
			$("#cc").css("height","620px");
			$("#dangerShow").datagrid({
				url:virpath + 'cninfoview/getNewFactory',
				onLoadSuccess:function(){
					$('#dangerShow').datagrid('tooltip', [ 'powerpz']);
				},
			})
		}
		else if(xmgjxx==3){
			$(".inmaincon_con").css("height","620px");
			$("#cc").css("height","620px");
			$("#dangerShow").datagrid({
				url:virpath + 'cninfoview/getOnMore',
				onLoadSuccess:function(){
					$('#dangerShow').datagrid('tooltip', [ 'powerpz']);
				},
			})
		}
		else if(xmgjxx==4){
			$(".inmaincon_con").css("height","620px");
			$("#cc").css("height","620px");
			$("#dangerShow").datagrid({
				url:virpath + 'cninfoview/getLongInfo',
				onLoadSuccess:function(){
					$('#dangerShow').datagrid('tooltip', [ 'powerpz']);
				},
			})
			
		}else if(xmgjxx==0){
			$("#dangerShow").datagrid("options").url=virpath +  "cnd01p/getData";
			$("#dangerShow").datagrid("load",{
				suppid:suppid, 
				suppname:suppname, 
				arrid:arrid, 
				arrname:arrname, 
				cartypename:cartypename, 
				power:power, 
				office:office, 
				startTime:startTime, 
				endTime:endTime, 
			})
			$("#dangerShow").datagrid("reload");
		}else if(xmgjxx==6){
			var powername = $('#power').combobox('getText');//动力配置
			var reg = new RegExp( ',' , "g" )
			powername = powername.replace( reg , '-' );
			$("#dangerShow").datagrid("options").url=virpath + "/cninfoview/getCninfo";
			$("#dangerShow").datagrid("load",{
				supplierCode1:suppid, 
				supplierName1:suppname, 
				partsCode1:arrid, 
				partsName1:arrname, 
				cartypename:cartypename, 
				power1:powername, 
				office1:office, 
				startTime:startTime, 
				endTime:endTime, 
			})
			$("#dangerShow").datagrid("reload");
		}else if(xmgjxx==5){ 
			ProcessStart();
			$.ajax({
			url:virpath + 'cninfoview/getdangerShowInfo5',
			type:'post',
			data:{
				suppid:suppid, 
				suppname:suppname, 
				arrid:arrid, 
				arrname:arrname, 
				cartypename:cartypename, 
				power:power, 
				office:office, 
				startTime:startTime, 
				endTime:endTime, 
				num:num
			},
			error:function(){
				Msgalert('错误','列获取失败','error');
			},
			success: function(result){
				ProcessEnd();
				var data = eval('('+result+')');
				var str = data.Strjosn;// 获取数据
				if(str==""){
				// $('#planData').datagrid('loadData', { total: 0, rows: [] });
				} else {
				if(data.success && str!="") {
					$('#dangerShow').datagrid({
						data:$.parseJSON(str),
					})
				}
				}
			}
		});
	}
	}else{
		//
		$(".inmaincon_con").css("height","980px");
		$("#cc").css("height","980px");
		if(flg=='true'){
		$('#south').hide();
		$('#three').hide();
		$('#dang').hide();
		$('#newMn').show();
		if(zhuti=='bootstrap'){
			  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx2a.frm&suppid='+suppid+'&year='+year
			  +'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename
			  +'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&flg='+flg;
		  }else{
			  var reportUrl = virpath + '/ReportServer?formlet=cnfxfxa.frm&suppid='+suppid+'&year='+year
			  +'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename
			  +'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&flg='+flg;
		  }
		$('#newCptmn').attr('src', reportUrl);
	}else{
		$('#newMn').hide();
		$('#dang').hide();
		$('#south').show();
		$('#three').show();
		if(zhuti=='bootstrap'){
			  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx2.frm&suppid='+suppid+'&year='+year
			  +'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename
			  +'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&flg='+flg;
		  }else{
			  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx.frm&suppid='+suppid+'&year='+year
			  +'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename
			  +'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&flg='+flg;
		  }
		$('#cpt').attr('src', reportUrl);
		
	}
	}
	$("#cc").layout('collapse','north');
}
//指定年月的最后一天
function getLastDay(year, month){  
    var dt = new Date(year, month - 1, '01');  
    dt.setDate(1);  
    dt.setMonth(dt.getMonth() + 1);  
    cdt = new Date(dt.getTime()-1000*60*60*24);  
    return cdt.getDate();
}
//打开弹框
function getDetail(time) {
	if(time!=""){
		if(time.indexOf("&") >0 ){
			var str = time.split("&")[0];
			keshi = str;//将点击的科室赋值给导出
			keflg = "keshi";//表明是点击的科室，否则表明点击的是月份
			if(str==" "){
				 $.messager.alert('温馨提示', '请选择有业务科室的图标', 'info');
			       return;
			}
			win2.dialog('open');
			var  now= new Date();
			var year = now.getFullYear();
			var month = ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1);
			var date = getLastDay(year,month);
			$('#targetData').datagrid({
				url:virpath + 'cninfoview/getdangerShowInfo',
				queryParams:{
					suppid:suppid, 
					suppname:suppname, 
					arrid:arrid, 
					arrname:arrname, 
					cartypename:cartypename, 
					power:power, 
					office:str, 
					startTime: startTime,
					endTime:endTime, 
				}
			});
		}else if(time.indexOf(";") >0 ){
			win2.dialog('open');
			var name = time.split(";")[1];
		    time = time.split(";")[0];
		   /* var date = 	getLastDay(time.split("-")[0],time.split("-")[1]);
		    date = time+'-'+date;*/
			$('#targetData').datagrid({
				url:virpath + 'cninfoview/getdangerShowInfo',
				queryParams:{
					suppid:suppid, 
					suppname:suppname, 
					arrid:arrid, 
					arrname:arrname, 
					cartypename:cartypename, 
					power:power, 
					office:office, 
					time:time, 
					name:name,
				}
			});
		}else{
			win2.dialog('open');
			keshi = time;
			keflg = "yuefen"
			var date = 	getLastDay(time.split("-")[0],time.split("-")[1]);
			$('#targetData').datagrid({
				url:virpath + 'cninfoview/getdangerShowInfo',
				queryParams:{
					suppid:suppid, 
					suppname:suppname, 
					arrid:arrid, 
					arrname:arrname, 
					cartypename:cartypename, 
					power:power, 
					office:office, 
					startTime:time, 
					endTime:time, 
				}
			});}
  }
}
//重置查询条件
function ResetSearch(){
	$('#sch').form('clear');
}
//产能模拟
function Simulation(){
	var cartypename = $('#cartypename').combobox('getText');
	if(!cartypename){
		 $.messager.alert('温馨提示', '请选择车型！', 'info');
	       return;
	}
	//var sopdate = $('#startTime').datebox('getValue');
	add_edit.dialog('open');
	add_edit.dialog('setTitle','产能模拟信息');
	var targetid;
	
	$.ajax({
		url:virpath+'cnd01p/getcnd01pTargetDetail?cartypename='+cartypename,
		type:'post',
		error:function(){
			Msgalert('错误','列获取失败','error');
		},
		success: function(result){
			var data = eval('('+result+')');
			var str = data.Strjosn;//获取数据
			var fd = eval(data.Frozcolumns);//画表结构
			targetid = data.targetid;
			if(data.success){
				$("#grid1").datagrid({
					data:$.parseJSON(str),
					pageSize : 10,
			        methord : 'post',
			        pagination: false,
			        rownumbers: true,
			        singleSelect: true,
			        striped : true,
			        fit:true,
					columns:fd,
					onLoadSuccess: function(data){
							$.ajax({
			     				url:virpath+'cnd01p/getplanData?targetid='+targetid,
			     				type:'post',
			     				error:function(){
			     					Msgalert('错误','列获取失败','error');
			     				},
			     				success: function(result){
			     					var data = eval('('+result+')');
			     					var str = data.Strjosn;//获取数据
			     					var fd = eval(data.Frozcolumns);//画表结构
			     					Max = data.Max;
			     					if(data.success){
			     			       $('#grid2').datagrid({
			     							data:$.parseJSON(str),
			     							pageSize : 10,
			     					        methord : 'post',
			     					        pagination: false,
			     					        rownumbers: true,
			     					        singleSelect: true,
			     					        striped : true,
			     					        fit:true,
			     							columns:fd,
										    onClickCell:function(index,field,value){
								        	    var a = $('#grid2').datagrid('validateRow', num2)
									       		if(!a){
									       			 $.messager.alert('温馨提示', '上一行有必填项还有填写！', 'info');
									       		       return;
									       		}else{
										       		 $(this).datagrid('endEdit', num2);
										       		 $(this).datagrid('beginEdit', index);
										        	 num2 = index;
									       		}
								            }
			     						})
			     					}
			     				}
			     			});
						}
				})
			}
		}
	});
}
//产能模拟保存
function SaveS(){

	$('#grid2').datagrid('endEdit', num2);
	var sopdate =  $("#startTime").datebox('getValue');//sop日期
	var rows = $('#grid2').datagrid('getRows');
	var td = "";
	var sopsum="";
	for(var j = 0;j<rows.length;j++){
		var targetid = rows[j].targetid;//产能目标ID
		var detailid=rows[j].detailid;//产能明细ID	
		td+=targetid+","+detailid+"&";
		var sop ="";
		if(Max==""){
			for(var i=-6;i<=12;i++){
				if(i<0){
					sop+='SOP'+i+'&'+rows[j]['sopm'+Math.abs(i)+'value']+',';
				}else if(i==0){
					sop+='SOP+0&'+rows[j]['sopvalue']+',';
				}else{
					sop+='SOP+'+i+'&'+rows[j]['sopp'+i+'value']+',';
				}
			}
		}else{
			for(var i=-6;i<=Max;i++){
				if(i<0){
					sop+='SOP'+i+'&'+rows[j]['sopm'+Math.abs(i)+'value']+',';
				}else if(i==0){
					sop+='SOP+0&'+rows[j]['sopvalue']+',';
				}else{
					sop+='SOP+'+i+'&'+rows[j]['sopp'+i+'value']+',';
				}
			}
		} 
		sopsum+=sop+"@";
	}
	
	
	/*if(rows.length>1){
		 $.messager.alert('温馨提示', '请选中一行数据进行保存！', 'info');
	       return;
	}*/
	ProcessStart();
	add_edit_form.form('submit',{
		url:virpath+'cnd01p/addCNMB0102p',
		onSubmit:function(param){
			param.planid = rows.planid;
			param.sopdate = sopdate;
			param.td = td;
			param.sop = sopsum;
			//return $(this).form('validate');
		},
		success:function(result){
			ProcessEnd();
			var result = eval('('+result+')');
			if(result.success){
				$.messager.show({
					title:'成功',
					msg:result.msg,
					timeout:2000
				});
				
		    Search('true');
		    Closeck();
			}else{
				$.messager.alert('警告',result.msg,'warning')
			}
		}
	})
}
function creatGrid(i){

	if(showFlag){
		$('#dangerShow').datagrid('loadData', { total: 0, rows: [] });
		$('#dangerShow').datagrid({  
			url:"",
            columns:[[]],  
            rownumbers:false,  
            pagination:false,
            fitColumns:false,
            fit:false,
            width:0,
            height:0,
        });  
	
	}
	if(i==1){
		showFlag=true;
		//展示风险件清单
		$("#dangerShow").datagrid({
			  title:'风险件清单',
	          pageSize : 30,
	          methord : 'post',
	          striped:true,
	          fit:true,	
	          queryParams:{
	        	suppid:suppid, 
	       		  suppname:suppname, 
	       		  arrid:arrid, 
	       		  cartypename:cartypename, 
	       		  power:power, 
	       		  office:office, 
	       		  startTime:startTime, 
	       		  endTime:endTime, 
	       		  targetid:targetidwh,
	          },
	          onClickRow:function(rowIndex, rowData){
	        	  $(this).datagrid('unselectRow', rowIndex);
	          },
	          onLoadSuccess: function(){
					$(this).datagrid('freezeRow',0);
				},
	          columns: [[
                         {field: 'infoid',title: 'infoid',hidden : true,rowspan : 2},
	                     {field: 'riskassessment', title: '风险评估', halign: 'center', width: 60,align: 'center',rowspan :2},
	                     {field: 'departname', title: '业务科室', halign: 'center', width: 100,align: 'center',rowspan :2},
	                     {field: 'partsname', title: '零件名称', halign: 'center', width: 180,align: 'center',rowspan :2},
	                     {field: 'suppliername', title: '供应商名称', halign: 'center', width: 180,align: 'center',rowspan :2},
	                     {field: 'isnewtype', title: '是否四新', halign: 'center', width: 60,align: 'center',rowspan :2,
	                    	 styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
		     			    	formatter: function(value,row,index){
		     			    		debugger
								if(value == "0"){
										return "N";
									}else{
										return value;
									}
								}}, 
	                     {field: 'isnewfactory', title: '新建厂', halign: 'center', width: 60,align: 'center',rowspan :2,
		     						styler: function(value,row,index){
										if (value=="1"){
											return 'color:red;';
										}
									},	
	     			    	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                    {field: 'isonemore', title: '一品多点', halign: 'center', width: 60,align: 'center',rowspan :2,
	     						styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
	 	                	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                     {field: 'islong', title: '原材料<br>长周期', halign: 'center', width: 100,align: 'center',rowspan :2,
	 		    			    	styler: function(value,row,index){
										if (value=="1"){
											return 'color:red;';
										}
									},	
	 		    			    	formatter: function(value){
	 									if (value == "1"){
	 										return "Y";
	 									}else if(value == "0"){
	 										return "N";
	 									}else{
	 										return "";
	 									}
	 								}},
	                     {field: 'powerpz', title: '动力配置', halign: 'center', width: 130,align: 'center',rowspan :2},
	                   //  {field: 'sgmw', title: 'SGMW<br>设定配比', halign: 'center', width: 100,align: 'center',rowspan :2},
	                     {field: 'target', title: '产能目标<br>（台套）', halign: 'center', width: 100,align: 'center',rowspan :2},
	                     {field: 'processname', title: '工序（瓶颈或<br>最小产能）', halign: 'center', width: 100,align: 'center',rowspan :2},
	                     {field: 'designtakt',title: '设计节拍', halign: 'center', align: 'center',width:100,rowspan :2},
	                     {field: 'actualbeat',title: '实际节拍', halign: 'center', align: 'center',width:100,rowspan :2},
	                     {field: 'designproduction', title: '设计产能', halign: 'center', width: 100,align: 'center',rowspan :2},
	                     {field: 'actualproduction', title: '实际产能', halign: 'center', width: 100,align: 'center',rowspan :2},
	                     {field: 'shejicnqk', title: '设计产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2}, //new
	                     {field: 'shijicnqk', title: '实际产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2},//new
	                     { field: 'promotionproject', title: '产能提升措施', halign: 'center', width: 120, align: 'center' ,rowspan :2},
	                     { field: 'finalvalue', title: '提升后瓶颈<br>工序产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
	                     { field: 'tsgxhlj', title: '提升后该零<br>件产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
	                     { field: 'plantime', title: '初始计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2},
	                     { field: 'currenttime', title: '当前计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
	                     { field: 'currentprogress', title: '当前进展', halign: 'center', width: 120, align: 'center' ,rowspan :2},
	                     {field: '', title: '项目负责团队', halign: 'center', width: 100,align: 'center',colspan: 4}, 
	                     ],
				          	[
				          	 { field: 'buyer', title: '采购', halign: 'center', width: 80, align: 'center' },
		                     { field: 'plannername', title: '计划', halign: 'center', width: 80, align: 'center' },
		                     { field: 'sqe', title: 'SQE', halign: 'center', width: 80, align: 'center' },
		                     { field: 'purchasername', title: '平台', halign: 'center', width: 80, align: 'center' },
				          	 ]],
				     
	             toolbar:[{
	            	 text:'导出',
	              	  iconCls: 'icon-xls',
	            		handler: exportDangerShow,
	                }],
	                onDblClickCell:showgY
		})
	}else if(i==5){
		shijian = false;
		if((endTime=="" || startTime=="")){
			shijian = true;
			 $.messager.alert("提示","请输入产能查询时间段。","info")
			 return;
		 }else{
			 if(endTime<startTime){
				 shijian = true;
				 $.messager.alert('提示', '结束时间要大于开始时间！', 'warning');
			        return;
			}
		 }
		columnxm.length = 0;
		columnxm2.length = 0;
		columnxm3.length = 0;
		columnxm.push({field: 'infoid',title: 'infoid',hidden : true,rowspan : 2});
		columnxm.push({field: 'riskassessment', title: '风险评估', halign: 'center', width: 60,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'departname', title: '业务科室', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'partsname', title: '零件名称', halign: 'center', width: 80,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'suppliername', title: '供应商名称', halign: 'center', width: 180,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'isnewtype', title: '是否四新', halign: 'center', width: 60,align: 'center',rowspan :2,
			styler: function(value,row,index){
				if (value=="1"){
					return 'color:red;';
				}
			},	
		    	formatter: function(value,row,index){
					if (value == "1"){
						return "Y";
					}else{
						return "N";
					}
					
				}}); 
		columnxm.push({field: 'isnewfactory', title: '新建厂', halign: 'center', width: 60,align: 'center',rowspan :2,
			styler: function(value,row,index){
				if (value=="1"){
					return 'color:red;';
				}
			},	
    	formatter: function(value,row,index){
			if (value == "1"){
				return "Y";
			}else{
				return "N";
			}
			
		}});
		columnxm.push({field: 'isonemore', title: '一品多点', halign: 'center', width: 60,align: 'center',rowspan :2,
			styler: function(value,row,index){
				if (value=="1"){
					return 'color:red;';
				}
			},	
        	formatter: function(value,row,index){
   				if (value == "1"){
					return "Y";
				}else{
					return "N";
				}
				
			    }});
		columnxm.push({field: 'ordercycle', title: '原材料<br>长周期', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'powerpz', title: '动力配置', halign: 'center', width: 130,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		/*columnxm.push({field: 'sgmw', title: 'SGMW<br>设定配比', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});*/
		columnxm.push({field: 'target', title: '产能目标<br>（台套）', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'processname', title: '工序（瓶颈或<br>最小产能）', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'designtakt',title: '设计节拍', halign: 'center', align: 'center',width:100,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'actualbeat',title: '实际节拍', halign: 'center', align: 'center',width:100,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'designproduction', title: '设计产能', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'actualproduction', title: '实际产能', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'shejicnqk', title: '设计产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({field: 'shijicnqk', title: '实际产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({ field: 'promotionproject', title: '产能提升措施', halign: 'center', width: 120, align: 'center' ,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({ field: 'finalvalue', title: '提升后瓶颈<br>工序产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({ field: 'tsgxhlj', title: '提升后该零<br>件产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({ field: 'plantime', title: '初始计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({ field: 'currenttime', title: '当前计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({ field: 'currentprogress', title: '当前进展', halign: 'center', width: 120, align: 'center' ,rowspan :2,
         	formatter: function(value,row,index){
   				if (value == 'null'){
					return "";
				}else{
					return value ;
				}}});
		columnxm.push({title: '项目负责团队', halign: 'center', align: 'center',colspan: 4}); 
		columnxm.push({title: '产能目标', halign: 'center',align: 'center',colspan: num+1}); 
		columnxm.push({title: '滚动计划', halign: 'center', align: 'center',colspan: num+1}); 
		columnxm.push({title: '最终达到的产能', halign: 'center', align: 'center',colspan: num+1}); 
		columnxm.push({title: '瓶颈工序', halign: 'center', align: 'center',colspan: num+1}); 
		
				columnxm2.push({ field: 'buyer', title: '采购', halign: 'center', width: 80, align: 'center',
		         	formatter: function(value,row,index){
		   				if (value == 'null'){
							return "";
						}else{
							return value ;
						}} });
				columnxm2.push({ field: 'plannername', title: '计划', halign: 'center', width: 80, align: 'center',
		         	formatter: function(value,row,index){
		   				if (value == 'null'){
							return "";
						}else{
							return value ;
						}} });
				columnxm2.push({ field: 'sqe', title: 'SQE', halign: 'center', width: 80, align: 'center',
		         	formatter: function(value,row,index){
		   				if (value == 'null'){
							return "";
						}else{
							return value ;
						}} });
				columnxm2.push({ field: 'purchasername', title: '平台', halign: 'center', width: 100, align: 'center',
		         	formatter: function(value,row,index){
		   				if (value == 'null'){
							return "";
						}else{
							return value ;
						}} });
				for(var i = 0;i<=num;i++){
					var date = new Date(startTime);
					date.setMonth(date.getMonth() + i);
					var sdate1 = date.toLocaleDateString();
					var sdate = sdate1.substring(0,sdate1.lastIndexOf("/"));
					columnxm2.push({ field: 'c'+sdate.replace('/','_'), title: sdate , halign: 'center', width: 80, align: 'center',
                     	formatter: function(value,row,index){
    		   				if (value == 'null'){
    							return "";
    						}else{
    							return value ;
    						}} });
				}
				for(var i = 0;i<=num;i++){
					var date = new Date(startTime);
					date.setMonth(date.getMonth() + i);
					var sdate1 = date.toLocaleDateString();
					var sdate = sdate1.substring(0,sdate1.lastIndexOf("/"));
					columnxm2.push({ field: 'g'+sdate.replace('/','_'), title: sdate , halign: 'center', width: 80, align: 'center',
                     	formatter: function(value,row,index){
    		   				if (value == 'null'){
    							return "";
    						}else{
    							return value ;
    						}} });
				}
				for(var i = 0;i<=num;i++){
					var date = new Date(startTime);
					date.setMonth(date.getMonth() + i);
					var sdate1 = date.toLocaleDateString();
					var sdate = sdate1.substring(0,sdate1.lastIndexOf("/"));
					columnxm2.push({ field: 'z'+sdate.replace('/','_'), title: sdate , halign: 'center', width: 80, align: 'center',
                     	formatter: function(value,row,index){
    		   				if (value == 'null'){
    							return "";
    						}else{
    							return value ;
    						}} });
				}
				for(var i = 0;i<=num;i++){
					var date = new Date(startTime);
					date.setMonth(date.getMonth() + i);
					var sdate1 = date.toLocaleDateString();
					var sdate = sdate1.substring(0,sdate1.lastIndexOf("/"));
					columnxm2.push({ field: 'p'+sdate.replace('/','_'), title: sdate , halign: 'center', width: 80, align: 'center',
                     	formatter: function(value,row,index){
    		   				if (value == 'null'){
    							return "";
    						}else{
    							return value ;
    						}} });
				}
				columnxm3=[columnxm,columnxm2];	
		showFlag=true;
		//展示交叉一览
		$("#dangerShow").datagrid({
			  title:'供应商零件交叉一览',
	          pageSize : 30,
	          methord : 'post',
	          pagination:true,
	          rownumbers: true,
	          fit:true,	
	          columns:[columnxm,columnxm2],
             toolbar:[{
            	 text:'导出',
              	  iconCls: 'icon-xls',
            		handler: exportCross,
                }],
            onDblClickCell:showgY,
            onLoadSuccess: function(){
            	$('#dangerShow').datagrid('tooltip', [ 'powerpz']);
            },
		})
		$("#dangerShow").datagrid("freezeRow","0");
		
	}else if(i==2){
		//新建厂进度
		showFlag=true;
		$("#dangerShow").datagrid({
			  title:'新建厂进度',
	          methord : 'post',
	          rownumbers: true,
	          fit:true,
	          pageSize : 10,
	          queryParams:{
	        		 suppid:suppid, 
	       		  suppname:suppname, 
	       		  arrid:arrid, 
	       		  arrname:arrname, 
	       		  cartypename:cartypename, 
	       		  power:power, 
	       		  office:office, 
	       		  startTime:startTime, 
	       		  endTime:endTime, 
	          },
	          onLoadSuccess: function(){
					$(this).datagrid('freezeRow',0);
				},
	          columns: [[
	                      {field: 'suppliername', title: '供应商名称', halign: 'center',align: 'center',width:170,},
	                      {field: 'partsname',title: '零件名称', halign: 'center', align: 'center',width:180},
	                      {field: 'cartypename',title: '车型', halign: 'center', align: 'center',width:100},
	                      {field: 'powerpz', title: '动力配置', halign: 'center',align: 'center',width:140},      
	                      { field: 'target',title: '产能目标', halign: 'center', align: 'center',width:120},
//	                      {field: 'designtakt',title: '设计节拍', halign: 'center', align: 'center',width:100},
//	                      {field: 'designproduction',title: '设计产能', halign: 'center', align: 'center',width:100},
//	                      {field: 'actualbeat',title: '实际节拍', halign: 'center', align: 'center',width:100},
//	                      {field: 'actualproduction', title: '实际产能',halign: 'center',align: 'center',width:130},
	                      {field: 'shejicnqk', title: '设计产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center'}, //new
	                      {field: 'shijicnqk', title: '实际产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center'},//new
	                      {field: 'approvaldate', title: '项目批准', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'siteconfirmdate', title: '厂址确定', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'workstartdate', title: '厂房开工', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'eiareplydate', title: '环境建设批复', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'buildingcompletedate', title: '厂房建设完成', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'epreplydate', title: '环保验收批复', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'firereplydate', title: '消防验收', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'factorycompletedate', title: '厂房竣工时间', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'equipmentdate', title: '设备到位时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'toolingdate', title: '工装到位时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'moulddate', title: '模具到位时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'gaugedate', title: '检具到位时间', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'otssampledate', title: 'OTS交样时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'isparts3c', title: '是否需要零件（3C）<br>(Y/N)', halign: 'center', align: 'center',width:100,
	                    	  styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
	                      	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                      {field: 'parts3cstart', title: '零件3C开始时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'parts3cend', title: '零件3C完成时间', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'otsacceptdate', title: 'OTS认可时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'iscar3c', title: '是否需要整车（3C）<br>(Y/N)', halign: 'center', align: 'center',width:100,
	                    	  styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
	                      	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                      {field: 'car3cstart', title: '整车3C开始时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'car3cend', title: '整车3C完成时间', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'ppapdate', title: 'PPAP', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'iscarnotice', title: '是否需要整车公告<br>(Y/N)', halign: 'center', align: 'center',width:100,
	                    	  styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
	                      	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                      {field: 'carnoticestart', title: '整车公告开始时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'carnoticeend', title: '整车公告完成时间', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'ptrdate', title: 'PTR', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'remark', title: '备注', halign: 'center', align: 'center',width:100,},
		                      ]],
		                      
			  toolbar:[{
					 text:'导出',
			   	  iconCls: 'icon-xls',
			 		handler: exportNewFactory
			  }]
		})
		$("#dangerShow").datagrid("freezeRow","0");
	}else if(i==3){
		showFlag=true;
		//一品多点开发进度
		$("#dangerShow").datagrid({
			  title:'一品多点开发进度',
	          methord : 'post',
	          pagination:true,
	          rownumbers: true,
	          fit:true,
	          pageSize : 10,
	          queryParams:{
	        		 suppid:suppid, 
	       		  suppname:suppname, 
	       		  arrid:arrid, 
	       		  arrname:arrname, 
	       		  cartypename:cartypename, 
	       		  power:power, 
	       		  office:office, 
	       		  startTime:startTime, 
	       		  endTime:endTime, 
	          },
	          onLoadSuccess: function(){
					$(this).datagrid('freezeRow',0);
				},
	          columns: [[
		                   {field: 'partsname',title: '零件名称', halign: 'center', align: 'center',width:180},  
		                   {field: 'cartypename',title: '车型', halign: 'center', align: 'center',width:100},
	                       {field: 'powerpz', title: '动力配置', halign: 'center',align: 'center',width:140},      
		                 //  {field: 'sgmw', title: 'SGMW<br>设定配比', halign: 'center', width: 100,align: 'center'},
	                       { field: 'target',title: '产能目标', halign: 'center', align: 'center',width:140},
	                      {field: 'suppliername', title: '供应商名称', halign: 'center',align: 'center',width:140},
                     		{field: 'designtakt',title: '设计节拍', halign: 'center', align: 'center',width:100},
	                     	{field: 'designproduction',title: '设计产能', halign: 'center', align: 'center',width:100},
	                     	{field: 'actualbeat',title: '实际节拍', halign: 'center', align: 'center',width:100},
	                      {field: 'actualproduction', title: '实际产能',halign: 'center',align: 'center',width:100},
	                      {field: 'shejicnqk', title: '设计产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center'}, //new
	                      {field: 'shijicnqk', title: '实际产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center'},//new
	                      {field: 'isparts3c', title: '是否需要零件(3C)<br>(Y/N)', halign: 'center', align: 'center',width:100,
	                    	  styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
		 	                	formatter: function(value,row,index){
									if (value == "1"){
										return "Y";
									}else if(value == "0"){
										return "N";
									}else{
										return "";
									}
								}},
	                      {field: 'parts3cstart', title: '零件3C<br>开始时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'parts3cend', title: '零件3C<br>完成时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'iscar3c', title: '是否需要整车（3C）<br>(Y/N)', halign: 'center', align: 'center',width:100,
	                    	  styler: function(value,row,index){
									if (value=="1"){
										return 'color:red;';
									}
								},	
	                      	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                      {field: 'car3cstart', title: '整车3C开始时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'car3cend', title: '整车3C完成时间', halign: 'center', align: 'center',width:130,formatter:formatDatebox},
	                      {field: 'iscarnotice', title: '是否需要整车公告<br>(Y/N)', halign: 'center', align: 'center',width:100,
	                    	  styler: function(value,row,index){
									if (value=="1"){
										return 'background-color:red;color:black;';									}
								},	
	                      	formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else if(value == "0"){
									return "N";
								}else{
									return "";
								}
							}},
	                      {field: 'carnoticestart', title: '整车公告开始时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'carnoticeend', title: '整车公告完成时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'otssampledate', title: 'OTS交样时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'otsacceptdate', title: 'OTS认可时间', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'ppapdate', title: 'PPAP', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                      {field: 'ptrdate', title: 'PTR', halign: 'center', align: 'center',width:100,formatter:formatDatebox},
	                     ]],
             toolbar:[{
            	 text:'导出',
           	  iconCls: 'icon-xls',
        		handler:exportOneMore
           }]
		})
		$("#dangerShow").datagrid("freezeRow","0");
	}else if(i==4){
		showFlag=true;
		//原材料长周期订购表
		$("#dangerShow").datagrid({
			  title:'原材料长周期订购表',
	          methord : 'post',
	          rownumbers: true,
	          fit:true,
	          pageSize : 10,
	          queryParams:{
	        		 suppid:suppid, 
	       		  suppname:suppname, 
	       		  arrid:arrid, 
	       		  arrname:arrname, 
	       		  cartypename:cartypename, 
	       		  power:power, 
	       		  office:office, 
	       		  startTime:startTime, 
	       		  endTime:endTime, 
	          },
	          onLoadSuccess: function(){
					$(this).datagrid('freezeRow',0);
				},
	          columns: [[ 
							 {field: 'suppliername', title: '供应商名称', halign: 'center',align: 'center',width:240},
							 {field: 'partscode',title: '零件号', halign: 'center', 	align: 'center',width:100},
							 {field: 'partsname',title: '零件名称', halign: 'center', align: 'center',	width:180},
							 {field: 'cartypename',title: '车型', halign: 'center', align: 'center',width:100},
							 {field: 'powerpz', title: '配置', halign: 'center',align: 'center',width:240},
							 {field: 'materialname', title: '原材料(包含子零件)名称', halign: 'center',align: 'center',width:180},
							 {field: 'ordercycle', title: '订购周期(天)', halign: 'center',align: 'center',width:100},
							 {field: 'suppliername', title: '原材料(包含子零件)供应商名称', halign: 'center',align: 'center',width:300},
							 {field: 'suppliercountry', title: '国家', halign: 'center',align: 'center',width:100},     
	                      ]],
             toolbar:[{
            		 text:'导出',
           	  iconCls: 'icon-xls',
          		handler: exportLongParts,
              }]
	})
	$("#dangerShow").datagrid("freezeRow","0");
}else if(i==0){
	showFlag=true;
	$("#dangerShow").datagrid({
		title:'产能提升计划一览',
		noheader : true,
		method : 'post',
		fit:true,
		border : true,
		striped : true,
		scrollbarSize:0,
		fitColumns : true,
		singleSelect : true,
	//	pagination:true,
	    onLoadSuccess: function(){
			$(this).datagrid('freezeRow',0);
		},
	    columns: [[
	               { field: 'date', title: '日期', halign: 'center',width: 130, align: 'center'},
	               { field: 'cartype', title: '车型', halign: 'center', width: 130, align: 'center' },
	               { field: 'dlpz', title: '动力配置', halign: 'center', width: 400, align: 'left' },
	               { field: 'gdjh', title: '滚动计划', halign: 'center', width: 130 , align: 'center'},
	               { field: 'suppliercn', title: '供应商产能', halign: 'center', width: 130, },
	               { field: 'cnc', title: '产能差', halign: 'center', width: 130, align: 'center' }
	             //  { field: 'ljname', title: '零件名称' , align: 'center',width: 150,},                 
	             //  { field: 'cpyq', title: '项目明细', halign: 'center', width: 100, align: 'center' },
	             //  { field: 'supliername', title: '供应商名称', halign: 'center', width: 150 },
	             //  { field: 'pb', title: '配比', halign: 'center', width: 100, align: 'center' }
	       ]],toolbar:[{
	           text: '导出',
	           iconCls: 'icon-xlsx',
	           handler: exp
	       }],onLoadSuccess:function(data){	
				$('#dangerShow').datagrid('tooltip', [ 'powerpz']);
			}
	});
	
$("#dangerShow").datagrid("freezeRow","0");
}else if(i==6){
	showFlag=true;
	$("#dangerShow").datagrid({
		title:'总项目清单',
		noheader : true,
		method : 'post',
		pageSize : 10,
		pagination : true,
		striped : true,
		fit : true,
		fitColumns : false,
		rownumbers : true,
		singleSelect : true,
	    columns: [ [
	                {field: 'infoid',title: 'infoid',hidden : true,rowspan : 2},
	     {
			field : 'departname',
			title : '业务科室',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'buyername',
			title : '采购员',
			align : 'center',
			halign : 'center',
			width : 100,
			rowspan : 2
		}, {
			field : 'sqe',
			title : 'SQE ',
			align : 'center',
			halign : 'center',
			width : 80,
			rowspan : 2
		}, {
			field : 'partscode',
			title : '零件号',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'partsname',
			title : '零件名称',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'suppliercode',
			title : '供应商代码',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'suppliername',
			title : '供应商名称',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'supuser',
			title : '供应商负责人',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'isnewtype',
			title : '是否四新<br/>及类型',
			align : 'center',
			halign : 'center',
			width : 100,
			rowspan : 2,
		}, {
			field : 'cayType',
			title : '车型',
			align : 'center',
			halign : 'center',
			width : 80,
			rowspan : 2
		}, {
			field : 'power',
			title : '动力配置',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'percent',
			title : 'SGMW分配配比',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'target',
			title : '产能目标<br/>(台套)',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		},{
			field : 'riskassessment',
			title : '风险评估',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2
		}, {
			field : 'isnewfactory',
			title : '是否新建厂',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2,
			styler: function(value,row,index){
				if (value=="1"){
					return 'color:red;';
				}
			},	
			formatter:function(value,row){
				if(value == "") {
		        		return "";
		        	} else
					if(value == "0"){
						return 'N';           					  
					} else
					if(value == "1"){
						return 'Y';
					}else {
						return value;
					}
			}
		}, {
			field : 'isonemore',
			title : '是否<br/>一品多点',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2,
			styler: function(value,row,index){
				if (value=="1"){
					return 'color:red;';
				}
			},	
			formatter:function(value,row){
				if(value == "") {
		        		return "";
		        	} else
					if(value == "0"){
						return 'N';           					  
					} else
					if(value == "1"){
						return 'Y';
					}else {
						return value;
					}
			}
		}, {
			field : 'islong',
			title : '是否原材料<br/>长周期订购',
			align : 'center',
			halign : 'center',
			width : 120,
			rowspan : 2,
			styler: function(value,row,index){
				if (value=="1"){
					return 'color:red;';				}
			},	
			formatter:function(value,row){
				if(value == "") {
		        		return "";
		        	} else
					if(value == "0"){
						return 'N';           					  
					} else
					if(value == "1"){
						return 'Y';
					}else {
						return value;
					}
			}
		}, {
			field : '11111',
			title : '产能提升措施',
			align : 'center',
			halign : 'center',
			colspan : 4,
			width : 200
		}, {
			field : 'state',
			title : '状态',
			align : 'center',
			halign : 'center',
			width : 200,
			rowspan : 2
		} ], [ {
			field : 'buyer',
			title : '采购',
			align : 'center',
			halign : 'center',
			width : 50
		}, {
			field : 'plannername',
			title : '计划',
			align : 'center',
			halign : 'center',
			width : 50
		}, {
			field : 'sqe',
			title : 'SQE',
			align : 'center',
			halign : 'center',
			width : 50
		}, {
			field : 'purchasername',
			title : '平台',
			align : 'center',
			halign : 'center',
			width : 50
		}, ] ],
		toolbar:[{
	           text: '导出',
	           iconCls: 'icon-xlsx',
	           handler: import_mod
	       }],
	   onLoadSuccess:function(data){	
			$('#dangerShow').datagrid('tooltip', [ 'power']);
		},
		onDblClickCell:showgY
	});
	
$("#dangerShow").datagrid("freezeRow","0");
}
}

//转换日期格式
function date(value) {
	if(value==null){
		return;
	}
    var date = new Date(value);//long转换成date
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1);
    var day = date.getDate().toString();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}


//导出
function exp(){
	suppid = $('#suppid').val();//供应商代码
	suppname = $('#suppname').val();//供应商名称
	arrid = $('#arrid').val();//零件号
	arrname = $('#arrname').val();//零件名称
	cartypename = $('#cartypename').combobox('getText');
	power = $('#power').combobox('getValue');//动力配置
	office = $('#office').combobox('getValue');//业务科室
	startTime = $('#startTime').datebox('getValue');//sop开始时间
	endTime = $('#endTime').datebox('getValue');//sop结束时间
	var rows=$("#dangerShow").datagrid('getRows');
	if(rows==0){
		 Msgshow('没有记录可以导出。');
	        return;
	}
	
	var params = $("#dangerShow").datagrid('options').queryParams;
	var form = $('<form></form>');
	form.attr('action', virpath + 'cnd01p/cndExport?cartypename='+cartypename+'&startTime='+startTime+'&endTime='+endTime
			+'&suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&power='+power+'&office='+office);
	form.attr('method', 'post');
	form.attr('target', '_self');
	for ( var key in params) {
		var my_input = $('<input type="hiddern" name="' + key + '"/>')
		my_input.attr('value', params[key]);
		form.append(my_input);
	}
	form.appendTo('body');

	$.messager.progress({
		title : '请稍后',
		msg : '数据导出中...'
	});
	form.form('submit', {
		success : function(result) {
			$.messager.progress('close');
			var result = eval('(' + result + ')');
			DownLoadFile(result);
		}
	});
	return false;

}
//交叉导出
function import_mod(){
	  var expRows = $("#dangerShow").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	    var powername = $('#power').combobox('getText');//动力配置
		var reg = new RegExp( ',' , "g" )
		powername = powername.replace( reg , '-' );
	    $.messager.progress({
			title : '请稍后',
			msg : '数据导出中...'
		});
	    $.ajax({
			url :virpath + 'cninfoview/exportAll?supplierCode1='+suppid+'&supplierName1='+suppname+'&partsCode1='+arrid+'&partsName1='+arrname+'&cartypename='+cartypename+
			'&power1='+powername+'&office1='+office+'&startTime='+startTime+'&endTime='+endTime,
			type : 'post',
			success : function(data) {
				$.messager.progress('close');
				var result = eval(" ( " + data + " ) ");
				DownLoadFile(result);
			}
		});
}

//导出-模拟
function expmn(){
	suppid = $('#suppid').val();//供应商代码
	suppname = $('#suppname').val();//供应商名称
	arrid = $('#arrid').val();//零件号
	arrname = $('#arrname').val();//零件名称
	cartypename = $('#cartypename').combobox('getText');
	power = $('#power').combobox('getValue');//动力配置
	office = $('#office').combobox('getValue');//业务科室
	startTime = $('#startTime').datebox('getValue');//sop开始时间
	endTime = $('#endTime').datebox('getValue');//sop结束时间
	var rows=$("#MnData").datagrid('getRows');
	if(rows==0){
		 Msgshow('没有记录可以导出。');
	        return;
	}
	
	var params = $("#dangerShow").datagrid('options').queryParams;
	var form = $('<form></form>');
	form.attr('action', virpath + 'cnd01p/cndExport?cartypename='+cartypename+'&startTime='+startTime+'&endTime='+endTime
			+'&suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&power='+power+'&office='+office);
	form.attr('method', 'post');
	form.attr('target', '_self');
	for ( var key in params) {
		var my_input = $('<input type="hiddern" name="' + key + '"/>')
		my_input.attr('value', params[key]);
		form.append(my_input);
	}
	form.appendTo('body');

	$.messager.progress({
		title : '请稍后',
		msg : '数据导出中...'
	});
	form.form('submit', {
		success : function(result) {
			$.messager.progress('close');
			var result = eval('(' + result + ')');
			DownLoadFile(result);
		}
	});
	return false;

}

function exportDangerShow(){
	  var expRows = $("#dangerShow").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	window.location.href=virpath + 'cninfoview/exportdanger?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	'&powe='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime;
}
//交叉导出
function exportCross(){
	  var expRows = $("#dangerShow").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	window.location.href=virpath + 'cninfoview/exportcross?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	'&powe='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&num='+num;
}
//cpt中的导出
function exportDangerShowks(){
	  var expRows = $("#targetData").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	    if(keflg = "yuefen"){
	    	window.location.href=virpath + 'cninfoview/exportdanger?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	    	'&powe='+power+'&office='+office+'&startTime='+encodeURIComponent(keshi)+'&endTime='+encodeURIComponent(keshi);
	    }else{
	    	window.location.href=virpath + 'cninfoview/exportdanger?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	    	'&powe='+power+'&office='+encodeURIComponent(keshi)+'&startTime='+startTime+'&endTime='+endTime;
	    }
}
function exportNewFactory(){
	  var expRows = $("#dangerShow").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	window.location.href=virpath + 'cninfoview/exportNewFactory?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	'&powe='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime;
}
function exportOneMore(){
	  var expRows = $("#dangerShow").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	window.location.href=virpath + 'cninfoview/exportOneMore?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	'&powe='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime;
}
function exportLongParts(){
	  var expRows = $("#dangerShow").datagrid('getRows');
	    if (expRows == 0) {
	        Msgshow('没有记录可以导出。');
	        return;
	    }
	window.location.href=virpath + 'cninfoview/exportLongParts?suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
	'&powe='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime;
}
function downLoad() {
    var expRows = $("#dangerShow").datagrid('getRows');
    if (expRows == 0) {
        Msgshow('没有记录可以导出。');
        return;
    }
    var queryParams = $("#dangerShow").datagrid('options').queryParams;
    var form = $('<form></form>');
    form.attr('action', virpath+'/smsh/cninfoview/exportNewFactory');
    form.attr('method', 'post');
    form.attr('target', '_self');
    for (var key in queryParams) {
        var my_input = $('<input type="hidden" name="' + key + '" />');
        my_input.attr('value', queryParams[key]);
        form.append(my_input);
    }
    form.appendTo("body");
    $.messager.progress({
        title: '请稍后',
        msg: '请求处理中...'
    });

    form.form('submit');
    $.messager.progress("close");

}

function CarTypr(flg){
	var a="";
if(flg==1){
	 a= document.getElementById('car1').innerText;
}else if(flg==2){
	 a= document.getElementById('car2').innerText;
}else if(flg==3){
	 a= document.getElementById('car3').innerText;
}else if(flg==4){
	 a= document.getElementById('car4').innerText;
}else if(flg==5){
	 a= document.getElementById('car5').innerText;
}else if(flg==6){
	 a= document.getElementById('car6').innerText;
}else if(flg==7){
	 a= document.getElementById('car7').innerText;
}else if(flg==8){
	 a= document.getElementById('car8').innerText;
}else if(flg==9){
	 a= document.getElementById('car9').innerText;
}else if(flg==10){
	 a= document.getElementById('car10').innerText;
}
$("#cartypename").combobox("setValue",a);
cartypename = a;
if(a.replace(/(^\s*)|(\s*$)/g, "")==""){
	 $.messager.alert('警告', '请点击有车型的按钮！');
		return;
}
if(startTime!=""){
	year = startTime.substring(0,4);
}
if(zhuti=='bootstrap'){
	  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx2.frm&suppid='+suppid+'&year='+year
	  +'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+a
	  +'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&flg='+flg;
}else{
	  var reportUrl = virpath + '/ReportServer?formlet=cnfxfx.frm&suppid='+suppid+'&year='+year
	  +'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+a
	  +'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime+'&flg='+flg;
}
$('#cpt').attr('src', reportUrl);

}


function Closeck(){
	$("#add_edit").dialog("close");
}

//月报提醒 
function Remind(){
	$.messager.confirm('提示信息', '此操作将会生产月报提醒，您是否确认?', function (data) {
        if (data) {
            $.ajax({
                url:  virpath + '/cnd01p/Remind',
                type: 'post',
                dataType: "json",
                data:{cartypename:cartypename,
                	startTime:startTime,
                	endTime:endTime},
                error: function () {
                    Msgalert('错误', '发送失败!', 'error');
                },
                success: function (Result) {
                    var data = Result;
                    if (data.success) {
                        Msgfade(data.msg);
                    } else {
                        Msgalert('错误', data.msg, 'error');
                    }
                }
            });
        }
    });
}

//模拟产能提升计划一览
function Moni1(){
	winmn.dialog('open');
	$("#MnData").datagrid({
		url:virpath + 'cnd01p/getData?mnflg=true&suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
		'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime,
		title:'产能提升计划模拟一览',
		noheader : true,
		method : 'post',
		fit:true,
		border : true,
		striped : true,
		scrollbarSize:0,
		rownumbers : true,
		fitColumns : true,
		singleSelect : true,
	    columns: [[
	               { field: 'date', title: '日期', halign: 'center',width: 130, align: 'center'},
	               { field: 'cartype', title: '车型', halign: 'center', width: 130, align: 'center' },
	               { field: 'dlpz', title: '动力配置', halign: 'center', width: 400, align: 'left' },
	               { field: 'gdjh', title: '滚动计划', halign: 'center', width: 130 , align: 'center'},
	               { field: 'suppliercn', title: '供应商产能', halign: 'center', width: 130, },
	               { field: 'cnc', title: '产能差', halign: 'center', width: 130, align: 'center' }
	       ]],
	       onLoadSuccess:function(data){	
				$('#MnData').datagrid('tooltip', [ 'powerpz']);
         	}
	       /*toolbar:[{
	           text: '导出',
	           
	           iconCls: 'icon-xlsx',
	           handler: expmn
	       }]*/
	});
	
$("#MnData").datagrid("freezeRow","0");
}
//模拟风险件清单一览
function Moni2(){	
	winmn2.dialog('open');
	$("#Mn2Data").datagrid({
		url:virpath + 'cninfoview/getdangerShowInfo?mnflg=true&suppid='+suppid+'&suppname='+suppname+'&arrid='+arrid+'&arrname='+arrname+'&cartypename='+cartypename+
		'&power='+power+'&office='+office+'&startTime='+startTime+'&endTime='+endTime,
		pageSize : 30,
        methord : 'post',
        pagination:true,
        rownumbers: true,
        fit:true,		
        columns: [[    // {field: 'infoid',title: 'infoid',hidden : true,rowspan : 2},
						{field: 'riskassessment', title: '风险评估', halign: 'center', width: 60,align: 'center',rowspan :2},
						{field: 'departname', title: '业务科室', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'partsname', title: '零件名称', halign: 'center', width: 80,align: 'center',rowspan :2},
						{field: 'suppliername', title: '供应商名称', halign: 'center', width: 180,align: 'center',rowspan :2},
						{field: 'isnewtype', title: '是否四新', halign: 'center', width: 60,align: 'center',rowspan :2,
							    	formatter: function(value,row,index){
										if (value == "1"){
											return "Y";
										}else{
											return "N";
										}
										
									}, 
									styler: function(value,row,index){
										if (value=="1"){
											return 'color:red;';
										}
									}},
						{field: 'isnewfactory', title: '新建厂', halign: 'center', width: 60,align: 'center',rowspan :2,
							styler: function(value,row,index){
								if (value=="1"){
									return 'color:red;';
								}
							},			
							formatter: function(value,row,index){
								if (value == "1"){
									return "Y";
								}else{
									return "N";
								}
							}},
						{field: 'isonemore', title: '一品多点', halign: 'center', width: 60,align: 'center',rowspan :2,
						 	formatter: function(value,row,index){
									if (value == "1"){
										return "Y";
									}else{
										return "N";
									}
								    },
								    styler: function(value,row,index){
										if (value=="1"){
											return 'color:red;';										}
									}},
						
						{field: 'ordercycle', title: '原材料<br>长周期', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'powerpz', title: '动力配置', halign: 'center', width: 130,align: 'center',rowspan :2},
						//{field: 'sgmw', title: 'SGMW<br>设定配比', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'target', title: '产能目标<br>（台套）', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'processname', title: '工序（瓶颈或<br>最小产能）', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'designtakt',title: '设计节拍', halign: 'center', align: 'center',width:100,rowspan :2},
						{field: 'actualbeat',title: '实际节拍', halign: 'center', align: 'center',width:100,rowspan :2},
						{field: 'designproduction', title: '设计产能', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'actualproduction', title: '实际产能', halign: 'center', width: 100,align: 'center',rowspan :2},
						{field: 'shejicnqk', title: '设计产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2}, //new
						{field: 'shijicnqk', title: '实际产能缺口<br>（台套/月）', halign: 'center', width: 100,align: 'center',rowspan :2},//new
						{ field: 'promotionproject', title: '产能提升措施', halign: 'center', width: 120, align: 'center' ,rowspan :2},
						{ field: 'finalvalue', title: '提升后瓶颈<br>工序产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
						{ field: 'tsgxhlj', title: '提升后该零<br>件产能（台套/月）', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
						{ field: 'plantime', title: '初始计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2},
						{ field: 'currenttime', title: '当前计划<br>完成时间', halign: 'center', width: 120, align: 'center' ,rowspan :2},//new
						{ field: 'currentprogress', title: '当前进展', halign: 'center', width: 120, align: 'center' ,rowspan :2},
						{field: '', title: '项目负责团队', halign: 'center', width: 100,align: 'center',colspan: 4}, 
                   ],
			          	[
			          	 { field: 'buyer', title: '采购', halign: 'center', width: 80, align: 'center' },
	                     { field: 'plannername', title: '计划', halign: 'center', width: 80, align: 'center' },
	                     { field: 'sqe', title: 'SQE', halign: 'center', width: 80, align: 'center' },
	                     { field: 'purchasername', title: '平台', halign: 'center', width: 80, align: 'center' },
			          	 ]],
			          	onLoadSuccess:function(data){	
							$('#Mn2Data').datagrid('tooltip', [ 'powerpz']);
			         	}
           /*toolbar:[{
          	 text:'导出',
            	  iconCls: 'icon-xls',
          		handler: exportDangerShow,
              }]*/
	})	
	$("#Mn2Data").datagrid("freezeRow","0");
}
//点击Y弹框
function showgY(rowIndex, row){
	var rowData = $('#dangerShow').datagrid('getRows')[rowIndex];
	if(rowData.isnewtype=="1" || rowData.isonemore=="1" || rowData.isnewfactory=="1"){
		showY.dialog('open');
		$("#showGridY").datagrid({
			url : virpath + "cninfoview/getcnd0205List?infoid="+rowData.infoid,
			pageSize : 30,
			methord : 'post',
			pagination:true,
			rownumbers: true,
			fit:true,		
			columns: [ [
			   /*         {
				field : 'updatedate',
				title : '更新日期',
				halign : 'center',
				align : 'center',
				width : 100,
				rowspan : 2
			},*/
			{
				field : 'wwww',
				title : '开发进度信息',
				halign : 'center',
				align : 'center',
				width : 1400,
				colspan : 14
			}, ], [ {
				field : 'otssampledate',
				title : 'OTS交样时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'isparts3c',
				title : '是否零件3C',
				halign : 'center',
				align : 'center',
				width : 120,
				formatter:function(value,row){
					if(value == "") {
						return "";
					} else
						if(value == "0"){
							return 'N';           					  
						} else
							if(value == "1"){
								return 'Y';
							}else {
								return value;
							}
				}
			}, {
				field : 'parts3cstart',
				title : '零件3C开始时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'parts3cend',
				title : '零件3C完成时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'iscar3c',
				title : '是否整车3C',
				halign : 'center',
				align : 'center',
				width : 120,
				formatter:function(value,row){
					if(value == "") {
						return "";
					} else
						if(value == "0"){
							return 'N';           					  
						} else
							if(value == "1"){
								return 'Y';
							}else {
								return value;
							}
				}
			}, {
				field : 'car3cstart',
				title : '整车3C开始时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'car3cend',
				title : '整车3C完成时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'iscarnotice',
				title : '是否整车公告',
				halign : 'center',
				align : 'center',
				width : 120,
				formatter:function(value,row){
					if(value == "") {
						return "";
					} else
						if(value == "0"){
							return 'N';           					  
						} else
							if(value == "1"){
								return 'Y';
							}else {
								return value;
							}
				}
			}, {
				field : 'carnoticestart',
				title : '公告开始时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'carnoticeend',
				title : '公告完成时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'otsacceptdate',
				title : 'OTS认可时间',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'ppapdate',
				title : 'PPAP',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'ptrdate',
				title : 'PTR',
				halign : 'center',
				align : 'center',
				width : 120
			}, {
				field : 'remark',
				title : '备注',
				halign : 'center',
				align : 'center',
				width : 120
			}, ] ]
		})	
	}else{
		return;
	}
}
function formatDatebox(value) {  
    if (value == null || value == '') {  
        return '';  
    }  
    var dt;  
    if (value instanceof Date) {  
        dt = value;  
    } else {  
        dt = new Date(value);  
    }  
  
    return dt.format("yyyy-MM-dd"); //扩展的Date的format方法(上述插件实现)  
}  

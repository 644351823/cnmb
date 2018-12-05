var columns = new Array();
var columnxm = new Array();
var rowIndexs = 0;
var SaveLCflg = false;
//目标明细编辑状态
var mbEditFlag = false;
// 滚动计划编辑状态
var gdEditFlag = false
// 目标明细编辑行
var mbEditIndex = -1;
// 滚动计划编辑行
var gdEditIndex = -1;
var ylflg="1";
var detailflg = false;
var editflg = true;
var num2 = 0;
var rowindexs = 0;
var sop;
var sopxm;
var upflg = false;

var dlg_upload;
var dlg_upload_form;
var dlg_Edit2;
var gridtwo;
var histroy;
$(function(){
	// 文件导入窗口
	/* decImportwin=$('#decImport_win').dialog({
	    	closed:true,
	    	modal : true, 
	    	title : '用户信息批量上传',
	    });*/
	 dlg_upload=$('#upFile').dialog({
	    	closed:true,
	    	modal:true,
	    	collapsible:false,
	    	minimizable:false,
	    	maximizable:false
	    });
    dlg_upload_form = dlg_upload.find("form"); 
    dlg_Edit2 = $('#err_Edit').dialog({
		closed : true,
		modal : true,
		collapsible : false,
		minimizable : false,
		maximizable : false,
        buttons: [{
            text: '关闭',
            iconCls: 'icon-no',
            handler: function () {
                dlg_Edit2.dialog('close');
            }
        }]});
    debugger;
    gridtwo = $('#gridtwo').datagrid({
         iconCls: 'icon-Bill',
         methord: 'post',
         url : virpath + '/cnd01/getDecFileData',
         queryParams: { type: 'temp' },
         idField: 'fileid',
         striped: true,
         frozenColumns: [[
 	                { field: 'ck', checkbox: true }
 				]],
         columns: [[
                     { field: 'fileid', title: 'id', hidden:true},
 					{ field: 'filename', title: '文件名', halign: 'center', width: 200,
 						formatter: function (value, rec) {
                             return '<a class="easyui-linkbutton" data-options="plain: true,iconCls:\'icon-'+rec.ficon+'\'" onclick="DownLoad(\'' + rec.furl + '\',\'' + rec.filename + '\')" href="javascript:void(0)">'+value+'</a>';
                         }
 					},
 					{ field: 'fsize', title: '文件大小', align: 'center', width: 60 },
                     { field: 'updatedate', title: '上传时间', align: 'center', width: 120 },
                     { field: 'furl', title: '操作', width: 70, fixed: true, align: 'center',
                     	formatter : function(value, rec) {
 							return '<a class="editcls" onclick="imp(\'' + rec.furl + '\',\'' + rec.filename + '\',\'' + rec.fileid + '\')" href="javascript:void(0)">导入</a>';
 						}
                     }
 				]],
         onLoadSuccess: function (data) {
             $('.editcls').linkbutton({ plain: true, iconCls: 'icon-upload' });
             $('.easyui-linkbutton').linkbutton();
         },
         fit: true,
         pagination: false,
         rownumbers: true,
         fitColumns: true,
         singleSelect: false,
         toolbar: [{
             text: '上传导入文件',
             iconCls: 'icon-mUp',
             handler: openFileWin
         }, '-', {
             text: '模板下载',
             iconCls: 'icon-mDn',
             handler: modeldown
         },'-', {
             text: '刷新文件列表',
             iconCls: 'icon-reload',
             handler: refreshdr
         }, '-', {
             text: '删除',
             iconCls: 'icon-remove',
             handler: deldr
         }]
     });
 

 // 画履历表
     histroy=$('#histroy').datagrid({
     	title:'导入履历',
     	split:true,
     	url : virpath + '/cnd01/getDecFileData',
     	queryParams: { type: 'history' },
     	iconCls:'icon-clock',
     	method:'post',
     	striped:true,
     	 columns: [[
 					{ field: 'filename', title: '文件名', halign: 'center', width: 200,
 						formatter: function (value, rec) {
                             return '<a class="easyui-linkbutton" data-options="plain: true,iconCls:\'icon-'+rec.ficon+'\'" onclick="DownLoad(\'' + rec.furl + '\',\'' + rec.filename + '\')" href="javascript:void(0)">'+value+'</a>';
                         } 
 					},
 					{ field: 'fsize', title: '文件大小', align: 'center', width: 60 },
                     { field: 'createdate', title: '上传时间', align: 'center', width: 100 },
                     { field: 'updatedate', title: '导入时间', align: 'center', width: 100 },
                     { field: 'createerid', title: '上传者', width: 70, align: 'center',
                     },
                     { field: 'updateerid', title: '导入者', width: 70, align: 'center',
                       }
 				]],
 		        onLoadSuccess: function (data) {
 		            $('.easyui-linkbutton').linkbutton();
 		        },
         fit: true,
         pagination: true,
         rownumbers: true,
         fitColumns: true,
         singleSelect: true
     });
	
	sop = $('#sop').dialog({
        closed: true,
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false
    });
    sopxm = $('#sopxm').dialog({
        closed: true,
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false
    });
    
    $('#ss1xm').numberspinner({    
        min: -6,    
        editable: true   
    }); 
    
    $('#ssxm').numberspinner({    
        min: -6,    
        editable: true   
    }); 
    
    $('#ss1').numberspinner({    
        min: -1,    
        editable: true   
    }); 
    
    $('#ss2').numberspinner({    
        min: -1,    
        editable: true   
    }); 
    $('#s1').linkbutton({    
        iconCls: 'icon-ok'   
    });  
    $('#s2').linkbutton({    
        iconCls: 'icon-cancel'   
    });
    $('#s3').linkbutton({    
        iconCls: 'icon-ok'   
    });
    $('#s4').linkbutton({    
        iconCls: 'icon-cancel'   
    });
});

//时间设定(滚动计划)
function SopTime(){
	if(checkDate()){
		return;
	}
	sop.dialog('open');
	sop.dialog('setTitle',"时间设定");
}
//时间设定(目标明细)
function SopTimexm(){
	debugger;
	if(checkDate()){
		return;
	}
	sopxm.dialog('open');
	sopxm.dialog('setTitle',"时间设定");
}

//新增(目标明细)
function add() {
	debugger;
	if(checkDate()){
		return;
	}
	var cartypeid =  $("#cartypename").val();
	var targetup = $('#target').val();// 产能目标上
	var approverid = $('#approvername').combobox('getValue');// 审批人id
	var sqeid = $('#SQE').combobox('getValue');// SQEid
	// 判断基础信息的必填是否都填写
	if(cartypeid==""||targetup==""||approverid==""){
		$.messager.alert('温馨提示', '请填写基础信息！', 'info');
		return;
	}else{
		// 新增时获取目标明细的所有行数据
		var row = $('#targetData').datagrid('getRows');
		rowindexs = row.length
					
		$('#targetData').datagrid('appendRow',{});
		$('#targetData').datagrid("selectRow", rowindexs).datagrid('beginEdit', rowindexs);
		mbEditFlag = true;
		mbEditIndex = rowindexs;
	}
}
function length(str){
	if(str.length>10){
		$.messager.alert('温馨提示', '	SOP的值：请输入10位以内的数字！', 'info');
		mbEditFlag = true;
		return false;
	}
}
//保存(目标明细)
function Savemb(addIndex){
	debugger;
	if(!mbEditFlag){
		return;
	}
	$('#targetData').datagrid('endEdit', mbEditIndex);
	mbEditFlag = false;
	var rows = $('#targetData').datagrid('getRows')[mbEditIndex];
	// 验证有误
	if(checkRow(rows)){
		$.messager.alert('温馨提示', '目标明细第'+(parseInt(mbEditIndex)+1)+'行，必填项目不能为空！', 'warning');
		$('#targetData').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
		mbEditFlag = true;
		return;
	}
	var cartypename =  $("#cartypename").val();
	var approverid = $('#approvername').combobox('getValue');//审批人id
	var approvername =  $("#approvername").combobox('getText');//审批人
	var sqeid = $('#SQE').combobox('getValue');//sqeid
	var sqename =  $("#SQE").combobox('getText');//sqe名称
	var targetup = $('#target').val();//产能目标上
	var remark=$('#remark').val();
	if(targetup.length>10){
		$.messager.alert('温馨提示', '基础信息中的产能目标(台套)：请输入10位以内的数字！', 'info');
		return;
	}
	var row1 = $('#targetData').datagrid('getRows')[0];
	
	var	powerid = rows.powerid;
	var	powername=rows.power;
	var	transmissionid = rows.transmissionid;
	var	transmissionname=rows.transmissionname;
	var	configid = rows.configid;
	var	configname=rows.configname;		
	var	otherid = rows.otherid;
	var	othervalue=rows.othervalue;
	var	sopdate=rows.sopdate;
	var	targetdmx = rows.target;
	if(targetdmx.length>10){
		 $.messager.alert('温馨提示', '目标明细中的产能目标（台套）：请输入10位以内的数字！', 'info');
			mbEditFlag = true;
			return;
	 }
	var	ratio = rows.ratio;
	if(ratio){
		var regu = "^(?:0|[1-9][0-9]?|100)$"; // 整数测试
		var re = new RegExp(regu);
		var res=new  RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/);
		if(ratio.search(re) == -1 && ratio.search(res)==-1){
			$.messager.alert('温馨提示', '比例格式应为0~100之间的整数或百分数！', 'info');
			$('#targetData').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
			return;
		}
	}
	
	var sop ="";
	var ss1xm = $('#ss1xm').numberspinner('getValue');
	var xmmxsop = $('#ssxm').numberspinner('getValue');
	for(var i=ss1xm;i<=xmmxsop;i++){
		if(i<0){
			sop+='SOP'+i+'&'+rows['sopm'+Math.abs(i)+'value']+',';
			 if(length(rows['sopm'+Math.abs(i)+'value'])==false){
				 $('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
					mbEditFlag = true;
				 return
			 }
		}else if(i==0){
			sop+='SOP+0&'+rows['sopvalue']+',';
			 if(length(rows['sopvalue'])==false){
				 $('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
					mbEditFlag = true;
				 return
			 }
		}else{
			sop+='SOP+'+i+'&'+rows['sopp'+i+'value']+',';
			 if(length(rows['sopp'+i+'value'])==false){
				 $('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
					mbEditFlag = true;
				 return
			 }
		}
	}
	var footRow = $('#targetData').datagrid('getRows')[mbEditIndex-1];
	var url;
	// 判断是否是修改已经保存的数据
	if(rows.detailid!="" && rows.detailid!=undefined){
		url = 'cnd01/updateCNMB';
	}else{
		url = 'cnd01/addCNMB'
	}
	ProcessStart();
	// 修改时
	if(rows.detailid!="" && rows.detailid!=undefined){
		var detailid = rows.detailid;
		var targetidxz = rows.targetid;
		upflg = true;
	}
	
	 if(ylflg=="1"){ 
		 
		 var targetidxz = row1.targetid;
		 if(footRow){
			 sort = ++footRow.sopvaluesort;
		 }else{
			 sort = 0;
		 }

	 }else{
		 var targetidxz = $("#targetid").val();
	 }
	 
	
	/*
	 * //新增时获取第一条的targetid，下边增减的都用这个targetid保存 var rows0 =
	 * $('#grid1').datagrid('getRows')[0]; if(rows0.targetid!="" &&
	 * rows0.targetid!=undefined && (rows.detailid=="" ||
	 * rows.detailid==undefined)){ param.targetidxz = rows0.targetid; }
	 */
	// param.cartypeid = cartypeid;
	$.ajax({
	url:virpath+url,
	async : false,
	type:'post',
	error:function(){
		Msgalert('错误','列获取失败','error');
	},
	data:{
		editflg:editflg,
		detailid:detailid,
		targetidxz:targetidxz,
		cartypename1 : cartypename,
		targetup : targetup,
		approverid : approverid,
		approvername1 : approvername,
		sqeid : sqeid,
		sqename : sqename,
		remark:remark,
		powerid : powerid,
		powername : powername,
		transmissionid : transmissionid,
		transmissionname:transmissionname,
		configid : configid,
		configname : configname,
		otherid : otherid,
		othervalue : othervalue,
		sopdate1 : sopdate,
		ratio: ratio,
        targetd : targetdmx,
        sop : sop,
        gdjhsop : xmmxsop,
        gdjhsop1 : ss1xm,
        sort:sort
	},
	success:function(result){
		var result = eval('('+result+')');
		if(result.success){
			/*
			 * $.messager.show({ title:'成功', msg:result.msg, timeout:2000 })
			 */
			$("#targetid").val(result.targetid);
			rows['detailid'] = result.detailid;
			rows['targetid'] = result.targetid;
			/* rows['target'] = result.targetValue; */
			$('#targetData').datagrid("updateRow",{
				index: mbEditIndex,
				row: rows
				}
			);
			$('#targetData').datagrid("acceptChanges");
			/* $('#targetData').datagrid('refreshRow', mbEditIndex); */
			if(addIndex > -1) {
				mbEditIndex = addIndex;
				mbEditFlag = true;
				$('#targetData').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
			}
			
			$.ajax({// 增减项目明细的保存成功的同时，在滚动计划表中同时增加一条对应数据
				url:virpath+'cnd01/getplanData?targetid='+result.targetid,
				type:'post',
				async:false,
				error:function(){
					Msgalert('错误','列获取失败','error');
				},
				success: function(result){
					var data = eval('('+result+')');
					var str = data.Strjosn;// 获取数据
					var fd = eval(data.Frozcolumns);// 画表结构
					if(str==""){
						$("#planData").datagrid('loadData', { total: 0, rows: [] });									
					}
					if(data.success && str!=""){
						$("#planData").datagrid({
							data:$.parseJSON(str),
							pageSize : 10,
					        methord : 'post',
					        pagination: false,
					        rownumbers: true,
					        singleSelect: true,
					        striped : true,
					        fit:true,
							columns:fd,
							onDblClickCell:editgdCell
						})
					}
				}
			});
			targetid=result.targetid;
			// rowindexs++;
			sort++;
			ProcessEnd();
		}else{
			// 保存失败
			$.messager.alert('警告',"目标明细第"+(parseInt(mbEditIndex)+1)+"行，" + result.msg,'warning');
			$('#targetData').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
			mbEditFlag = true;
		}
	}
})
}
//修改(目标明细)
function Edit() {
	var row=$("#targetData").datagrid("getSelected");
	if(row == null || row.length==0){
		 $.messager.alert('警告', '请选择一条记录进行操作！');
		 return;
	}
	if(!$('#cartypename').textbox("isValid") || !$('#target').numberbox("isValid") || !$('#approvername').combobox("isValid") || !$("#SQE").combobox("isValid")) {
		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
   		return;
	}
	var rowindex =$('#targetData').datagrid('getRowIndex',row);
	editmbCell(rowindex);
}
//修改单元格(目标明细)
function editmbCell(index,field,value){
	debugger;
	if(!$('#cartypename').textbox("isValid") || !$('#target').numberbox("isValid") || !$('#approvername').combobox("isValid") || !$("#SQE").combobox("isValid")) {
		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
		return;
	}
    // 本行重复编辑
    if(mbEditFlag && index == mbEditIndex) {
	    return;
    }
    // 已有目标编辑行
	if (mbEditFlag) {
		$('#targetData').datagrid('endEdit', mbEditIndex);
		var changedate = $('#targetData').datagrid('getChanges', 'updated');
		if(changedate.length == 0) {
			$('#targetData').datagrid('rejectChanges');
			// 开启编辑状态
			$('#targetData').datagrid('beginEdit', index);
			mbEditIndex = index;
			mbEditFlag = true;
			return;
		}
		var editRow = $('#targetData').datagrid("getRows")[mbEditIndex];
		// 验证编辑行
		// 验证有误
		if(checkRow(editRow)){
			$.messager.alert('温馨提示', '目标明细第'+(parseInt(mbEditIndex)+1)+'行，必填项目不能为空！', 'warning');
			$('#targetData').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
			return;
		} else {
			// 验证无误保存数据
			Savemb(index);
		}
	} else {
	   // 开启编辑状态
		$('#targetData').datagrid('beginEdit', index);
		mbEditIndex = index;
		mbEditFlag = true;
	}
}

// 删除(目标明细)
function Del(){
	var row = $('#targetData').datagrid('getSelected');
	var rowindex=$('#targetData').datagrid('getRowIndex',row);
	var rows = $('#targetData').datagrid('getSelections');
	if (rows.length > 0) {
        $.messager.confirm('提示信息', '您确认要删除选中的数据吗?', function (data) {
            if (data) {
                $.ajax({
                    url:  virpath + '/cnd01/deleteSopmx',
                    type: 'post',
                    dataType: "json",
                    data:{detailid:row.detailid},
                    error: function () {
                        Msgalert('错误', '删除失败!', 'error');
                        $('#targetData').datagrid('clearSelections');
                    },
                     success: function (Result) {
                        var data = Result;
                        if (data.success) {
                            Msgfade(data.msg);
                            $('#targetData').datagrid('deleteRow', rowindex);
                            $('#targetData').datagrid("acceptChanges");
                            $.ajax({
                    			url:virpath+'cnd01/getplanData?targetid='+row.targetid,
                    			async : false,
                    			type:'post',
                    			error:function(){
                    				Msgalert('错误','列获取失败','error');
                    			},
                    			success: function(result){
                    				var data = eval('('+result+')');
                    				var str = data.Strjosn;// 获取数据
                    				var fd = eval(data.Frozcolumns);// 画表结构
                    				if(str==""){
                    					$("#planData").datagrid('loadData', { total: 0, rows: [] });									
                    				}
                    				if(data.success && str!=""){
                    					$("#planData").datagrid({
                    						data:$.parseJSON(str),
                    						pageSize : 10,
                    				        methord : 'post',
                    				        pagination: false,
                    				        rownumbers: true,
                    				        singleSelect: true,
                    				        striped : true,
                    				        fit:true,
                    						columns:fd,
                    						onDblClickCell:editgdCell
                    					})
                    				}
                    			}
                    		});
                        } else {
                            Msgalert('错误', data.msg, 'error');
                        }
                    }
                });
            }
        });
    } else {
        $.messager.alert('警告', '请先选择要删除的信息！', 'warning');
    }
}

//验证编辑行
function checkRow(row){
	// 动力
	if(row.power == "" || row.power == undefined) {
		return true;
	}
	// 变速器
	else if(row.transmissionname == "" || row.transmissionname == undefined) {
		return true;
	}
	// 配置
	else if(row.configname == "" || row.configname == undefined) {
		return true;
	}
	// sop日期
	else if(row.sopdate == "" || row.sopdate == undefined) {
		return true;
	}
	else {
		return false;
	}
}
// 重置(目标明细)
function Reset() {
	if(mbEditFlag){
		var mbrow = $('#targetData').datagrid("getRows")[mbEditIndex];
		$('#targetData').datagrid('cancelEdit', mbEditIndex);
		$('#targetData').datagrid('rejectChanges');
		$('#targetData').datagrid('selectRow', mbEditIndex);
		mbEditFlag = false;
	}
}
//目标明细动态生成表格
function SopSurexm() {
	debugger;
	columnxm.length = 0;
	columnxm.push({
		field : 'otherid',
		title : '其他ID',
		hidden : true
	});
	columnxm.push({
		field : 'powerid',
		title : '动力ID',
		hidden : true
	});
	columnxm.push({
		field : 'transmissionid',
		title : '变速器ID',
		hidden : true
	});
	columnxm.push({
		field : 'configid',
		title : '配置ID',
		hidden : true
	});
	columnxm.push({
		field : 'otherid',
		title : '其他ID',
		hidden : true
	});
	columnxm.push({
		field : 'planid',
		title : '滚动计划ID',
		hidden : true
	});
	columnxm.push({
		field : 'targetid',
		title : '产能目标ID',
		hidden : true
	});
	columnxm.push({
		field : 'detailid',
		title : '产能明细ID',
		hidden : true
	});
	columnxm.push({
		field : 'power',
		title : '<div id="divPower1" style="line-height:30px;" >动力</div>',
		halign : 'center',
		align: 'center',
		width : 100,
		editor : {
			type : 'combobox',
			options : {
				url : virpath + 'cnd01/getPowerList',
				valueField : 'text',
				textField : 'text',
				panelHeight : 100,
				required : true,
				editable : true,
				onSelect : powerChange
			}
		}
	});
	columnxm.push({
		field : 'transmissionname',
		title : '<div id="divTransmissionname" style="line-height:30px;" >变速器</div>',
		halign : 'center',
		align: 'center',
		width : 120,
		editor : {
			type : 'combobox',
			options : {
				url : virpath + 'cnd01/getTransmissionList',
				valueField : 'text',
				textField : 'text',
				panelHeight : 100,
				required : true,
				editable : true,
				onSelect : tranChange
			}
		}
	});
	columnxm.push({
		field : 'configname',
		title : '<div id="divConfigname" style="line-height:30px;" >配置</div>',
		halign : 'center',
		align: 'center',
		width : 120,
		editor : {
			type : 'combobox',
			options : {
				url : virpath + 'cnd01/getConfigList',
				valueField : 'text',
				textField : 'text',
				panelHeight : 100,
				required : true,
				editable : true,
				onSelect : configChange
			}
		}
	});
	columnxm.push({
		field : 'othervalue',
		title : '<div id="divOthervalue" style="line-height:30px;" >其他</div>',
		halign : 'center',
		align: 'center',
		width : 130,
		editor : {
			type : 'combobox',
			options : {
				url : virpath + 'cnd01/getcxqt',
				valueField : 'text',
				textField : 'text',
				panelHeight : 100,
				editable : true,
				required : false,
				onSelect : otherChange
			}
		}
	});
	columnxm.push({
		field : 'sopdate',
		title : '<div id="divSopdate" style="line-height:30px;" >SOP日期</div>',
		halign : 'center',
		align: 'center',
		width : 130,
		editor : {
			type : 'datebox',
			options : {
				required : true,
				editable : true,
				formatter : formatter,
				parser : parser
			}
		}
	});
	columnxm.push({
		field : 'ratio',
		title : '<div id="divRatio" style="line-height:30px;" >比例(%)</div>',
		halign : 'center',
		align: 'center',
		width : 120,
		editor : {
			type : 'textbox',
			options : {
				required : true
			}
		}
	});
	columnxm.push({
		field : 'target',
		title : '产能目标</br>（台套）',
		halign : 'center',
		align: 'center',
		width : 130
	});
	var ss1xm = $('#ss1xm').numberspinner('getValue');
	var xmmxsop = $('#ssxm').numberspinner('getValue');
	for (var i = ss1xm; i <= xmmxsop; i++) {
		var column = {};
		if (i < 0) {
			column.field = 'sopm' + Math.abs(i) + 'value';
			column.title = 'SOP' + i;

		} else if (i == 0) {
			column.field = 'sopvalue';
			column.title = 'SOP';

		} else {
			column.field = 'sopp' + i + 'value';
			column.title = 'SOP+' + i;
		}
		column.width = 100;
		column.halign = 'center';
		column.align = 'center';
		column.editor = {
			type : 'numberbox',
			options : {
				required : false,
			}
		}
		columnxm.push(column);
	}
	sopxm.dialog('close');
	$('#targetData').datagrid({
		pageSize : 10,
        methord : 'post',
        pagination: false,
        rownumbers: true,
        singleSelect: true,
        striped : true,
        fit:true,
		columns : [columnxm],
		onDblClickCell : editmbCell
	});
	$("#targetData").datagrid('reload');
}

//滚动计划动态生成表格
function SopSure() {
	columns.length = 0;
	columns.push({
		field : 'configid',
		title : '配置ID',
		hidden : true
	});
	columns.push({
		field : 'otherid',
		title : '其他ID',
		hidden : true
	});
	columns.push({
		field : 'transmissionid',
		title : '变速器ID',
		hidden : true
	});
	columns.push({
		field : 'planid',
		title : '滚动计划ID',
		hidden : true
	});
	columns.push({
		field : 'targetid',
		title : '产能目标ID',
		hidden : true
	});
	columns.push({
		field : 'detailid',
		title : '产能明细ID',
		hidden : true
	});
	columns.push({
		field : 'power',
		title : '动力',
		halign : 'center',
		align : 'center',
		width : 100
	});
	columns.push({
		field : 'transmissionname',
		title : '变速器',
		halign : 'center',
		align : 'center',
		width : 120
	});
	columns.push({
		field : 'configname',
		title : '配置',
		halign : 'center',
		align : 'center',
		width : 120
	});
	columns.push({
		field : 'othervalue',
		title : '其他',
		halign : 'center',
		align : 'center',
		width : 130
	});

	var gdjhsop1 = $('#ss1').numberspinner('getValue');
	var gdjhsop = $('#ss2').numberspinner('getValue');

	for (var i = gdjhsop1; i <= gdjhsop; i++) {
		var column = {};
		if (i < 0) {
			column.field = 'sopm' + Math.abs(i) + 'value';
			column.title = 'SOP' + i;

		} else if (i == 0) {
			column.field = 'sopvalue';
			column.title = 'SOP';

		} else {
			column.field = 'sopp' + i + 'value';
			column.title = 'SOP+' + i;
		}

		column.width = 100;
		column.halign = 'center';
		column.align = 'center';
		column.editor = {
			type : 'numberbox',
			options : {
				required : false,
			}
		}
		columns.push(column);
	}
	sop.dialog('close');
	$('#planData').datagrid({
		pageSize : 10,
		methord : 'post',
		pagination : false,
		rownumbers : true,
		singleSelect : true,
		striped : true,
		fit : true,
		columns : [columns],
		onDblClickCell:function(index,field,value){
	      	if(!detailflg){
		        $(this).datagrid('endEdit', num2);
				$(this).datagrid('beginEdit', index);
				num2 = index;
	      	}
        }
	});

	$("#planData").datagrid('reload');
}
//提交
function doSubmit() {
	ProcessStart();
	if(SaveLCflg == false){
		SaveLC1(true);
		if(mbEditFlag==true){
			return;
		}
	}
	$("#ff").form('submit', {
		url : virpath + "cnd01/doSubmit",
		onSubmit : function() {
		},
		success : function(result) {
			//result为请求处理后的返回值    
			var result = eval('(' + result + ')');
			if (result.success) {
				$.messager.show({
					title : '成功',
					msg : result.msg,
					timeout : 2000,
					showType : 'fade'
				});
				ProcessEnd();
				$('#detail').window('close');
				grid.datagrid('reload');
			} else {
				Msgalert('警告', result.msg, 'warning');
			}
		}
	})
}
function deleteAll(){
	debugger;
	if(state!="已保存" && state!="经理驳回"){
		$.messager.alert('提示', '此数据不可删除！', 'info');
		return;
	}
	var rows = $('#targetData').datagrid('getRows');
	var detailids="";
	for(var i = 0;i<rows.length;i++){
	   detailids+=rows[i].detailid+","
	}
	        $.messager.confirm('提示信息', '此操作将会删除数据，您是否确认?', function (data) {
	            if (data) {
	            	ProcessStart();
	            	$("#add_edit").dialog("close");
	                $.ajax({
	                    url:  virpath + '/cnd01/deleteAll',
	                    type: 'post',
	                    dataType: "json",
	                    data:{detailids:detailids,
	                    	  targetid:targetId,
	                    	  state:state},
	                    error: function () {
	                        Msgalert('错误', '删除失败!', 'error');
	                    },
	                    success: function (Result) {
	                        var data = Result;
	                        if (data.success) {
	                            Msgfade(data.msg);
	                            $('#detail').window('close');
	                            grid.datagrid("reload");
	                            ProcessEnd();
	                        } else {
	                            Msgalert('错误', data.msg, 'error');
	                        }
	                    }
	                });
	            }
	        });
}
function doSubmit_c(flg, id) {
	debugger;
	var spyj = $("#spyj").html();
	var ispaswd;
	if (id == 1) {
		var url = virpath + "/cnd01/jingliSubmit";
	}
	if (flg == 0 && spyj == null) {
		$.messager.alert('警告', '审批意见不能为空', 'warning');
		return;
	}
	var mc = grid.datagrid('getSelected').mainContent;
	$.messager.confirm("系统提示", "确定要执行此操作吗？", function(data) {
		if (data) {
			$('#ff').form('submit',{
				url : url,
				onSubmit : function(param) {
					ProcessStart();
					if (flg == 1) {
						param.result = "同意";
					} else {
						param.result = "驳回";

					}
					return true;
				},
				success : function(data) {
					ProcessEnd();
					data = eval('(' + data + ')');
					if (data.success) {
						$('#detail').window('close');
						grid.datagrid('reload');
						grid.datagrid('clearSelections');
						Msgfade(data.msg); //提示消息
						var rowIndex = grid.datagrid('getRowIndex',
								grid.datagrid('getSelected'));
						if (mc != undefined) {
							grid.datagrid('deleteRow', rowIndex);

						} else {
							grid.datagrid('reload');
							grid.datagrid('clearSelections');
						}
						//planData.datagrid('reload');
						//grid3.datagrid('reload');
					} else {
						Msgalert('错误提示', data.msg, 'warning');
					}
				}
			});
		}
	});
}

// 修改单元格(滚动计划)
function editgdCell(index,field,value){
	debugger;
	// 本行重复编辑
	if(gdEditFlag && index == gdEditIndex) {
		return;
	}
	// 已有目标编辑行
	if (gdEditFlag) {
		Save2(index);
	} else {
		// 开启编辑状态
		$('#planData').datagrid('beginEdit', index);
		gdEditIndex = index;
		gdEditFlag = true;
	}
}
// 修改(滚动计划)
function Edit2(){
	var row=$("#planData").datagrid("getSelected");
	if(row.length==0){
		 $.messager.alert('警告', '请选择一条记录进行操作！');
		 return;
	}
	var rowindex =$('#planData').datagrid('getRowIndex',row);
	if(gdEditFlag && rowindex == gdEditIndex) {
		   return;
	}
	// 已有目标编辑行
	if (gdEditFlag) {
		$.messager.alert('温馨提示', '请先保存滚动计划数据！', 'warning');
		$('#planData').datagrid("selectRow", gdEditIndex);
		return;
	} else {
		// 开启编辑状态
		$('#planData').datagrid('beginEdit', rowindex);
		gdEditIndex = rowindex;
		gdEditFlag = true;
   }
}

//滚动计划重置
function Reset2(){
	if(gdEditFlag){
		var gdrow = $('#planData').datagrid("getRows")[gdEditIndex];
		$('#planData').datagrid('cancelEdit', gdEditIndex);
		$('#planData').datagrid('rejectChanges');
		$('#planData').datagrid('selectRow', gdEditIndex);
		gdEditFlag = false;
	}
}

//滚动计划删除
function Del2(){
	var row = $('#planData').datagrid('getSelected');
	var rowindex=$('#planData').datagrid('getRowIndex',row);
	if(row.planid!=null){// 如果是保存后的
		var rows = $('#planData').datagrid('getSelections');
	    if (rows.length > 0) {
	        $.messager.confirm('提示信息', '您确认要删除选中的数据吗?', function (data) {
	            if (data) {
	                $.ajax({
	                    url:  virpath + '/cnd01/deleteSopgd',
	                    async : false,
	                    type: 'post',
	                    dataType: "json",
	                    data:{detailid:row.detailid,targetid:row.targetid},
	                    error: function () {
	                        Msgalert('错误', '删除失败!', 'error');
	                    },
	                    success: function (Result) {
	                        var data = Result;
	                        if (data.success) {
	                            Msgfade(data.msg);
	                            $.ajax({
	                    			url:virpath+'cnd01/getplanData?targetid='+row.targetid,
	                    			async : false,
	                    			type:'post',
	                    			error:function(){
	                    				Msgalert('错误','列获取失败','error');
	                    			},
	                    			success: function(result){
	                    				var data = eval('('+result+')');
	                    				var str = data.Strjosn;// 获取数据
	                    				var fd = eval(data.Frozcolumns);// 画表结构
	                    				if(str==""){
	                    					$("#planData").datagrid('loadData', { total: 0, rows: [] });									
	                    				}
	                    				if(data.success && str!=""){
	                    					$("#planData").datagrid({
	                    						data:$.parseJSON(str),
	                    						pageSize : 10,
	                    				        methord : 'post',
	                    				        pagination: false,
	                    				        rownumbers: true,
	                    				        singleSelect: true,
	                    				        striped : true,
	                    				        fit:true,
	                    						columns:fd,
	                    						onDblClickCell:editgdCell
	                    					})
	                    				}
	                    			}
	                    		});
//	                            refresh();// 刷新
	                            $('#planData').datagrid("acceptChanges");
	                        } else {
	                            Msgalert('错误', data.msg, 'error');
	                        }
	                    }
	                });
	            }
	        });
	    } else {
	        $.messager.alert('警告', '请先选择要删除的信息！', 'warning');
	    }
	}else{
		var gdrow = $('#planData').datagrid("getRows")[gdEditIndex];
		$('#planData').datagrid('cancelEdit', gdEditIndex);
		$('#planData').datagrid('rejectChanges');
		$('#planData').datagrid('selectRow', gdEditIndex);
	}
}

//保存滚动计划
function Save2(addGdIndex){
	debugger;
	$('#planData').datagrid('endEdit', gdEditIndex);
	if(!gdEditFlag){
		return;
	}
	gdEditFlag = false;
	var rows = $('#planData').datagrid('getRows')[gdEditIndex];
	var targetid = rows.targetid;// 产能目标ID
	var detailid=rows.detailid;// 产能明细ID
	var sop ="";
	var gdjhsop1 = $('#ss1').numberspinner('getValue');
	var gdjhsop = $('#ss2').numberspinner('getValue');
	for(var i=gdjhsop1;i<=gdjhsop;i++){
		if(i<0){
			sop+='SOP'+i+'&'+rows['sopm'+Math.abs(i)+'value']+',';
		}else if(i==0){
			sop+='SOP+0&'+rows['sopvalue']+',';
		}else{
			sop+='SOP+'+i+'&'+rows['sopp'+i+'value']+',';
		}
	}
	if(rows.length<1){
		 $.messager.alert('温馨提示', '请填写目标明细！', 'info');
	       return;
	}
	if(rows.length>1){
		 $.messager.alert('温馨提示', '请选中一行数据进行保存！', 'info');
	       return;
	}
	$('#ff').form('submit',{
		url:virpath+'cnd01/addCNMB0102',
		onSubmit:function(param){
			param.planid = rows.planid;
			param.targetid1 = targetid;
			param.detailid = detailid;
			param.sop = sop;
		},
		success:function(result){
			var result = eval('('+result+')');
			if(result.success){
				$('#planData').datagrid("updateRow",{
					index: gdEditIndex,
					row: rows
				});
				$('#planData').datagrid("acceptChanges");
				$('#planData').datagrid('refreshRow', gdEditIndex);
				if(addGdIndex > -1) {
					gdEditIndex = addGdIndex;
					gdEditFlag = true;
					$('#planData').datagrid("selectRow", gdEditIndex).datagrid('beginEdit', gdEditIndex);
				}
			}else{
				$.messager.alert('警告',result.msg,'warning')
				$('#planData').datagrid('selectRow', gdEditIndex).datagrid('beginEdit', gdEditIndex);
				gdEditFlag = true;
			}
		}
	})
}
//保存(产能目标确认单)
function SaveAll(){
	SaveLC1();
}
function titlename(){
	$(".divPower1").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的发动机类型：譬如：B15、N15T，必填。'
	});
	$(".divTransmissionname").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的变速器类型，譬如：6MT、DCT，必填。'
	});
	$(".divConfigname").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的配置类型，譬如：LV0、LV1，必填。'
	});
	$(".divOthervalue").tooltip({
		  position: 'bottom',    
		  content: '根据需要填写，譬如国五、5座等，选填。'
	});
	$(".divSopdate").tooltip({
		  position: 'bottom',    
		  content: '下拉选择该车型首款配置SOP时间，必填。。'
	});
	$(".divRatio").tooltip({
		  position: 'bottom',    
		  content: '填写每个动力配置产能目标在总体产能目标中所占比例，单位：%，带单位，必填。'
	});
	$(".sopftile").tooltip({
		position: 'bottom',
		content: '填写每个动力配置的产能目标值，若需填写更多月份的产能目标，可加列。根据需要填写对应的月份的产能目标值，单位：台套/月，填写数字，不带单位，必填。'
	});
	$(".sopltile").tooltip({
		position: 'bottom',
		content: '填写每个动力配置的产能目标值，若需填写更多月份的产能目标，可加列。根据需要填写对应的月份的产能目标值，单位：台套/月，填写数字，不带单位，必填。'
	});
	$(".sopztile").tooltip({
		position: 'bottom',
		content: '填写每个动力配置的产能目标值，若需填写更多月份的产能目标，可加列。根据需要填写对应的月份的产能目标值，单位：台套/月，填写数字，不带单位，必填。'
	});
}
/*function Savemx1(addIndex){
	if(!mbEditFlag){
		return;
	}
	$('#targetData').datagrid('endEdit', mbEditIndex);
	mbEditFlag = false;
	var rows = $('#targetData').datagrid('getRows')[mbEditIndex];
	// 验证有误
	if(checkRow(rows)){
		$.messager.alert('温馨提示', '目标明细第'+(parseInt(mbEditIndex)+1)+'行，必填项目不能为空！', 'warning');
		$('#targetData').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
		mbEditFlag = true;
		return;
	}
	
	var cartypename =  $("#cartypename").val();
	var approverid = $('#approvername').combobox('getValue');// 审批人id
	var approvername =  $("#approvername").combobox('getText');// 审批人
	var targetup = $('#targete').val();// 产能目标上
	var remark=$('#remarke').val();
	
	var row1 = $('#targetData').datagrid('getSelected');
	var	powerid = rows.powerid;
	var	powername=rows.power;
	var	transmissionid = rows.transmissionid;
	var	transmissionname=rows.transmissionname;
	var	configid = rows.configid;
	var	configname=rows.configname;		
	var	otherid = rows.otherid;
	var	othervalue=rows.othervalue;
	var	sopdate=rows.sopdate;
	var	targetdmx = rows.target;
	var	ratio = rows.ratio;
	var regu = "^(?:0|[1-9][0-9]?|100)$"; // 整数测试
	var re = new RegExp(regu);
	var res=new  RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/);
	if(ratio.search(re) == -1 && ratio.search(res)==-1){
		$.messager.alert('温馨提示', '比例格式应为0~100之间的整数或百分数！', 'info');
		$('#targetData').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
		mbEditFlag = true;
		return;
	}
	var sop ="";
	var ss1xm = $('#ss1xm').numberspinner('getValue');
	var xmmxsop = $('#ssxm').numberspinner('getValue');
	for(var i=ss1xm;i<=xmmxsop;i++){
		if(i<0){
			sop+='SOP'+i+'&'+rows['sopm'+Math.abs(i)+'value']+',';
		}else if(i==0){
			sop+='SOP+0&'+rows['sopvalue']+',';
		}else{
			sop+='SOP+'+i+'&'+rows['sopp'+i+'value']+',';
		}
	}
		
	var url;
	// 判断是否是修改已经保存的数据
	if(rows.detailid!="" && rows.detailid!=undefined){
		url = 'cnd01/updateCNMB';
	}else{
		url = 'cnd01/addCNMB'
	}
	ProcessStart();
	$('#ff').form('submit',{
		url:virpath + url,
		async: false,
		onSubmit:function(param){
			// 修改时
			if(rows.detailid!="" && rows.detailid!=undefined){
				param.detailid = rows.detailid;
				param.targetidxz = rows.targetid;
				upflg = true;
			}
			if(ylflg=="1"){ 
				 param.targetidxz = row1.targetid; 
			 }
			if(ylflg!="1"){
				param.targetidxz = $("#targetid").val();
			}
			param.editflg = editflg;
			param.cartypename1 = cartypename;
			param.targetup = targetup;
			param.approverid = approverid;
			param.approvername1 = approvername;
			param.remark=remark;
			param.powerid = powerid;
			param.powername = powername;
			param.transmissionid = transmissionid;
			param.transmissionname=transmissionname;
			param.configid = configid;
			param.configname = configname;
			param.otherid = otherid;
			param.othervalue = othervalue;
			param.sopdate1 = sopdate;
			param.ratio= ratio;
	        param.targetd = targetdmx;
	        param.sop = sop;
		},
		success:function(result){
			var result = eval('('+result+')');
			if(result.success){
				$("#targetid").val(result.targetid);
				rows['detailid'] = result.detailid;
				rows['targetid'] = result.targetid;
				$('#targetData').datagrid("updateRow",{
					index: mbEditIndex,
					row: rows
				});
				$('#targetData').datagrid("acceptChanges");
				if(addIndex > -1) {
					mbEditIndex = addIndex;
					mbEditFlag = true;
					$('#targetData').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
				}
				$.ajax({// 增减项目明细的保存成功的同时，在滚动计划表中同时增加一条对应数据
					url:virpath+'cnd01/getplanData?targetid='+result.targetid,
					type:'post',
					async:false,
					error:function(){
						Msgalert('错误','列获取失败','error');
					},
					success: function(result){
						ProcessEnd();
						var data = eval('('+result+')');
						var str = data.Strjosn;// 获取数据
						var fd = eval(data.Frozcolumns);// 画表结构
						if(str==""){
							$("#planData").datagrid('loadData', { total: 0, rows: [] });									
						}
						if(data.success && str!=""){
							$("#planData").datagrid({
								data:$.parseJSON(str),
								pageSize : 10,
						        methord : 'post',
						        pagination: false,
						        rownumbers: true,
						        singleSelect: true,
						        striped : true,
						        fit:true,
								columns:fd,
								onDblClickCell:editgdCell
							})
						}
					}
				});
				targetid=result.targetid;
				
			}else{
				// 保存失败
				$.messager.alert('警告',"目标明细第"+(parseInt(mbEditIndex)+1)+"行，" + result.msg,'warning');
				$('#targetData').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
				mbEditFlag = true;
				ProcessEnd();
			}
		}
	})
}*/

function SaveLC1(isSubmit){
	Save2();
//	Savemx1();
	Savemb();
	var cartypename =  $("#cartypename").val();
	var approverid = $('#approvername').combobox('getValue');// 审批人id
	var sqeid =  $("#SQE").combobox('getValue');// 审批人
	var sqename =  $("#SQE").combobox('getText');// 审批人
	var approvername =  $("#approvername").combobox('getText');// 审批人
	var rows = $('#targetData').datagrid('getRows');
	var sopdate1 = "";
	var targetid = targetId;
	var powernames="";
	if(cartypename==""||approverid==""||approvername=="") {
   		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
   		return;
	}
	for(var i = 0;i<rows.length;i++){
			powernames+=rows[i].power+","
			sopdate1 = sopdate1 + (rows[i].sopdate +"")+",";
	}
	SaveLCflg==true;
	$.ajax({
		async:false, 
		url : virpath + "cnd01/updateCNMBLC",		
		data : {			
			sopdate1:sopdate1,
			targetidlc:targetid,
			powernames1:powernames,
			remark1:remark,
			cartypename1:cartypename,
			approverid1:approverid,
			approvername1:approvername,
			targetup1:target,
			sqeid:sqeid,
			sqename:sqename
		},
		success:function(result){
			var result = eval('('+result+')');
			if(result.success){
				if(!isSubmit) {
					$.messager.show({
						title:'成功',
						msg:result.msg,
						timeout:2000
					})
					$('#add_edit').dialog('close');
					}
			}else{
				$.messager.alert('警告',result.msg,'warning');
				return;
			}
		}
	})
}
// 日期初始化
function formatter(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	month = month < 10 ? '0' + month : month;
	return year + "年" + month + "月" + day + "日";
}
// 日期格式化
function parser(s) {
	if (!s)
		return new Date();
	var ss = s.replace("年", "-").replace("月", "-").replace("日", "-");
	var sss = ss.split("-");
	var y = parseInt(sss[0], 10);
	var m = parseInt(sss[1], 10);
	var d = parseInt(sss[2], 10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
		return new Date(y, m - 1, d);
	} else {
		return new Date();
	}
}
function checkDate(){
	if(mbEditFlag){
		$.messager.alert('温馨提示', '请先保存目标明细数据！', 'warning');
		$('#targetData').datagrid("selectRow", mbEditIndex);
		return true;
	} 
	if(gdEditFlag){
		$.messager.alert('温馨提示', '请先保存滚动计划数据！', 'warning');
		$('#planData').datagrid("selectRow", gdEditIndex);
		return true;
	}
	return false;
}
//打开文件导入窗口
function infoImport(){
/*	$('#decImport_win').panel('resize',{
		width: 600,
		height: 400
	});
*/		
	    decImportwin.dialog('open');
		decImportwin.dialog('setTitle','导入数据');
}
function modeldown(){
	DownLoad("/Content/ServerFiles/templet/产能目标导入模板.xlsx","产能目标导入模板.xlsx");
}
function refreshdr(){
	gridtwo.datagrid('reload');
    histroy.datagrid('reload');
}
function deldr() {
    var arr = getSelectedArr2();
    if (arr.length > 0) {
        $.messager.confirm('提示信息', '您确认要删除选中的文件吗?', function (data) {
            if (data) {
                $.ajax({
                    url: virpath + 'cnd01/DelFiles?ids='+arr2str(arr),
                    type: 'post',
                    contentType: "application/json",
                    error: function () {
                    	Msgalert('错误', '删除失败!', 'error');
                    	gridtwo.datagrid('clearSelections');
                    },
                    success: function (Result) {
                        var data = eval('(' + Result + ')');
                        if (data.success) {
                            Msgfade(arr.length+"条记录"+data.msg); // 提示消息
                            gridtwo.datagrid('reload');
                            gridtwo.datagrid('clearSelections');
                        } else {
                            Msgalert('错误', data.msg, 'error');
                        }
                    }
                });
            }
        });
    } else {
        Msgshow('请先选择要删除的文件。');
    }
}
//导入
function imp(fileUrl, fileName, fileid) {
	$.messager.confirm('提示信息', '该操作将导入产能目标管理信息，是否继续?', function (data) {
	      if (data) {
	          $.messager.progress({
	              title: '请稍后',
	              msg: '数据导入中...'
	          });
	          dlg_upload_form.url = virpath + 'cnd01/ImpSave?fileUrl='+fileUrl+'&fileid='+fileid;
	          $("#fileid").val(fileid);
	          $("#fileName").val(fileName);
	          $("#fileUrl").val(fileUrl);
	          upLoadFileSubmit();
	      }
	  });
}
function getSelectedArr2() {
    var ids = [];
    var rows = gridtwo.datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].fileid);
    }
    return ids;
}
function upLoadFileSubmit() {
	dlg_upload_form.form('submit', {
		url : dlg_upload_form.url,
		onSubmit : function(param) {
			return $(this).form('validate');
		},
		success: function (result) {
           $.messager.progress('close'); 
           var result = eval('(' + result + ')');
           if (result.success) {
        	   $.messager.show({
                   title: '成功',
                   msg: result.msg,
                   timeout: 2000,
                   showType: 'fade'
               });
        	   debugger;
        	   // 上传文件界面
        	   gridtwo.datagrid('reload');
        	   histroy.datagrid('reload');
        	   $.ajax({
       			url:virpath+'cnd01/gettargetDetail?targetid='+targetId,
       			type:'post',
       			error:function(){
       				Msgalert('错误','列获取失败','error');
       			},
       			success: function(result){
       				debugger;
       				var data = eval('('+result+')');
       				var str = data.Strjosn;//获取数据
       				var fd = eval(data.Frozcolumns);//画表结构
       				if (data.ss1xm == 0) {
       					$('#ss1xm').numberspinner('setValue',-6);
       				} else {
       					$('#ss1xm').numberspinner('setValue',data.ss1xm);
       				}
       				if (data.ssxm == 0) {
       					$('#ssxm').numberspinner('setValue',6);
       				} else {
       					$('#ssxm').numberspinner('setValue',data.ssxm);
       				}
       				if(data.success){
       					$("#targetData").datagrid({
       						data:$.parseJSON(str),
       						pageSize : 10,
       				        methord : 'post',
       				        pagination: false,
       				        rownumbers: true,
       				        singleSelect: true,
       				        striped : true,
       				        fit:true,
       						columns:fd,
       						onDblClickCell : editmbCell
       					})
       				}
       			}
       		});
       		$.ajax({
       			url:virpath+'cnd01/getplanData?targetid='+targetId,
       			type:'post',
       			error:function(){
       				Msgalert('错误','列获取失败','error');
       			},
       			success: function(result){
       				var data = eval('('+result+')');
       				var str = data.Strjosn;//获取数据
       				var fd = eval(data.Frozcolumns);//画表结构
       				if (data.gdjhsop1 == 0) {
       					$('#ss1').numberspinner('setValue',-1);
       				} else {
       					$('#ss1').numberspinner('setValue',data.gdjhsop1);
       				}
       				if (data.gdjhsop == 0) {
       					$('#ss2').numberspinner('setValue',6);
       				} else {
       					$('#ss2').numberspinner('setValue',data.gdjhsop);
       				}
       				if(str==""){
       					$("#planData").datagrid('loadData', { total: 0, rows: [] });									
       				}
       				if(data.success && str!=""){
       					$("#planData").datagrid({
       						data:$.parseJSON(str),
       						pageSize : 10,
       				        methord : 'post',
       				        pagination: false,
       				        rownumbers: true,
       				        singleSelect: true,
       				        striped : true,
       				        fit:true,
       						columns:fd,
       						onDblClickCell:function(index,field,value){
       					      	if(!detailflg){
       						        $(this).datagrid('endEdit', num2);
       								$(this).datagrid('beginEdit', index);
       								num2 = index;
       					      	}
       				        }
       					})
       				}
       			}
       		});
        	   
           } else {
           	$("#errinfo").val(result.msg);
           	dlg_Edit2.dialog('open');
           }
       } 
	});
}
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


$(function(){
	debugger;
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
	var targetup = $('#target').val();//产能目标上
	var remark=$('#remark').val();
	
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
	
	var url = 'cnd01/updateCNMB';
	ProcessStart();
	$('#ff').form('submit',{
		url:virpath+url,
		async: false,
		onSubmit:function(param){
			//修改时
			if(rows.detailid!="" && rows.detailid!=undefined){
				param.detailid = rows.detailid;
				param.targetidxz = rows.targetid;
				upflg = true;
			}
			if(ylflg=="1"){ 
				 param.targetidxz = row1.targetid; 
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
	        param.state = state;
		},
		success:function(result){
			var result = eval('('+result+')');
			if(result.success){
				$("#targetid").val(result.targetid);
				rows['detailid'] = result.detailid;
				rows['targetid'] = result.targetid;
				rows['target'] = result.targetValue;
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
				$.ajax({//增减项目明细的保存成功的同时，在滚动计划表中同时增加一条对应数据
					url:virpath+'cnd01/getplanData?targetid='+result.targetid,
					type:'post',
					async: false,
					error:function(){
						Msgalert('错误','列获取失败','error');
					},
					success: function(result){
						ProcessEnd();
						var data = eval('('+result+')');
						var str = data.Strjosn;//获取数据
						var fd = eval(data.Frozcolumns);//画表结构
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
								columns:fd
//								onDblClickCell:editgdCell
							})
						}
					}
				});
				targetid=result.targetid;
			}else{
				//保存失败
				$.messager.alert('警告',"目标明细第"+(parseInt(mbEditIndex)+1)+"行，" + result.msg,'warning');
				$('#targetData').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
				mbEditFlag = true;
				ProcessEnd();
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
	if(!$('#cartypename').textbox("isValid") || !$('#target').numberbox("isValid") || !$('#approvername').combobox("isValid")) {
		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
   		return;
	}
	var rowindex =$('#targetData').datagrid('getRowIndex',row);
	editmbCell(rowindex);
}
//修改单元格(目标明细)
function editmbCell(index,field,value){
	debugger;
	return;
	if(!$('#cartypename').textbox("isValid") || !$('#target').numberbox("isValid") || !$('#approvername').combobox("isValid")) {
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
                    						columns:fd
//                    						onDblClickCell:editgdCell
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
		
	});
	columnxm.push({
		field : 'transmissionname',
		title : '<div id="divTransmissionname" style="line-height:30px;" >变速器</div>',
		halign : 'center',
		align: 'center',
		width : 120
		
	});
	columnxm.push({
		field : 'configname',
		title : '<div id="divConfigname" style="line-height:30px;" >配置</div>',
		halign : 'center',
		align: 'center',
		width : 120
		
	});
	columnxm.push({
		field : 'othervalue',
		title : '<div id="divOthervalue" style="line-height:30px;" >其他</div>',
		halign : 'center',
		align: 'center',
		width : 130,
		readonly:'true',
		
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
		columns : [columnxm]
//		onDblClickCell : editmbCell
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
//		onDblClickCell:function(index,field,value){
//	      	if(!detailflg){
//		        $(this).datagrid('endEdit', num2);
//				$(this).datagrid('beginEdit', index);
//				num2 = index;
//	      	}
//        }
	});

	$("#planData").datagrid('reload');
}
//提交
function doSubmit() {
	debugger;
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
				$('#detail').window('close');
				grid.datagrid('reload');
			} else {
				Msgalert('警告', result.msg, 'warning');
			}
		}
	})
}

function doSubmit_c(flg, id) {
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
						//grid2.datagrid('reload');
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
/*function editgdCell(index,field,value){
	debugger;
	return;
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
}*/
// 修改(滚动计划)
function Edit2(){
	return;
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
	return;
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
	return;
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
	                    						columns:fd
//	                    						onDblClickCell:editgdCell
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
	return;
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
	Save2();
//	Savemx1();
	Savemb();
	//Savemx1中的submit异步提交太慢了导致执行shunxu
	setTimeout(function(){
		if(!mbEditFlag){
			SaveLC1()
		}
	},500);
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
function SaveLC1(){
	var cartypename =  $("#cartypename").val();
	var approverid = $('#approvername').combobox('getValue');// 审批人id
	var approvername =  $("#approvername").combobox('getText');// 审批人
	var rows = $('#targetData').datagrid('getRows');
	var sopdate1 = "";
	var targetid = targetId;
	var powernames="";
	for(var i = 0;i<rows.length;i++){
			powernames+=rows[i].power+","
			sopdate1 = sopdate1 + (rows[i].sopdate +"")+",";
	}
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
			targetup1:target
		},
		success:function(result){
			ProcessEnd();
			var result = eval('('+result+')');
			if(result.success){
				$.messager.show({
					title:'成功',
					msg:result.msg,
					timeout:2000
				})
				$('#detail').dialog('close');
//				refresh();// 刷新
			}else{
				ProcessEnd();
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
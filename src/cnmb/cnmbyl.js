var grid;
var decImportwin;
var dlg_upload;
var gridtwo;
var histroy;
var targetData;
var planData;
var hisgrid;
var dlg_Edit;
var sop;
var sopxm;
var add_edit;
var add_edit_form;
var grid1;
var grid2;
var dlg_Edit_form;
var resetWin;
var resetWinForm;
var searchWin;
var searchForm;
var level_Edit;
var dlg_upload;
var dlg_upload_form;
var dlg_Edit2;
var num = 0;
var num2 = 0;
var gdjhsop;
var gdjhsop1;
var xmmxsop;
var upflg = false;
var detailflg = false;
var planidflg = false;
var editIndex=undefined;
var columns = new Array();
var columnxm = new Array();
var targetid;
var dataTargetid;
var editflg = false;
var ylflg="0"
var rowindexs = 0;
var sort=0;
var SaveLCflg = false;
// 目标明细编辑状态
var mbEditFlag = false;
// 滚动计划编辑状态
var gdEditFlag = false;
// 目标明细编辑行
var mbEditIndex = -1;
// 滚动计划编辑行
var gdEditIndex = -1;
var Addflgrows;
$(function () {
	$("#tdCartypename").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的项目名称，譬如CN180M，必填。'
	  });
	$("#tdTarget").tooltip({
		  position: 'bottom',    
		  content: '填写该车型总体产能目标，单位：台套/月，填写数字，不带单位，必填。'
	  });
	
	// 文件导入窗口
	 decImportwin=$('#decImport_win').dialog({
	    	closed:true,
	    	modal : true, 
	    	title : '用户信息批量上传',
	    });
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
	// 车型
	$("#cartypenameforsearch").combobox({
		url:virpath+'cnd01/getCarTypeList',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:true,
		limitToList:true
		
	});
	// 发布人
	$("#createname").combobox({
		url:virpath+'cnd01/getCreatorList',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:false
	});
	
	// 动力 查询
	$("#power").combobox({
		url:virpath+'cnd01/getPowerList',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:false
		
	});
	// 变速器
	$("#tranmissionname").combobox({
		url:virpath+'cnd01/getTransmissionList',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:false
		
	});
	// 配置
	$("#configname").combobox({
		url:virpath+'cnd01/getConfigList',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:false
		
	});
	
	// 车型 新增
/*
 * $("#cartypenamexz").combobox({ url:virpath+'cnd01/getcartype', valueField :
 * 'id', textField : 'text', panelHeight : 100, editable:true, required:true
 * 
 * }); //车型 修改 $("#cartypenamee").combobox({ url:virpath+'cnd01/getcartype',
 * valueField : 'id', textField : 'text', panelHeight : 100, editable:true,
 * required:true
 * 
 * });
 */
	$('#cartypenamexz').textbox({    
		required: true   
	})


	// 审批人approvername 新增
	$("#approvername").combobox({
		url:virpath+'cnd01/getapprovers',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:true,
		required:true,
		limitToList:true
	});
	
	// 审批人 修改
	$("#approvernamee").combobox({
		url:virpath+'cnd01/getapprovers',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:true,
		limitToList:true,
		required:true
		
	});
	//SQE 新增
	$("#SQEadd").combobox({
		url : virpath + 'Comm/GetSQECombo3b',
		editable:true,
		limitToList: true,
		valueField : 'id',
		textField : 'text',
		
	});
	//SQE 修改
	$("#SQEmodify").combobox({
		url : virpath + 'Comm/GetSQECombo3b',
		editable:true,
		limitToList: true,
		valueField : 'id',
		textField : 'text',
		
	});
	// 发布人 修改
	$("#createer").combobox({
		url:virpath+'cnd01/getcreateers',
		valueField : 'id',
		textField : 'text',
		panelHeight : 100,
		editable:true,
		required:true
		
	});
	 $('#sopdatee').datebox({// 共通
         editable:false,
         required:true,
         readonly:true,
         formatter: function (date) {  
             var y = date.getFullYear();  
             var m = date.getMonth() + 1; 
             var d = date.getDate();
             return y+'年'+(m < 10 ? ("0" + m) : m)+'月'+d+"日";
         }
     }); 
	
	
	  grid = $('#grid').datagrid({
	  url:virpath+'cnd01/getcnd01List?targetid='+msgType+'&SP1='+SP1,
      pageSize : 10,
      methord : 'post',
      pagination: true,
      rownumbers: true,
      fitColumns:true,
      singleSelect: true,
      striped : true,
      fit:true,
    
      columns: [[
                 { field: 'cartypeid', title: '车型ID' ,hidden:true},
                 { field: 'approverid', title: '审批人ID' ,hidden:true}, 
                 { field: 'sqeid', title: 'sqeID' ,hidden:true},
                 { field: 'sqename', title: 'sqe姓名' ,hidden:true},
                 { field: 'cartypename', title: '车型', halign: 'center',width: 150, align: 'center'},
                 { field: 'power', title: '动力', halign: 'center', width: 150,hidden:true },
                 { field: 'targetid', title: '产能目标ID' ,hidden:true, align: 'center'},                 
                 { field: 'target', title: '产能目标（台套）', halign: 'center', width: 120 , align: 'center'},
                 { field: 'sopdate', title: 'SOP日期', halign: 'center', width: 150, align: 'center',
                	 formatter:crtTimeFtt
                	 },
                 { field: 'remark', title: '备注', halign: 'center', width: 200 },
                 { field: 'state', title: '状态', halign: 'center', width: 100, align: 'center' },
                 { field: 'createername', title:'发布人', halign: 'center', width: 100 },
                 { field: 'createdate', title: '发布日期', halign: 'center', width: 100, align: 'center'},  
                 { field: 'approvername', title: '审批人', halign: 'center', width: 100    , align: 'center'},
                 { field: 'approvedate', title: '审批日期', halign: 'center', width: 100, align: 'center'}
                
         ]],
         rowStyler: function (index, row) {
             if (row.status == '2') {
                 return 'background-color:#ccc;';
             }
         },
         toolbar:[{
             text: '新增',
             iconCls: 'icon-add',
             handler: add
         }, '-', {
             text: '修改',
             iconCls: 'icon-edit',
             handler: edit
         }, '-', {
             text: '详细',
             iconCls: 'icon-Bill',
             handler: detail
         },   '-', {
             text: '导入',
             iconCls: 'icon-upload',
             handler: infoImport
         }, '-', {
             text: '导出',
             iconCls: 'icon-xlsx',
             handler: exp
         }, '-', {
             text: '删除',
             iconCls: 'icon-remove',
             handler: deleteAllYL
         }, '-', {
             text: '查询',
             iconCls: 'icon-search',
             handler: search
         }
         ,'-',{
         	text:'刷新',
         	iconCls:'icon-reset',
         	handler:refresh
         }],
         onSelect : function(rowIndex, rowData) {
  			getDetail();
  		},
     	 onLoadSuccess: function (data) {
     		var dataTargetid;
     		if (data.rows.length > 0) {
 				$("#grid").datagrid('selectRow', 0);
 				dataTargetid = $("#grid").datagrid("getSelected").targetid;
 			}
     		 if(dataTargetid!=undefined){
     			$.ajax({
     				url:virpath+'cnd01/gettargetDetail?targetid='+dataTargetid,
     				type:'post',
     				error:function(){
     					Msgalert('错误','列获取失败','error');
     				},
     				success: function(result){
     					var data = eval('('+result+')');
     					var str = data.Strjosn;// 获取数据
     					var fd = eval(data.Frozcolumns);// 画表结构
     					if(data.success){
     						targetData = $('#targetData').datagrid({
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
     				     				url:virpath+'cnd01/getplanData?targetid='+dataTargetid,
     				     				type:'post',
     				     				error:function(){
     				     					Msgalert('错误','列获取失败','error');
     				     				},
     				     				success: function(result){
     				     					var data = eval('('+result+')');
     				     					var str = data.Strjosn;// 获取数据
     				     					var fd = eval(data.Frozcolumns);// 画表结构
     				     					if(data.success){
     				     			      	planData = $('#planData').datagrid({
     				     							data:$.parseJSON(str),
     				     							pageSize : 10,
     				     					        methord : 'post',
     				     					        pagination: false,
     				     					        rownumbers: true,
     				     					        singleSelect: true,
     				     					        striped : true,
     				     					        fit:true,
     				     							columns:fd
     				     						})
     				     					}
     				     				}
     				     			});
     							}
     						})
     					}
     				}
     			});
     		 }else{
     			 if (targetData){
     				 $('#targetData').datagrid('loadData', { total: 0, rows: [] });
     			 }
     			 if (planData){
     				$('#planData').datagrid('loadData', { total: 0, rows: [] });
     			 }
     			
     		 }
     		 
     	 },
         onDblClickRow:function(rowIndex,rowData){
        	 if(rowData.state=="已保存" || rowData.state=="经理驳回" ||rowData.state=="结束"){
        		 edit();
        	 }else{
        		 detail();
        	 }
         }
    	
    });
    // 编辑或新增
	   var totalHeight = $(window).height()-48;
	// $('#taskDetail').height(totalHeight-37+'px');
    add_edit = $('#add_edit').dialog({
        closed: true,
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        height:totalHeight,
     
    });
    add_edit_form = add_edit.find('form');
    
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
    // SopSurexm();//项目明细动态
    // SopSure();//滚动计划动态
  // 导入窗口中的datagrid1
  // 画上传表
    gridtwo = $('#gridtwo').datagrid({
       // title: '可导入文件一览',
        iconCls: 'icon-Bill',
        methord: 'post',
        url : virpath + '/cnd01/getDecFileData',
       // data:$.parseJSON(str1),
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
    // data:$.parseJSON(str2),
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
// formatter: function (value, rec) {
// return rec.remark.split(",")[0];
// }
                    },
                    { field: 'updateerid', title: '导入者', width: 70, align: 'center',
// formatter: function (value, rec) {
// return rec.remark.split(",")[1];
// }
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
});
function Sch(){
	var search =true;
	var cartypename = $("#cartypenameforsearch").combobox('getText');
//	var power = $("#power").combobox('getText');
	var power = $("#power").combobox('getValue');
	var transmissionname=$("#tranmissionname").combobox('getValue');
	var configname=$("#configname").combobox('getValue')
	var other=$("#other").val();
	var createname=$("#createname").combobox('getText');
	var startTime=$("#startTime").datebox('getValue');
	var endTime=$("#endTime").datebox('getValue');
	var state=$("#state").combobox('getValue');
	grid.datagrid('reload',{
			search:search,
			cartypename:cartypename,
			power:power,
			transmissionname:transmissionname,
			configname:configname,
			other:other,
			createname:createname,
			startTime:startTime,
			endTime:endTime,			
			state:state
		}
	);
	$('#cc').layout('collapse','north');
}

// 导入
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
function upLoadFileSubmit() {
	dlg_upload_form.form('submit', {
		url : dlg_upload_form.url,
		onSubmit : function(param) {
			if(ylflg=="1"){
				var cartypenamee= $('#cartypenamee').textbox("getValue");
				param.cartypenamee = cartypenamee;
			}
			
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
        	   // 上传文件界面
        	   gridtwo.datagrid('reload');
        	   histroy.datagrid('reload');
        	    $("#cartypenamee").textbox('setValue',result.cartypename);
       		    $('#approvernamee').combobox('setValue',result.approvername);// 审批人id
       		    $('#targete').numberbox('setValue',result.target);// 产能目标上
       		    $('#remarke').textbox('setValue',result.remark);
        	   $('#grid').datagrid('reload');
        	   $.ajax({
          			url:virpath+'cnd01/gettargetDetail?targetid='+result.targetid,
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
          						onDblClickCell : editmbCell
          					})
          				}
          			}
          		});
          		$.ajax({
          			url:virpath+'cnd01/getplanData?targetid='+result.targetid,
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
          					$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
          				}
          				if(data.success && str!=""){
          					$("#grid2").datagrid({
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
// 新增
function add() {
	sort=0;
	ylflg="0";
	editflg = false;
	// 目标明细编辑状态
	mbEditFlag = false
	// 滚动计划编辑状态
	gdEditFlag = false
	SaveLCflg = false;

	add_edit.dialog('setTitle','新增产能目标信息');
	$("#title").html("新增产能目标信息");
	 
	// add_edit.dialog('open');
	add_edit.window('open').window('center');
	add_edit_form.form('clear');
	$("#publish").show();
	$("#editPublish").hide();
	$("#detail").hide();
	
	$("#DetailrollPlan").hide();
	$("#AddrollPlan").show();
	
	$("#detailTarget").hide();
	
	$("#AddDetail").show();
	$("#editDetail").hide();

	$("#Addtarget").show();
	$("#editTarget").hide();
	 SopSurexm();// 项目明细动态
	 SopSure();// 滚动计划动态
	 $("#divPower1").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的发动机类型：譬如：B15、N15T，必填。'
	});
//	 TODO
	$("#divTransmissionname").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的变速器类型，譬如：6MT、DCT，必填。'
	});
	$("#divConfigname").tooltip({
		  position: 'bottom',    
		  content: '填写该车型的配置类型，譬如：LV0、LV1，必填。'
	});
	$("#divOthervalue").tooltip({
		  position: 'bottom',    
		  content: '根据需要填写，譬如国五、5座等，选填。'
	});
	$("#divSopdate").tooltip({
		  position: 'bottom',    
		  content: '下拉选择该车型首款配置SOP时间，必填。。'
	});
	$("#divRatio").tooltip({
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
//	 titlename();
//	var columnsMea = supplierMeasure.datagrid('options').columns;
	 
//	$("#grid1").datagrid('loadData', { total: 0, rows: [] });
$("#grid2").datagrid('loadData', { total: 0, rows: [] });
	
}

// 修改
function edit() {
//	TODO
	ylflg="1";
	detailflg = false;
	editflg = true;
	// 目标明细编辑状态
	mbEditFlag = false;
	// 滚动计划编辑状态
	gdEditFlag = false;
	SaveLCflg = false;
	var rows = grid.datagrid('getSelections');
	if(rows[0].state!="已保存" && rows[0].state!="经理驳回" && rows[0].state!="结束"){
		detail();
		return;
	}
	if(rows.length==0){
		 $.messager.alert('警告', '请选择一条记录进行操作！');
		return;
	}else{
		//
		// $("#cartypename1").combobox("setValue",rows[0].cartypename);
	// add_edit_form.form('load',rows[0]);
		add_edit_form.form('clear');
		add_edit.window('open').window('center');
		add_edit.dialog('setTitle','修改产能目标信息');
		$("#title").html("修改产能目标信息");

		$("#publish").hide();
		$("#editPublish").show();
		$("#detail").hide();
		$("#DetailrollPlan").hide();
		$("#AddrollPlan").show();
		$("#detailTarget").hide();
		$("#AddDetail").show();
		$("#editDetail").hide();
		$("#Addtarget").hide();
		$("#editTarget").show();
		
		SopSurexm();// 项目明细动态
		SopSure();// 滚动计划动态
		/* $("#divPower1").tooltip({
			  position: 'bottom',    
			  content: '填写该车型的发动机类型：譬如：B15、N15T，必填。'
		});
		$("#divTransmissionname").tooltip({
			  position: 'bottom',    
			  content: '填写该车型的变速器类型，譬如：6MT、DCT，必填。'
		});
		$("#divConfigname").tooltip({
			  position: 'bottom',    
			  content: '填写该车型的配置类型，譬如：LV0、LV1，必填。'
		});
		$("#divOthervalue").tooltip({
			  position: 'bottom',    
			  content: '根据需要填写，譬如国五、5座等，选填。'
		});
		$("#divSopdate").tooltip({
			  position: 'bottom',    
			  content: '下拉选择该车型首款配置SOP时间，必填。。'
		});
		$("#divRatio").tooltip({
			  position: 'bottom',    
			  content: '填写每个动力配置产能目标在总体产能目标中所占比例，单位：%，带单位，必填。'
		});*/
//		titlename();
//		$('#targetid').val(rows[0].cartypeid);
		$('#cartypenamee').textbox('setValue',rows[0].cartypename);
		if(rows[0].state=="已审批"){
			$('#cartypenamee').textbox('readonly',true);
		}
		$('#SQEmodify').combobox('setText',rows[0].sqename);
		$('#SQEmodify').combobox('setValue',rows[0].sqeid);
		$('#approvernamee').combobox('setValue',rows[0].approverid);
		$("#targete").numberbox('setValue',rows[0].target);// 产能目标
		// $("#powere").textbox('setValue',rows[0].power);//动力
		$("#createere").textbox('setValue',rows[0].createername);// 发布人
		$("#createdatee").textbox('setValue',rows[0].createdate);// 发布日期
		$("#approverdatee").val(rows[0].approvedate);// 审批日期
		$("#remarke").textbox('setValue',rows[0].remark);// 审批日期
		$("#sopdatee").datebox('setValue',rows[0].sopdate);
		targetid=rows[0].targetid;
	   // grid1.datagrid('reload');
		$.ajax({
			url:virpath+'cnd01/gettargetDetail?targetid='+targetid,
			type:'post',
			error:function(){
				Msgalert('错误','列获取失败','error');
			},
			success: function(result){
				var data = eval('('+result+')');
				var str = data.Strjosn;// 获取数据
				var fd = eval(data.Frozcolumns);// 画表结构
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
						 onDblClickCell:editmbCell, 
						onLoadSuccess: function(data){
						titlename();
						}
					})
				}
			}
		});
		$.ajax({
			url:virpath+'cnd01/getplanData?targetid='+targetid,
			type:'post',
			error:function(){
				Msgalert('错误','列获取失败','error');
			},
			success: function(result){
				var data = eval('('+result+')');
				var str = data.Strjosn;// 获取数据
				var fd = eval(data.Frozcolumns);// 画表结构
				if(str==""){
					$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
				}
				if(data.success && str!=""){
					$("#grid2").datagrid({
						data:$.parseJSON(str),
						pageSize : 10,
				        methord : 'post',
				        pagination: false,
				        rownumbers: true,
				        singleSelect: true,
				        striped : true,
				        fit:true,
						columns:fd,
						onDblClickCell:editgdCell,
						onLoadSuccess: function(data){
							
						}
					})
				}
			}
		});
	}
	$("#grid1").datagrid('loadData', { total: 0, rows: [] });
	/*$(".sopftile").tooltip({
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
	});*/
}
// 详细
function detail(){
	detailflg = true;
	var rows = grid.datagrid('getSelections');
	if(rows.length==0){
		 $.messager.alert('警告', '请选择一条记录进行操作！');
		return;
	}else{
		//
		// $("#cartypename1").combobox("setValue",rows[0].cartypename);
	// add_edit_form.form('load',rows[0]);
		// add_edit.dialog('open');
		add_edit.window('open').window('center');
		add_edit.dialog('setTitle','详细');
		$("#title").html("产能目标详细");

		$("#publish").hide();
		$("#editPublish").hide();
		$("#detail").show();
		$("#DetailrollPlan").show();
		$("#AddrollPlan").hide();
		
		$("#AddDetail").hide();
		$("#editDetail").show();
		$("#detailTarget").show();
		$("#Addtarget").hide();
		$("#editTarget").hide();
		
		$("#cartypenamed").textbox('setValue',rows[0].cartypename);
		// $("#powerd").textbox('setValue',rows[0].power);//动力
		$("#targetd").textbox('setValue',rows[0].target);// 产能目标
		$("#sopdated").textbox('setValue',rows[0].sopdate);// sop日期
		$("#createerd").textbox('setValue',rows[0].createername);// 发布人
		$("#createdated").textbox('setValue',rows[0].createdate);// 发布日期
		$("#approvernamed").textbox('setValue',rows[0].approvername);// 审批人
		/* $("#approverdated").textbox('setValue',rows[0].approvedate); */// 审批日期
		$("#remarkd").textbox('setValue',rows[0].remark);// 备注
		$("#SQEdetail").textbox('setValue',rows[0].sqename);// SQE
		 $('#sopdated').datebox({// 共通
	         editable:false,
	         required:true,
	         readonly:true,
	         formatter: function (date) {  
	             var y = date.getFullYear();  
	             var m = date.getMonth() + 1;  
	             var d = date.getDate();
	             return y+'年'+(m < 10 ? ("0" + m) : m)+'月'+d+"日";
	         }
	     });
		targetid=rows[0].targetid;
		$.ajax({
			url:virpath+'cnd01/gettargetDetail?targetid='+targetid,
			type:'post',
			error:function(){
				Msgalert('错误','列获取失败','error');
			},
			success: function(result){
				var data = eval('('+result+')');
				var str = data.Strjosn;// 获取数据
				var fd = eval(data.Frozcolumns);// 画表结构
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
						onDblClickCell:function(data){
							
						}
					})
				}
			}
		});
		$.ajax({
			url:virpath+'cnd01/getplanData?targetid='+targetid,
			type:'post',
			error:function(){
				Msgalert('错误','列获取失败','error');
			},
			success: function(result){
				var data = eval('('+result+')');
				var str = data.Strjosn;// 获取数据
				var fd = eval(data.Frozcolumns);// 画表结构
				if(str==""){
					$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
				}
				if(data.success && str!=""){
					$("#grid2").datagrid({
						data:$.parseJSON(str),
						pageSize : 10,
				        methord : 'post',
				        pagination: false,
				        rownumbers: true,
				        singleSelect: true,
				        striped : true,
				        fit:true,
						columns:fd,
						onDblClickCell:function(data){
							
						}
					})
				}
			}
		});
	}
}

// 删除
function del() {}
// 详细导出
function doSubmit_c(){
	var row = grid.datagrid('getSelected');
	$.messager.progress({
		title : '请稍后',
		msg : '数据导入中...'
	});
	var targetid = row.targetid;
	ProcessStart();
	$.ajax({
		url: virpath + "cnd01/ExportBuyId?targetid="+targetid,
		type:'post',
		
		success : function(data) {
			ProcessEnd();
			$.messager.progress('close');
			var result = eval(" ( " + data + " ) ");
			DownLoadFile(result);
		}
	});
}
function getShortvalue() {
	return "";
}
// 导出
function exp(){
	var cartypename = $("#cartypenameforsearch").combobox('getText')
	var power = $("#power").combobox('getValue');
	var transmissionname=$("#tranmissionname").combobox('getValue');
	var configname=$("#configname").combobox('getValue')
	var other=$("#other").val();
	var createname=$("#createname").combobox('getText')
	var startTime=$("#startTime").combobox('getValue');
	var endTime=$("#endTime").combobox('getValue');
		var state=$("#state").combobox('getValue');
	var rows=grid.datagrid('getRows');
	if(rows==0){
		$.messager.alert('警告','没有记录可以导出。','warning');
		return;
	}
	
	var params = grid.datagrid('options').queryParams;
	var form = $('<form></form>');
	form.attr('action', virpath + 'cnd01/cndExport?cartypename='+cartypename+'&power='+power+
			'&transmissionname='+transmissionname+'&configname='+configname+'&other='+other+
			'&createname='+createname+'&startTime='+startTime+'&endTime='+endTime+'&state='+state);
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
// 刷新主表
function refresh(){
	
	grid.datagrid('reload');
	$('#targetData').datagrid('reload');
	$('#planData').datagrid('reload');
	
}

function refreshdr(){
	gridtwo.datagrid('reload');
    histroy.datagrid('reload');
	
}

// 查询
function search(){
	$('#cc').layout('expand','north');
	}
// 重置
function reset(){
	$("#sch").form('clear');
}


function getDetail(){
    var rows = grid.datagrid('getSelections');
    $.ajax({
		url:virpath+'cnd01/gettargetDetail?targetid='+rows[0].targetid,
		type:'post',
		error:function(){
			Msgalert('错误','列获取失败','error');
		},
		success: function(result){
			var data = eval('('+result+')');
			var str = data.Strjosn;// 获取数据
			if(str==null){	
				$("#targetData").datagrid("loadData",[]);
			}else{
				var fd = eval(data.Frozcolumns);// 画表结构
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
						onLoadSuccess: function(data){
							
						}
					})
				}
			}
		
		}
	});
    $.ajax({
		url:virpath+'cnd01/getplanData?targetid='+rows[0].targetid,
		type:'post',
		error:function(){
			Msgalert('错误','列获取失败','error');
		},
		success: function(result){
			var data = eval('('+result+')');
			var str = data.Strjosn;// 获取数据
			var fd = eval(data.Frozcolumns);// 画表结构
			if(str==""){
			// $('#planData').datagrid('loadData', { total: 0, rows: [] });
			} else {
			if(data.success && str!="") {
				planData = $('#planData').datagrid({
					data:$.parseJSON(str),
					pageSize : 10,
			        methord : 'post',
			        pagination: false,
			        rownumbers: true,
			        singleSelect: true,
			        striped : true,
			        fit:true,
					columns:fd
				})
			}
			}
		}
	});
}

function SopTime(){
	if(checkDate()){
		return;
	}
	sop.dialog('open');
	sop.dialog('setTitle',"时间设定");
	$("#ss1").numberspinner('setValue',gdjhsop1);
	$("#ss").numberspinner('setValue',gdjhsop);
}
function SopTimexm(){
	if(checkDate()){
		return;
	}
	sopxm.dialog('open');
	sopxm.dialog('setTitle',"时间设定");
	$("#ss1xm").numberspinner('setValue',ss1xm);
	$("#ssxm").numberspinner('setValue',xmmxsop);
}
// 项目明细动态生成表格
function SopSurexm(){
	 columnxm.length=0;
     columnxm.push({ field: 'otherid', title: '其他ID' ,hidden:true});
     columnxm.push({ field: 'powerid', title: '动力ID' ,hidden:true});
     columnxm.push({ field: 'transmissionid', title: '变速器ID' ,hidden:true});
	 columnxm.push({ field: 'configid', title: '配置ID' ,hidden:true}); 
     columnxm.push({ field: 'otherid', title: '其他ID' ,hidden:true});
	 columnxm.push({ field: 'planid', title: '滚动计划ID' ,hidden:true});
	 columnxm.push({ field: 'targetid', title: '产能目标ID' ,hidden:true});
	 columnxm.push({ field: 'detailid', title: '产能明细ID' ,hidden:true});
	 columnxm.push({ field: 'sopvaluesort', title: '排序' ,hidden:true});
	 columnxm.push({ field: 'power', title: '<div id="divPower1" style="line-height:30px;" >动力(<span style="color:red">*</span>)</div>', halign: 'center', width: 100,
	  	   editor:{
	  	  	   type:'combobox',
	  	  		  options:{
	  	  			  url:virpath+'cnd01/getPowerList',
	  	  			  valueField : 'text',
	  	  		      textField : 'text',
	  	  			  panelHeight : 100,
	  		              required : true,
	  		              editable : true,
	  		              onSelect:powerChange
	  	  	 }
	  	     } });
//	 TODU
	 columnxm.push({ field: 'transmissionname', title: '<div id="divTransmissionname" style="line-height:30px;" >变速器(<span style="color:red">*</span>)</div>', halign: 'center', width: 120,
  	   editor:{
    	   type:'combobox',
    		  options:{
    			  url:virpath+'cnd01/getTransmissionList',
    			  valueField : 'text',
    		      textField : 'text',
  	              panelHeight : 100,
  	              required : true,
  	              editable : true,
  	              onSelect:tranChange
    	 }
       }  });
//	 TODO
	 columnxm.push({ field: 'configname', title: '<div id="divConfigname" style="line-height:30px;" >配置(<span style="color:red">*</span>)</div>', halign: 'center', width: 120 ,
  	   editor:{
    	   type:'combobox',
    		  options:{
    			  url:virpath+'cnd01/getConfigList',
    			  valueField : 'text',
    		      textField : 'text',
  	              panelHeight : 100,
  	              required : true,
  	              editable : true,
                    onSelect:configChange
    	 }
       }  });
	 columnxm.push({ field: 'othervalue', title: '<div id="divOthervalue" style="line-height:30px;" >其他</div>', halign: 'center', width: 130,
  	   editor:{
    	   type:'combobox',
    		  options:{
    			  url:virpath+'cnd01/getcxqt',
    			  valueField : 'text',
    		      textField : 'text',
  	              panelHeight : 100,
  	              editable : true,
  	              required : false,
  	              onSelect:otherChange
    	 }
       } });
	 columnxm.push({ field: 'sopdate', title: '<div id="divSopdate" style="line-height:30px;" >SOP日期(<span style="color:red">*</span>)</div>', halign: 'center', width: 150,
	  	   editor:{
	    	   type:'datebox',
	    		  options:{
	  	            required : true,
	  	            editable : false,
	  	            formatter:formatter,
	  	            parser:parser
	    	 }
	  } });
	 columnxm.push({ field: 'ratio', title: '<div id="divRatio" style="line-height:30px;" >比例(%)</div>', halign: 'center', width: 120,
  	      editor:{
  		  type:'textbox',
  		  options:{
  			  required : false
  		  }
  	  } });
	 columnxm.push({ field: 'target', title: '产能目标</br>（台套）', halign: 'center', width: 130,
		 editor:{
	  		  type:'numberbox',
	  		  options:{
	  			  required : false
	  		  }
	  	  }
		 });
	 /*columnxm.push({ field: 'sopm6value', title: 'SOP-6', halign: 'center', width: 130,
		 editor:{
	  		  type:'numberbox',
	  		  options:{
	  			  required : false
	  		  }
	  	  }
		 });*/
	 ss1xm = $('#ss1xm').numberspinner('getValue');
	 xmmxsop = $('#ssxm').numberspinner('getValue');
	if(xmmxsop==""){
		ss1xm=-6;
		xmmxsop=6;
		var myDate=new Date()
		for(var i = ss1xm;i<=xmmxsop;i++){
		var column = {};
		if(i<0){
			column.field = 'sopm'+Math.abs(i)+'value';
//			column.title = 'SOP'+i;
			column.title = '<div class="sopftile" style="line-height:30px;" >SOP'+i+'</div>'
		
		}else if(i==0){
			column.field = 'sopvalue';
//			column.title = 'SOP';
			column.title = '<div class="sopltile" style="line-height:30px;" >SOP</div>'
			
		}else{
			column.field = 'sopp'+i+'value';
//			column.title = 'SOP+'+i;
			column.title = '<div class="sopztile" style="line-height:30px;" >SOP+'+i+'</div>'
		}
		column.width = 100;
	    column.halign = 'center';
	    column.align = 'center';
	    column.editor={ type:'numberbox', options:{ required : false, } }
	    columnxm.push(column);
		}
		$('#grid1').datagrid({
			pageSize : 10,
	        methord : 'post',
	        pagination: false,
	        rownumbers: true,
	        singleSelect: true,
	        striped : true,
	        fit:true,
			columns:[columnxm],
			onDblClickCell:editmbCell
		});
	}else{
		for(var i = ss1xm;i<=xmmxsop;i++){
			var column = {};
			if(i<0){
				column.field = 'sopm'+Math.abs(i)+'value';
//				column.title = 'SOP'+i;
				column.title = '<div class="sopftile" style="line-height:30px;" >SOP'+i+'</div>'
			
			}else if(i==0){
				column.field = 'sopvalue';
//				column.title = 'SOP';
				column.title = '<div class="sopltile" style="line-height:30px;" >SOP</div>'
				
			}else{
				column.field = 'sopp'+i+'value';
//				column.title = 'SOP+'+i;
				column.title = '<div class="sopztile" style="line-height:30px;" >SOP+'+i+'</div>'
			}
			column.width = 100;
		    column.halign = 'center';
		    column.align = 'center';
		    column.editor={ type:'numberbox', options:{ required : false, } }
		    columnxm.push(column);
		}
		sopxm.dialog('close');
		$('#grid1').datagrid({
			pageSize : 10,
	        methord : 'post',
	        pagination: false,
	        rownumbers: true,
	        singleSelect: true,
	        striped : true,
	        fit:true,
			columns:[columnxm],
			onDblClickCell:editmbCell
		});
		/*
		 * $('#grid1').datagrid({ columns:[columnxm]
		 * ,onDblClickCell:function(index,field,value){ if(!detailflg){ var a =
		 * $('#grid1').datagrid('validateRow', rowindexs) if(!a){
		 * $.messager.alert('温馨提示', '上一行有必填项还有填写！', 'info'); return; }else{
		 * $(this).datagrid('endEdit', rowindexs); $(this).datagrid('beginEdit',
		 * index); rowindexs = index; } } } });
		 */
		 
	}
		if(ylflg=="0"){
			if(Addflgrows=='null'){//大保存之後Addflgrows會賦值成null
				$("#grid1").datagrid('loadData', { total: 0, rows: [] });
				for (var i=0;i<6;i++){
					$('#grid1').datagrid('appendRow',{});
				}
				$('#grid1').datagrid('acceptChanges');
			}else if(Addflgrows==undefined){//新增時
				Addflgrows = $('#grid1').datagrid('getRows')[mbEditIndex];
				if(Addflgrows){//新增一條項目明細保存之後修改時間設定
					$.ajax({
						url:virpath+'cnd01/gettargetDetail?targetid='+Addflgrows.targetid,
						type:'post',
						error:function(){
							Msgalert('错误','列获取失败','error');
						},
						success: function(result){
							var data = eval('('+result+')');
							var str = data.Strjosn;// 获取数据
							var fd = eval(data.Frozcolumns);// 画表结构
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
									onLoadSuccess: function(data){
									titlename();
									for (var i=0;i<6-1-mbEditIndex;i++){
										$('#grid1').datagrid('appendRow',{});
									}
									}
								})
							}
						}
					});
			}else{
				$("#grid1").datagrid('loadData', { total: 0, rows: [] });
				for (var i=0;i<6;i++){
					$('#grid1').datagrid('appendRow',{});
				}
				$('#grid1').datagrid('acceptChanges');
			}
			
			}
			
		}else{
			$("#grid1").datagrid('reload');
		}
		Addflgrows='null';

}

// 滚动计划动态生成表格
function SopSure(){
	 columns.length=0;
	 columns.push({ field: 'configid', title: '配置ID' ,hidden:true}); 
     columns.push({ field: 'otherid', title: '其他ID' ,hidden:true});
     columns.push({ field: 'transmissionid', title: '变速器ID' ,hidden:true}); 
	 columns.push({ field: 'planid', title: '滚动计划ID' ,hidden:true});
	 columns.push({ field: 'targetid', title: '产能目标ID' ,hidden:true});
	 columns.push({ field: 'detailid', title: '产能明细ID' ,hidden:true});
	 columns.push({ field: 'power', title: '动力', halign: 'center',align:'center', width: 100 });
	 columns.push({ field: 'transmissionname', title: '变速器', halign: 'center',align:'center', width: 120 });
	 columns.push({ field: 'configname', title: '配置', halign: 'center',align:'center', width: 120 });
	 columns.push({ field: 'othervalue', title: '其他', halign: 'center',align:'center', width: 130 });
	
	 gdjhsop1 = $('#ss1').numberspinner('getValue');
	 gdjhsop = $('#ss').numberspinner('getValue');
	
	if(gdjhsop==""){
		gdjhsop1=-1;
		gdjhsop=6;
		var myDate=new Date()
		for(var i = gdjhsop1;i<=gdjhsop;i++){
			var column = {};
			if(i<0){
				column.field = 'sopm'+Math.abs(i)+'value';
				column.title = 'SOP'+i;
				
			}else if(i==0){
				column.field = 'sopvalue';
				column.title = 'SOP';
				
			}else{
				column.field = 'sopp'+i+'value';
				column.title = 'SOP+'+i;
			}
		column.width = 100;
	    column.halign = 'center';
	    column.align = 'center';
	    column.editor={ type:'numberbox', options:{ required : false, } }
	    columns.push(column);
		}
		$('#grid2').datagrid({
		    	 pageSize : 10,
		         methord : 'post',
		         pagination: false,
		         rownumbers: true,
		         singleSelect: true,
		         striped : true,
		         fit:true,
         		columns: [columns],
         		onDblClickCell:Edit2
	            /*  onDblClickCell:function(index,field,value){
	            	  if(!detailflg){
	                	  $(this).datagrid('endEdit', num2);
	   		       		  $(this).datagrid('beginEdit', index);
	   		        	  num2 = index;
	            	  }
	  	         }*/
		      });
		    
	}else{
		/*
		 * var numMax=0; var rows=$('#grid1').datagrid('getRows');//获取目标明细所有数据
		 * for(var i=0;i<rows.length;i++){ if(rows[i].sopp12value!=""){ Maxsop =
		 * 12; }else if(rows[i].sopp11value!=""){ Maxsop = 11; }else
		 * if(rows[i].sopp10value!=""){ Maxsop = 10; }else
		 * if(rows[i].sopp9value!=""){ Maxsop = 9; }else
		 * if(rows[i].sopp8value!=""){ Maxsop = 8; }else
		 * if(rows[i].sopp7value!=""){ Maxsop = 7; }else
		 * if(rows[i].sopp6value!=""){ Maxsop = 6; } if(numMax<Maxsop){//去最大列数
		 * numMax= Maxsop; }
		 *  }
		 */
		
		
		/*
		 * var numMax=0; var rowsG1=$('#grid1').datagrid('getRows'); var
		 * sopfield; var soptitle; for(var i=0;i<rowsG1.length;i++){ var
		 * columns = $('#grid1').datagrid("options").columns; for(var
		 * j=columns[0].length-1;j>=0;j--){
		 * if(rowsG1[i][columns[0][j].field]!=""){ Maxsop =
		 * columns[0][j].title.substring(4); } if(numMax<Maxsop){//去最大列数
		 * numMax= Maxsop; } } }
		 */
		
		
		
		
		
		/*
		 * if(v<numMax){ $.messager.alert('温馨提示', '时间设定的列数不能小于目标明细中填写的最大列数',
		 * 'info'); return; }
		 */
		for(var i = gdjhsop1;i<=gdjhsop;i++){
			var column = {};
			if(i<0){
				column.field = 'sopm'+Math.abs(i)+'value';
				column.title = 'SOP'+i;
				
			}else if(i==0){
				column.field = 'sopvalue';
				column.title = 'SOP';
				
			}else{
				column.field = 'sopp'+i+'value';
				column.title = 'SOP+'+i;
			}
			
			column.width = 100;
		    column.halign = 'center';
		    column.align = 'center';
		    column.editor={ type:'numberbox', options:{ required : false, } }
		    columns.push(column);
		}
		sop.dialog('close');
		$('#grid2').datagrid({
		    	 pageSize : 10,
		         methord : 'post',
		         pagination: false,
		         rownumbers: true,
		         singleSelect: true,
		         striped : true,
		         fit:true,
		        columns: [columns],
		        onDblClickCell:Edit2
		                  /*onDblClickCell:function(index,field,value){
		                	  if(!detailflg){
			                	  $(this).datagrid('endEdit', num2);
			   		       		  $(this).datagrid('beginEdit', index);
			   		        	  num2 = index;
		                	  }
		      	         }*/
		      });
		    
		
		  $('#grid2').datagrid('reload');
		  $('#grid2').datagrid('clearSelections');
	}
	/*if(ylflg=="0"){
		$("#grid2").datagrid('loadData', { total: 0, rows: [] });
	}else{
		$("#grid2").datagrid('reload');
	}*/
}

// 流程保存
function SaveLC(isSubmit){
	Savexm();
	Save2();
	if(mbEditFlag==true){
		return;
	}
	if(editflg){// 修改
		//改下面那个bug加的。修改进来时默认选中一行
		$('#grid1').datagrid('selectRow',0);
		var cartypename =  $("#cartypenamee").val();
		var approverid = $('#approvernamee').combobox('getValue');// 审批人id
		var approvername =  $("#approvernamee").combobox('getText');// 审批人
		var targetup = $('#targete').val();// 产能目标上
		var remark=$('#remarke').val();
		var sqename=$("#SQEmodify").combobox('getText');
		var sqeid=$("#SQEmodify").combobox('getValue');
	}else{// 新增
		var cartypename =  $("#cartypenamexz").val();
		var approverid = $('#approvername').combobox('getValue');// 审批人id
		var approvername =  $("#approvername").combobox('getText');// 审批人
		var targetup = $('#target').val();// 产能目标上
		var remark=$('#remark').val();
		var sqename=$("#SQEadd").combobox('getText');
		var sqeid=$("#SQEadd").combobox('getValue');
	}
	 if(cartypename==""||approverid==""||approvername==""||targetup=="") {
   		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
   		return;
	}
	SaveLCflg = true;
	Addflgrows = 'null';
	$('#grid1').datagrid('endEdit', mbEditIndex);
	var a = $('#grid1').datagrid('validateRow', mbEditIndex)// 判断必填项是否都填写了
	if(!a){
		 $.messager.alert('温馨提示', '目标明细必填项不能为空！', 'info');
	     return;
	}
	
	var rows = $('#grid1').datagrid('getSelections');
	var sopdate1 = "";
	//var targetid = row.targetid;
	var powernames="";
	for(var i = 0;i<rows.length;i++){
		if(rows[i].detailid!="" && rows[i].detailid!=undefined){
			powernames+=rows[i].power+","
			sopdate1 = sopdate1 + (rows[i].sopdate +"")+",";
		}
		/*
		 * else{ $.messager.alert('温馨提示', '项目明细中还有数据没有保存！', 'info'); return; }
		 */
	}
	//新增产能目标保存之后再发布这里会弹出来。在刚进入这里时默认选中一下datagrid。
	if(powernames==""){
		$.messager.alert('温馨提示', '请填写项目明细！', 'info');
		return;
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
			targetup1:targetup,
			sqename:sqename,
			sqeid:sqeid
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
				add_edit.dialog('close');
				refresh();// 刷新
				}
			}else{
				$.messager.alert('警告',result.msg,'warning');
				return;
			}
		}
	})
}

function length(str){
	if(str.length>10){
		$.messager.alert('温馨提示', '	SOP的值：请输入10位以内的数字！', 'info');
		mbEditFlag = true;
		return false;
	}else{
		return true;
	}
}
// 新增，表一的保存
function Savexm(addIndex){
	// 判断必填项是否都填写了
 //var validate = $('#grid1').datagrid('validateRow', mbEditIndex)
	if(!mbEditFlag){
		return;
	}
	$('#grid1').datagrid('endEdit', mbEditIndex);
	mbEditFlag = false;
	var rows = $('#grid1').datagrid('getRows')[mbEditIndex];
	// 验证有误
	if(checkRow(rows)){
		$.messager.alert('温馨提示', '目标明细第'+(parseInt(mbEditIndex)+1)+'行，必填项目不能为空！', 'warning');
		$('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
		mbEditFlag = true;
		return;
	}
	
	if(editflg){// 修改
		var cartypename =  $("#cartypenamee").val();
		var approverid = $('#approvernamee').combobox('getValue');// 审批人id
		var approvername =  $("#approvernamee").combobox('getText');// 审批人
		var targetup = $('#targete').val();// 产能目标上
		var remark=$('#remarke').val();
		var sqename=$("#SQEmodify").combobox('getText');
		var sqeid=$("#SQEmodify").combobox('getValue');
		 
	}else{// 新增
		var cartypename =  $("#cartypenamexz").val();
		var approverid = $('#approvername').combobox('getValue');// 审批人id
		var approvername =  $("#approvername").combobox('getText');// 审批人
		var targetup = $('#target').val();// 产能目标上
		var remark=$('#remark').val();
		var sqename=$("#SQEadd").combobox('getText');
		var sqeid=$("#SQEadd").combobox('getValue');
		
	}
	
	if(targetup.length>10){
		$.messager.alert('温馨提示', '基础信息中的产能目标(台套)：请输入10位以内的数字！', 'info');
		mbEditFlag = true;
		return;
	}
	
// var row = $('#grid1').datagrid('getSelections');
	var row1 = $('#grid').datagrid('getSelected');
	var footRow = $('#grid1').datagrid('getRows')[mbEditIndex-1];
	
	var powerid = "";// 动力ID
	var powername="";
	var transmissionid = "";// 变速器ID
	var transmissionname="";
	var configid = "";// 配置ID
	var configname="";
	var otherid = "";// 其他ID
	var othervalue="";
	var sopdate="";// sop日期
	
	var ratio = "";// 比例
	var targetdmx = "";
	
		powerid = rows.powerid;
		powername=rows.power;
		transmissionid = rows.transmissionid;
		transmissionname=rows.transmissionname;
		configid = rows.configid;
		configname=rows.configname;		
		otherid = rows.otherid;
		othervalue=rows.othervalue;
		sopdate=rows.sopdate;
		targetdmx = rows.target;
		 if(targetdmx.length>10){
			 $.messager.alert('温馨提示', '目标明细中的产能目标（台套）：请输入10位以内的数字！', 'info');
				mbEditFlag = true;
				return;
		 }
		ratio = rows.ratio;
		if(ratio){
			var regu = "^(?:0|[1-9][0-9]?|100)$"; // 整数测试
			// var regus="^(100|[1-9]d|d)(.d{1,2})?%$";
			var re = new RegExp(regu);
			var res=new  RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/);
			if(ratio.search(re) == -1 && ratio.search(res)==-1){
				$.messager.alert('温馨提示', '比例格式应为0~100之间的整数或百分数！', 'info');
				$('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
				mbEditFlag = true;
				return;
			}
		}
		// var targetd =Math.round(ratio/100*targetup);//产能目标下
		
		var sop ="";
		if(xmmxsop==""){
			for(var i=-6;i<=12;i++){
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
		}else{
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
		}
		
		var url;
		// 判断是否是修改已经保存的数据
		if(rows.detailid!="" && rows.detailid!=undefined){
			url = 'cnd01/updateCNMB';
		}else{
			url = 'cnd01/addCNMB'
		}
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
	        gdjhsop : gdjhsop,
	        gdjhsop1 : gdjhsop1,
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
				$('#grid1').datagrid("updateRow",{
					index: mbEditIndex,
					row: rows
					}
				);
				$('#grid1').datagrid("acceptChanges");
				/* $('#grid1').datagrid('refreshRow', mbEditIndex); */
				if(addIndex > -1) {
					mbEditIndex = addIndex;
					mbEditFlag = true;
					$('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
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
							$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
						}
						if(data.success && str!=""){
							$("#grid2").datagrid({
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
			}else{
				// 保存失败
				$.messager.alert('警告',"目标明细第"+(parseInt(mbEditIndex)+1)+"行，" + result.msg,'warning');
				$('#grid1').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
				mbEditFlag = true;
			}
		}
	})
	
	
}

// 保存滚动计划
function Save2(addGdIndex){
	$('#grid2').datagrid('endEdit', gdEditIndex);
	if(!gdEditFlag){
		return;
	}
	gdEditFlag = false;
	/*
	 * var sopdate; if(editflg){//修改 sopdate =
	 * $("#sopdatee").datebox('getValue');//sop日期 }else{//新增 sopdate =
	 * $("#sopdate").datebox('getValue');//sop日期 }
	 */
	var rows = $('#grid2').datagrid('getRows')[gdEditIndex];
	// var rows = $('#grid2').datagrid('getSelections');
	var targetid = rows.targetid;// 产能目标ID
	var detailid=rows.detailid;// 产能明细ID
	
	
	
	// 获取目标明细中的所有数据
/*
 * var rowsG1=$('#grid1').datagrid('getRows'); var sopfield; var soptitle;
 * for(var i=0;i<rowsG1.length;i++){
 * if(rowsG1[i]['detailid']==detailid){//取出项目明细和滚动计划对应的数据，然后取出项目明细中改对应数据最大sop列
 * var columns = $('#grid1').datagrid("options").columns; for(var
 * j=columns[0].length-1;j>=0;j--){ if(rowsG1[i][columns[0][j].field]!=""){
 * sopfield = columns[0][j].field; soptitle = columns[0][j].title; break; } } } }
 * 
 * if(rows[sopfield]==""){//判断滚动计划对应的sop列是否有值 $.messager.alert('温馨提示',
 * '目标明细中'+soptitle+'列已填写,滚动计划中至少填写到此列', 'info'); return; }
 */
	
	
	var sop ="";
	if(gdjhsop==""){
		for(var i=-1;i<=6;i++){
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
	}else{
		for(var i=gdjhsop1;i<=gdjhsop;i++){
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
	} 
	
	
	if(rows.length>1){
		 $.messager.alert('温馨提示', '请选中一行数据进行保存！', 'info');
	       return;
	}
	
	add_edit_form.form('submit',{
		url:virpath+'cnd01/addCNMB0102',
		onSubmit:function(param){
			param.planid = rows.planid;
			param.targetid1 = targetid;
			param.detailid = detailid;
			param.sop = sop;
			// return $(this).form('validate');
		},
		success:function(result){
			var result = eval('('+result+')');
			if(result.success){
				$('#grid2').datagrid("updateRow",{
					index: gdEditIndex,
					row: rows
					}
				);
				$('#grid2').datagrid("acceptChanges");
				$('#grid2').datagrid('refreshRow', gdEditIndex);
				if(addGdIndex > -1) {
					gdEditIndex = addGdIndex;
					gdEditFlag = true;
					$('#grid2').datagrid("selectRow", gdEditIndex).datagrid('beginEdit', gdEditIndex);
				}
			}else{
				$.messager.alert('警告',result.msg,'warning')
				$('#grid2').datagrid('selectRow', gdEditIndex).datagrid('beginEdit', gdEditIndex);
				gdEditFlag = true;
			}
		}
	})
}
// 新增，表一的新增
function Addxm(){
	if(checkDate()){
		return;
	}
	if(editflg){
		var cartypeid =  $("#cartypenamee").val();
		var targetup = $('#targete').val();// 产能目标上
		var approverid = $('#approvernamee').combobox('getValue');// 审批人id
	}else{
		var cartypeid =  $("#cartypenamexz").val();
		var targetup = $('#target').val();// 产能目标上
		var approverid = $('#approvername').combobox('getValue');// 审批人id
	}
	
	// 判断基础信息的必填是否都填写
	if(cartypeid==""||targetup==""||approverid==""){
		$.messager.alert('温馨提示', '基础信息不能为空！', 'info');
		return;
	}else{
		// 新增时获取目标明细的所有行数据
		var row = $('#grid1').datagrid('getRows');
		rowindexs = row.length
					
		$('#grid1').datagrid('appendRow',{});
		$('#grid1').datagrid("selectRow", rowindexs).datagrid('beginEdit', rowindexs);

		mbEditFlag = true;
		mbEditIndex = rowindexs;
		
	}
}


function doSubmit(){
	if(ylflg=="1"){
		var row1 = $('#grid').datagrid('getSelected');
		if(row1.state!="已保存" && row1.state!="经理驳回" && row1.state != '结束'){
			Msgalert("提示", "该数据已发布！", "info");
			return;
		}
		$("#targetid").val(row1.targetid);
	}
	//SaveLCflg流程保存过了会变成true
	if(SaveLCflg == false){
		SaveLC(true);
		if(mbEditFlag==true){
			return;
		}
	}
	    ProcessStart();
		add_edit_form.form('submit', {
	        url :virpath+"cnd01/doSubmit",
	        onSubmit: function () {
	        	
	        },
	        success: function (result) {
	        	ProcessEnd();
	            // result为请求处理后的返回值
	            var result = eval('(' + result + ')');
	            if (result.success == 'true') {
	                $.messager.show({
	                    title: '提示',
	                    msg: result.msg,
	                    timeout: 2000,
	                    showType: 'fade'
	                });
	                grid.datagrid('reload');
	                // check_grid1.datagrid('clearSelections');
	                add_edit.dialog('close');
	            } else {
	                Msgalert('警告', result.msg, 'warning');
	            }
	        }
	    });
	
	
}


function powerChange(rec){
	var row = $('#grid1').datagrid('getRows')[mbEditIndex];
	row['power'] = rec.text;
    row['powerid'] = rec.id;
}

function tranChange(rec){
	var row = $('#grid1').datagrid('getRows')[mbEditIndex];
	row['transmissionname'] = rec.text;
    row['transmissionid'] = rec.id;
}
function configChange(rec){
	var row = $('#grid1').datagrid('getRows')[mbEditIndex];
	row['configname'] = rec.text;
    row['configid'] = rec.id;
}
function otherChange(rec){
	var row = $('#grid1').datagrid('getRows')[mbEditIndex];
	row['othername'] = rec.text;
    row['otherid'] = rec.id;
}

function formatter(date){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	month = month < 10 ? '0' + month : month;
	return year + "年" + month + "月" + day +"日";
}

function parser(s){
	if (!s) return new Date();
	var ss=s.replace("年","-").replace("月","-").replace("日","-");
	var sss=ss.split("-");
	var y = parseInt(sss[0],10);
	var m = parseInt(sss[1],10);
	var d = parseInt(sss[2],10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}

function crtTimeFtt(value,row){
	if (value != null) {
        var date = new Date(value);
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' +date.getDate()+"日";
    }
}


 // 打开文件导入窗口
 function infoImport(){
		decImportwin.dialog('open');
		decImportwin.dialog('setTitle','导入数据');
	}

function modeldown(){
	DownLoad("/Content/ServerFiles/templet/产能目标导入模板.xlsx","产能目标导入模板.xlsx");
}
function getSelectedArr2() {
    var ids = [];
    var rows = gridtwo.datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].fileid);
    }
    return ids;
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


// 项目明细删除
function Del1(){
	if(ylflg=="1"){
		var row1 = $('#grid').datagrid('getSelected');
		if(row1.state!="已保存" && row1.state!="经理驳回"){
			Msgalert("提示", "该数据不可删除！", "info");
			return;
		}
	}
	var row = $('#grid1').datagrid('getSelected');
	var rowindex=$('#grid1').datagrid('getRowIndex',row);
	if(row.detailid!=null){// 保存过的
		var rows = $('#grid1').datagrid('getSelections');
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
	                        $('#grid1').datagrid('clearSelections');
	                    },
	                     success: function (Result) {
	                        var data = Result;
	                        if (data.success) {
	                            Msgfade(data.msg);
	                            $('#grid1').datagrid('deleteRow', rowindex);
	                            $('#grid1').datagrid("acceptChanges");
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
	                    					$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
	                    				}
	                    				if(data.success && str!=""){
	                    					$("#grid2").datagrid({
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
	}else{
		// 没保存的
		$('#grid1').datagrid('deleteRow', rowindex);
	}
	 
	
}
// 滚动计划删除
function Del2(){
	var row = $('#grid2').datagrid('getSelected');
	var rowindex=$('#grid2').datagrid('getRowIndex',row);
	if(row.planid!=null){// 如果是保存后的
		var rows = $('#grid2').datagrid('getSelections');
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
	                    					$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
	                    				}
	                    				if(data.success && str!=""){
	                    					$("#grid2").datagrid({
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
	                            refresh();// 刷新
	                            $('#grid2').datagrid("acceptChanges");
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
		var gdrow = $('#grid2').datagrid("getRows")[gdEditIndex];
		$('#grid2').datagrid('cancelEdit', gdEditIndex);
		$('#grid2').datagrid('rejectChanges');
		$('#grid2').datagrid('selectRow', gdEditIndex);
	}
}
//一览中的删除
function deleteAllYL(){
	var row=$("#grid").datagrid("getSelected");
	if(row.state!="已保存" && row.state!="经理驳回"){
		$.messager.alert('提示', '此数据不可删除！', 'info');
		return;
	}
	        $.messager.confirm('提示信息', '此操作将会删除数据，您是否确认?', function (data) {
	            if (data) {
	            	$("#add_edit").dialog("close");
	                $.ajax({
	                    url:  virpath + '/cnd01/deleteAll',
	                    type: 'post',
	                    dataType: "json",
	                    data:{
	                    	  targetid:row.targetid,
	                    	  state:row.state},
	                    error: function () {
	                        Msgalert('错误', '删除失败!', 'error');
	                    },
	                    success: function (Result) {
	                        var data = Result;
	                        if (data.success) {
	                            Msgfade(data.msg);
	                            refresh();// 刷新
	                            $("#grid1").datagrid('loadData', { total: 0, rows: [] });
	                        	$("#grid2").datagrid('loadData', { total: 0, rows: [] });
	                        } else {
	                            Msgalert('错误', data.msg, 'error');
	                        }
	                    }
	                });
	            }
	        });
}
//修改中的下边的删除
function deleteAll(){
	var row=$("#grid").datagrid("getSelected");
	if(row.state!="已保存" && row.state!="经理驳回"){
		$.messager.alert('提示', '此数据不可删除！', 'info');
		return;
	}
	var rows = $('#grid1').datagrid('getRows');
	var detailids="";
	for(var i = 0;i<rows.length;i++){
	   detailids+=rows[i].detailid+","
	}
	        $.messager.confirm('提示信息', '此操作将会删除数据，您是否确认?', function (data) {
	            if (data) {
	            	$("#add_edit").dialog("close");
	                $.ajax({
	                    url:  virpath + '/cnd01/deleteAll',
	                    type: 'post',
	                    dataType: "json",
	                    data:{detailids:detailids,
	                    	  targetid:targetid,
	                    	  state:row.state},
	                    error: function () {
	                        Msgalert('错误', '删除失败!', 'error');
	                    },
	                    success: function (Result) {
	                        var data = Result;
	                        if (data.success) {
	                            Msgfade(data.msg);
	                            refresh();// 刷新
	                            $("#grid1").datagrid('loadData', { total: 0, rows: [] });
	                        	$("#grid2").datagrid('loadData', { total: 0, rows: [] });
	                        } else {
	                            Msgalert('错误', data.msg, 'error');
	                        }
	                    }
	                });
	            }
	        });
}

// 编辑中的删除（删除四个表）
function DelLC(){
	var rows = $('#grid1').datagrid('getRows');
	if(targetid == undefined){
		$("#add_edit").dialog("close");
	}else{
		var detailids="";
		for(var i = 0;i<rows.length;i++){
		   detailids+=rows[i].detailid+","
		}
		        $.messager.confirm('提示信息', '此操作将会使数据丢失，是否继续?', function (data) {
		            if (data) {
		            	$("#add_edit").dialog("close");
		                $.ajax({
		                    url:  virpath + '/cnd01/deleteAll',
		                    type: 'post',
		                    dataType: "json",
		                    data:{detailids:detailids,
		                    	  targetid:targetid},
		                    error: function () {
		                        Msgalert('错误', '操作失败!', 'error');
		                    },
		                    success: function (Result) {
		                        var data = Result;
		                        if (data.success) {
		                            // Msgfade(data.msg);
		                            refresh();// 刷新
		                            $("#grid1").datagrid('loadData', { total: 0, rows: [] });
		                        	$("#grid2").datagrid('loadData', { total: 0, rows: [] });
		                        } else {
		                            Msgalert('错误', "操作异常", 'error');
		                        }
		                    }
		                });
		            }
		        });
	}

	    } 
// 项目明细重置
function Resetxm(){
	if(mbEditFlag){
		var mbrow = $('#grid1').datagrid("getRows")[mbEditIndex];
		$('#grid1').datagrid('cancelEdit', mbEditIndex);
		$('#grid1').datagrid('rejectChanges');
		$('#grid1').datagrid('selectRow', mbEditIndex);
		mbEditFlag = false;
	}
}
// 滚动计划重置
function Reset2(){
	if(gdEditFlag){
		var gdrow = $('#grid2').datagrid("getRows")[gdEditIndex];
		$('#grid2').datagrid('cancelEdit', gdEditIndex);
		$('#grid2').datagrid('rejectChanges');
		$('#grid2').datagrid('selectRow', gdEditIndex);
		gdEditFlag = false;
	}
}

function Editxm(){
	var row=$("#grid1").datagrid("getSelected");
	if(row == null || row.length==0){
		 $.messager.alert('警告', '请选择一条记录进行操作！');
		 return;
	}
	 if(!editflg) {
		   // 验证基础信息
		   if(!$('#cartypenamexz').textbox("isValid") ||
			  !$('#target').numberbox("isValid") || 
			  !$('#approvername').combobox("isValid")) {
			   		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
			   		return;
		   }
		}else{
			if(!$('#cartypenamee').textbox("isValid") ||
			  !$('#targete').numberbox("isValid") || 
			  !$('#approvernamee').combobox("isValid")) {
					   		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
					   		return;
				   }
		}
	var rowindex =$('#grid1').datagrid('getRowIndex',row);
	editmbCell(rowindex);
}

function Edit2(){
	var row=$("#grid2").datagrid("getSelected");
	if(row==null){
		 $.messager.alert('警告', '请选择一条记录进行操作！');
		 return;
	}
	var rowindex =$('#grid2').datagrid('getRowIndex',row);
	if(gdEditFlag && rowindex == gdEditIndex) {
		   return;
	   }
	   // 已有目标编辑行
	   if (gdEditFlag) {
		   $.messager.alert('温馨提示', '请先保存滚动计划数据！', 'warning');
			$('#grid2').datagrid("selectRow", gdEditIndex);
			return;
	   } else {
		   // 开启编辑状态
		   $('#grid2').datagrid('beginEdit', rowindex);
		   gdEditIndex = rowindex;
		   gdEditFlag = true;
	   }
}

function Close(){
	/*
	 * var row = $('#grid1').datagrid('getSelected'); var
	 * rows=$('#grid2').datagrid('getSelected'); if(undefined != row ||
	 * undefined != rows){ Msgalert("提示", "项目明细中还有数据没有保存！", "info"); return
	 * false; }
	 */
	refresh();
	$("#add_edit").dialog("close");
}
function Closeck(){
	var rows = $('#grid2').datagrid('getRows');
	
	if(rows.length != 0){
		DelLC();
	}else{
		$("#add_edit").dialog("close");
	}
	
}


function editmbCell(index,field,value){
	   if(!editflg) {
	   // 验证基础信息
	   if(!$('#cartypenamexz').textbox("isValid") ||
		  !$('#target').numberbox("isValid") || 
		  !$('#approvername').combobox("isValid")) {
		   		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
		   		return;
	      }
	   } else {
		   if(!$('#cartypenamee').textbox("isValid") ||
			  !$('#targete').numberbox("isValid") || 
			  !$('#approvernamee').combobox("isValid")) {
			  $.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
			  return;
		   }
	   }
	   // 本行重复编辑
	   if(mbEditFlag && index == mbEditIndex) {
		   return;
	   }
	   // 已有目标编辑行
	   if (mbEditFlag) {
		   $('#grid1').datagrid('endEdit', mbEditIndex);
		   var changedate = $('#grid1').datagrid('getChanges', 'updated');
		   if(changedate.length == 0) {
			   $('#grid1').datagrid('rejectChanges');
				// 开启编辑状态
			   $('#grid1').datagrid('beginEdit', index);
			   mbEditIndex = index;
			   mbEditFlag = true;
			   return;
		   }
		   // 验证编辑行
		   // var validate = $('#grid1').datagrid('validateRow', mbEditIndex);
		   var editRow = $('#grid1').datagrid("getRows")[mbEditIndex];
		   // 验证有误
		   if(checkRow(editRow)){
			   $.messager.alert('温馨提示', '目标明细第'+(parseInt(mbEditIndex)+1)+'行，必填项目不能为空！', 'warning');
			   $('#grid1').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
  		       return;
		   } else {
			   // 验证无误保存数据
			   Savexm(index);
		   }
	   } else {
		   // 开启编辑状态
		   $('#grid1').datagrid('beginEdit', index);
		   mbEditIndex = index;
		   mbEditFlag = true;
	   }
}

function editgdCell(index,field,value){
	   // 本行重复编辑
	   if(gdEditFlag && index == gdEditIndex) {
		   return;
	   }
	   // 已有目标编辑行
	   if (gdEditFlag) {
		   Save2(index);
	   } else {
		   // 开启编辑状态
		   $('#grid2').datagrid('beginEdit', index);
		   gdEditIndex = index;
		   gdEditFlag = true;
	   }
}

function checkDate(){
	if(mbEditFlag){
		$.messager.alert('温馨提示', '请先保存目标明细数据！', 'warning');
		$('#grid1').datagrid("selectRow", mbEditIndex);
		return true;
	} 
	if(gdEditFlag){
		$.messager.alert('温馨提示', '请先保存滚动计划数据！', 'warning');
		$('#grid2').datagrid("selectRow", gdEditIndex);
		return true;
	}
	return false;
}

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
	/*
	 * // 比例 else if(row.ratio == "" || row.ratio == undefined) { return true; } //
	 * 产能目标 else if(row.target == "" || row.target == undefined) { return true; }
	 */
	else {
		return false;
	}
}
// 修改产能目标信息时下方保存
function SaveAll(){
	if(editflg){
		saveEdit();
	}else{
		SaveLC();
	}
}

function saveEdit(){
	Save2();
	Savemx1();
	//Savemx1中的submit异步提交太慢了导致执行顺序
	setTimeout(function(){
		if(!mbEditFlag){
			SaveLC1()
		}
	},500);
}
function SaveLC1(){
	var sqename=$("#SQEmodify").combobox('getText');
	var sqeid=$("#SQEmodify").combobox('getValue');
	var row1 = $('#grid').datagrid('getSelected');
	var cartypename =  $("#cartypenamee").val();
	var approverid = $('#approvernamee').combobox('getValue');// 审批人id
	var approvername =  $("#approvernamee").combobox('getText');// 审批人
	var targetup = $('#targete').val();// 产能目标上
	var remark=$('#remarke').val();
	var rows = $('#grid1').datagrid('getRows');
	var sopdate1 = "";
	if(cartypename==""||approverid==""||approvername==""||targetup=="") {
   		$.messager.alert('温馨提示', '基础信息不能为空！', 'warning');
   		return;
	}	//var sopdate1=$('#sopdate').datebox('getValue');
	//var targetid = rows[0].targetid;
	var targetid=row1.targetid;
	var powernames="";
	for(var i = 0;i<rows.length;i++){
//		if(rows[i].detailid!="" && rows[i].detailid!=undefined){
			powernames+=rows[i].power+","
			sopdate1 = sopdate1 + (rows[i].sopdate +"")+",";
//		}
		
	}
	Addflgrows = 'null';
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
			targetup1:targetup,
			sqename:sqename,
			sqeid:sqeid
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
				add_edit.dialog('close');
				refresh();// 刷新
			}else{
				ProcessEnd();
				$.messager.alert('警告',result.msg,'warning');
				return;
			}
		}
	})
}

function Savemx1(addIndex){
	if(!mbEditFlag){
		return;
	}
	$('#grid1').datagrid('endEdit', mbEditIndex);
	mbEditFlag = false;
	var rows = $('#grid1').datagrid('getRows')[mbEditIndex];
	// 验证有误
	if(checkRow(rows)){
		$.messager.alert('温馨提示', '目标明细第'+(parseInt(mbEditIndex)+1)+'行，必填项目不能为空！', 'warning');
		$('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
		mbEditFlag = true;
		return;
	}
	
	if(editflg){// 修改
		var cartypename =  $("#cartypenamee").val();
		var approverid = $('#approvernamee').combobox('getValue');// 审批人id
		var approvername =  $("#approvernamee").combobox('getText');// 审批人
		var targetup = $('#targete').val();// 产能目标上
		var remark=$('#remarke').val();
		var sqename=$("#SQEmodify").combobox('getText');
		var sqeid=$("#SQEmodify").combobox('getValue');
		
	}else{// 新增
		var cartypename =  $("#cartypenamexz").val();
		var approverid = $('#approvername').combobox('getValue');// 审批人id
		var approvername =  $("#approvername").combobox('getText');// 审批人
		var targetup = $('#target').val();// 产能目标上
		var remark=$('#remark').val();
		var sqename=$("#SQEmodify").combobox('getText');
		var sqeid=$("#SQEmodify").combobox('getValue');
	}
	var row1 = $('#grid').datagrid('getSelected');
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
	if(ratio){
		var regu = "^(?:0|[1-9][0-9]?|100)$"; // 整数测试
		// var regus="^(100|[1-9]d|d)(.d{1,2})?%$";
		var re = new RegExp(regu);
		var res=new  RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/);
		if(ratio.search(re) == -1 && ratio.search(res)==-1){
			$.messager.alert('温馨提示', '比例格式应为0~100之间的整数或百分数！', 'info');
			$('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
			mbEditFlag = true;
			return;
		}
	}
	var sop ="";
	if(xmmxsop==""){
		for(var i=-6;i<=12;i++){
			if(i<0){
				sop+='SOP'+i+'&'+rows['sopm'+Math.abs(i)+'value']+',';
			}else if(i==0){
				sop+='SOP+0&'+rows['sopvalue']+',';
			}else{
				sop+='SOP+'+i+'&'+rows['sopp'+i+'value']+',';
			}
		}
	}else{
		for(var i=-6;i<=xmmxsop;i++){
			if(i<0){
				sop+='SOP'+i+'&'+rows['sopm'+Math.abs(i)+'value']+',';
			}else if(i==0){
				sop+='SOP+0&'+rows['sopvalue']+',';
			}else{
				sop+='SOP+'+i+'&'+rows['sopp'+i+'value']+',';
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
	// 修改时
	if(rows.detailid!="" && rows.detailid!=undefined){
		var detailid = rows.detailid;
		var targetidxz = rows.targetid;
		upflg = true;
	}
	
	 if(ylflg=="1"){ 
		 var targetidxz = row1.targetid;
		 if(mbEditIndex!=0){
			 sort = ++footRow.sopvaluesort;
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
        gdjhsop : gdjhsop,
        gdjhsop1 : gdjhsop1,
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
			$('#grid1').datagrid("updateRow",{
				index: mbEditIndex,
				row: rows
				}
			);
			$('#grid1').datagrid("acceptChanges");
			/* $('#grid1').datagrid('refreshRow', mbEditIndex); */
			if(addIndex > -1) {
				mbEditIndex = addIndex;
				mbEditFlag = true;
				$('#grid1').datagrid("selectRow", mbEditIndex).datagrid('beginEdit', mbEditIndex);
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
						$("#grid2").datagrid('loadData', { total: 0, rows: [] });									
					}
					if(data.success && str!=""){
						$("#grid2").datagrid({
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
		}else{
			// 保存失败
			$.messager.alert('警告',"目标明细第"+(parseInt(mbEditIndex)+1)+"行，" + result.msg,'warning');
			$('#grid1').datagrid('selectRow', mbEditIndex).datagrid('beginEdit', mbEditIndex);
			mbEditFlag = true;
		}
	}
})


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
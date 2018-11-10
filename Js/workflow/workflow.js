


function renderFlow(url, cb) {
    // TODO:
    
    ajaxGetData(url, function (data) {

        var flow = JSON.parse(data.POINT_RULE);
        if (typeof cb == 'function') {
            cb(flow);
        }
    })
}

function getPermission(appInstance, id, node, cb) {
    if (!node.keepData.hasOwnProperty("SheetCode")) return
    var sheetId = '';
    $.each(appInstance.$nodeData, function (index, node) {
        if (node.keepData.ActivityType == 'FillSheet') {
            sheetId = node.keepData.SheetCode ? node.keepData.SheetCode : appInstance.SheetCode;
        }
    })
    // appInstance.sheetId = sheetId;
    var url = '/bpm2/ConfigFlow/GetFormColumn?id=' + sheetId,
        permissions = [];

    var permissionTemplate = {
        "Editable": false,
        "Visible": true,
        "TrackVisble": false,
        "Required": false,
        "MobileVisible": false
    }
    if(node.keepData.ActivityType == 'Circulate'){
        permissionTemplate = {
            "Visible": true,
            "TrackVisble": false,
            "MobileVisible": false
        }
    }
    permissions = node.keepData.Permission;
    ajaxGetData(url, function (data) {
        // TODO
        var data = JSON.parse(data);
        if(data.length == 0) return;

        for (var i = 0; i < data.length; i++) {
            if(permissions.length){
                for (var j = 0; j < permissions.length; j++) {
                    if(data[i].ItemName == permissions[j].ItemName){
                        data[i] = $.extend(true, {}, data[i], permissions[j]);
                        break;
                    }else if(j == permissions.length - 1){
                        data[i] = $.extend(true, {}, data[i], permissionTemplate);
                    }
                }
            }else{
                data[i] = $.extend(true, {}, data[i], permissionTemplate);
            }
        }

        node.keepData.Permission = data;

        var rowsData = formatPropsData(appInstance, id, 'node');
        if (typeof cb == 'function') {
            cb(rowsData);
        }
    })
}

function reloadFlow(appInstance, json) {
    // TODO:
    appInstance.clearData();
    appInstance.loadData(json);
}

function saveFlow(appInstance, code) {
    var data = restoreData(appInstance, appInstance.exportData());
    console.log(data)
    // todo
    var url = '/bpm2/ConfigFlow/SaveRule';
    var dataStr = JSON.stringify(data);
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        data: {
            "code": code,
            "rule": dataStr
        },
        success: function (res) {
            if (res.State == "success") {
                layer.msg(res.Message)
            } else {
                layer.msg(res.Message)
            }
        }
    })
}

function Export(appInstance) {

    var data = restoreData(appInstance, appInstance.exportData());
    var value = JSON.stringify(data);
    console.log(value)
    // editor.setValue(value);

    // var totalLines = editor.lineCount();  
    // editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
}

function createDataTemplate(type) {
    var dataTemplate = {};
    switch (type) {
        case 'start': // * 开始节点
            dataTemplate = {
                "ActivityType": "Start",
                "ActivityCode": "Activity_start",

                "Text": "开始",
                "SortCode": 1,
                "FontSize": 13,
                "FontColor": "red",
                "X": 117,
                "Y": 30,
                "Height": 26,
                "Width": 26,

                // ! 新加属性(画图需要)
                "StyleType": "start round",
            }
            break;
        case 'end': // * 结束节点
            dataTemplate = {
                "ActivityType": "End",
                "ActivityCode": "Activity_end",

                "Text": "结束",
                "SortCode": 2,
                "FontSize": 13,
                "FontColor": "red",
                "X": 117,
                "Y": 351,
                "Height": 26,
                "Width": 26,

                // ! 新加属性(画图需要)
                "StyleType": "end round",
            }
            break;
        case 'approve': // * 审批节点
            dataTemplate = {
                "ActivityCode": "Activity_approve",

                "SortCode": 0,
                "SheetCode": null,
                "Summary": null,
                "CommentTitle": null,

                "Text": "审核节点模板",
                "ActivityType": "Approve",
                "FontSize": 0,
                "FontColor": null,
                "X": 79,
                "Y": 215,
                "Height": 26,
                "Width": 100,

                // ! 新加属性(画图需要)
                "StyleType": "approve parallelogram",

                "Participant": {
                    "ParticipantRule": "{Originator}",
                    "ParticipantMode": 2,
                    "ParticipateMethod": 1,
                    "ApproveExit": "100%",
                    "DisapproveExit": 1,
                    "NoParPolicy": "0",
                    "OriginatorParPolicy": "0",
                    "DupParPolicy": "0",
                    "ParticipatedParPolicy": "0"
                },
                "Permission": [],
                "Operation": {
                    "Choose": false,
                    "Jump": false,
                    "Forward": false,
                    "Retrieve": false,
                    "AdjustParticipant": false,
                    "CancelIfUnfinished": false,
                    "CancelIfFinished": false,
                    "BatchProcessing": false,
                    "MobileProcessing": false,
                    "FinishInstance": false,
                    //   "RejectToStart": true,
                    "Reject": 1, 
                    "RejectContent": null,
                    //   "RejectToFixed": true,
                    //   "SubmitToRejectedActivity": false,
                    "Assist": false,
                    "AssistData": false,
                    "Consult": false,
                    "ConsultData": false,
                    "Circulate": false,
                    "CirculateData": false
                },
                "Advanced": {
                    "SubmittingValidation": "0",
                    "LockPolicy": "0",
                    "AllowedTime": "",
                    "OvertimePolicy": "0",
                    "JavascriptCode": ""
                },
                "EventOperate": {
                    "BeforeDisposal": null,
                    "ActivatedDisposal": null,
                    "AfterDisposal": null,
                    "CancelledDisposal": null,
                    "AsyncEndedDisposal": null,
                    "ApprovedDisposal": null,
                    "RejectedDisposal": null,
                    "ExpectedDuration": null,
                    "OvertimeDisposal": null
                },
                "Expanded": [{
                    "WorkItemFlag": null,
                    "ShortText": null
                }]
            }
            break;
        case 'fillSheet': // * 填报节点
            dataTemplate = {
                "ActivityType": "FillSheet",
                "ActivityCode": "Activity_fillSheet",

                "SortCode": 0,
                "SheetCode": null,
                "Summary": null,
                "CommentTitle": null,

                "Text": "填报节点模板",
                "FontSize": 0,
                "FontColor": null,
                "X": 79,
                "Y": 125,
                "Height": 26,
                "Width": 80,

                // ! 新加属性(画图需要)
                "StyleType": "fillSheet capsule",

                "Participant": {
                    "ParticipantRule": "{Originator}",
                    "NoParPolicy": "0",
                    "OriginatorParPolicy": "0",
                    "DupParPolicy": "0",
                    "ParticipatedParPolicy": "0"
                },
                "Permission": [],
                "Operation": {
                    "Choose": false,
                    "Jump": false,
                    "Forward": false,
                    "Retrieve": true,
                    "AdjustParticipant": false,
                    "CancelIfUnfinished": false,
                    "CancelIfFinished": false,
                    "BatchProcessing": false,
                    "MobileProcessing": false,
                    "FinishInstance": false,
                    // "RejectToStart": false,
                    "Reject": 1,
                    // "RejectToFixed": false,
                    // "SubmitToRejectedActivity": false,
                    "Assist": false,
                    "AssistData": false,
                    "Consult": false,
                    "ConsultData": false,
                    "Circulate": false,
                    "CirculateData": false
                },
                "Advanced": {
                    "SubmittingValidation": "0",
                    "LockPolicy": "0",
                    "AllowedTime": "",
                    "OvertimePolicy": "0",
                    "JavascriptCode": ""
                },
                "EventOperate": {
                    "BeforeDisposal": null,
                    "ActivatedDisposal": null,
                    "AfterDisposal": null,
                    "CancelledDisposal": null,
                    "AsyncEndedDisposal": null,
                    "ApprovedDisposal": null,
                    "RejectedDisposal": null,
                    "ExpectedDuration": null,
                    "OvertimeDisposal": null
                },
                "Expanded": []
            }
            break;
        case 'business': // * 业务节点
            dataTemplate = {
                "ActivityType": "BizAction",
                "ActivityCode": "Activity25",
                "DisplayName": "业务动作模板",
                "Text": "业务动作模板",
                "ID": "25",
                "SortCode": "1",
                "EntryCondition": "Any",
                "BizActions": {
                    "Action": "HHH"
                },
                "Description": "TEST",

                // ! 新加属性(画图需要)
                "StyleType": "business",
            }
            break;
        case 'circulate': // * 传阅节点
            dataTemplate = {
                "ActivityType": "Circulate",
                "ActivityCode": "Activity22",
                "ID": "22",
                "SortCode": "1",
                "DisplayName": "传阅",
                "EntryCondition": "Any",
                "SheetCode": null,

                // ! 新加属性(画图需要)
                "StyleType": "circulate",

                "Participant": {
                    "ParticipantRule": "{Originator}"
                },
                "Permission": []
            }
            break;
        case 'subFlow': // * 子流程节点
            dataTemplate = {
                "ActivityType": "SubInstance",
                "ActivityCode": "Activity27",
                "Text": "子流程",
                "ID": "27",
                "SortCode": "0",
                "EntryCondition": "0",
                "subFlowCode": null,
                "subFlowVersion": "0",
                "Sync": "1",
                "FinishStartActivity": false,
                "Description": "TEST",

                // ! 新加属性(画图需要)
                "StyleType": "subFlow",

                "Participant": {
                    "ParticipantRule": "{SPR}",
                    "ParticipantMode": 2,
                    "ParticipateMethod": 1,
                    "ApproveExit": "100%",
                    "DisapproveExit": 1
                },
                "SubInstanceDataMaps": {
                    "DataMaps": [
                        {
                            "ParentDataName": "zwdlr",
                            "ParentDataDisplayName": "测试字段1",
                            "ChildDataDisplayName": "测试字段1",
                            "ChildDataName": "sxr",
                            "Type": "In"
                        },
                        {
                            "ParentDataName": "jjsx",
                            "ParentDataDisplayName": "测试字段2",
                            "ChildDataDisplayName": "测试字段2",
                            "ChildDataName": "hjdx",
                            "Type": "In"
                        },
                        {
                            "ParentDataName": "bmjlyj",
                            "ParentDataDisplayName": "测试字段3",
                            "ChildDataDisplayName": "测试字段3",
                            "ChildDataName": "zxds",
                            "Type": "In"
                        }
                    ]
                },
                "ActivityEvent": {
                    "BeforeExecute": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "Activated": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "AfterExecute": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "Cancelled": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "AsyncEnded": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "Approved": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "Rejected": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    },
                    "ExpectedDuration": "22",
                    "Overtime": {
                        "NotifyType": "Default",
                        "CancelParallelActivities": "False",
                        "BizActions": {
                            "Action": "HHH"
                        }
                    }
                },
            }
            break;
        case 'wait': // * 等待节点
            dataTemplate = {
                "ActivityType": "Wait",
                "ActivityCode": "Activity26",
                "ID": "26",
                "SortCode": "1",
                "DisplayName": "等待",
                "EntryCondition": "Any",
                "WaitCondition": "{TEST}",
                "IntervalByMinute": "是否间隔一分钟检查等待条件",

                // ! 新加属性(画图需要)
                "StyleType": "wait",
            }
            break;
        case 'message': // * 消息节点
            dataTemplate = {
                "ActivityType": "Notify",
                "ActivityCode": "Activity28",
                "ID": "28",
                "DisplayName": "消息",
                "SortCode": "1",
                "EntryCondition": "Any",
                "NotifyType": "0",
                "Receivers": "",
                "Title": "消息哈哈",
                "Content": "",
                "Description": "",
                // ! 新加属性(画图需要)
                "StyleType": "message",
            }
            break;
        case 'line':
            dataTemplate = {
                "UtilizeElse": false,
                "Formula": null,
                "PreActivityCode": "",
                "PostActivityCode": "",
                "ID": 0,
                "Text": "文字",
                "FontSize": 0,
                "FontColor": null,
                "styleType": 'sl',
                "M": 0
            }
            break;
    }

    return dataTemplate;
}
/**
 * * 将原始数据转为画图所需数据结构
 * @param {object} data 
 */
function dataConvert(appInstance, data) {
    var nodes = {},
        lines = {};
    var flows = data.ListWorkflow;
    var Olines = data.ListRules;
    for (var i = 0; i < flows.length; i++) {
        nodes[flows[i].ActivityCode] = {
            "name": flows[i].Text,
            "left": flows[i].X,
            "top": flows[i].Y,
            "type": flows[i].StyleType,
            "width": flows[i].Width,
            "height": flows[i].Height,
            "displayStatus": flows[i].displayStatus ? flows[i].displayStatus : '',
            "resultRecords": flows[i].resultRecords ? flows[i].resultRecords : '',
            "keepData": flows[i],
        }
    }
    for (var i = 0; i < Olines.length; i++) {
        lines[Olines[i].ID] = {
            "type": Olines[i].styleType || 'sl',
            "from": Olines[i].PreActivityCode,
            "to": Olines[i].PostActivityCode,
            "name": Olines[i].Text,
            "M": Olines[i].M ? Olines[i].M : null,
            "color": Olines[i].color ? Olines[i].color : '',
            "keepData": Olines[i],
        }
    }
    var flowdata = {
        title: data.InstanceName,
        WorkflowCode: data.WorkflowCode,
        SheetCode: data.SheetCode,
        nodes: nodes,
        lines: lines
    }
    appInstance.WorkflowCode = data.WorkflowCode;
    appInstance.SheetCode = data.SheetCode;

    return flowdata;
}

/**
 * *数据还原合并
 * @param {object} flowdata 
 * @param {object} jsondata 
 */
function restoreData(appInstance, flowdata) {
    var flow = {};
    var nodes = [];
    var lines = [];

    for (var key in flowdata.nodes) {
        var node = {
            "ActivityCode": key,
            "Text": flowdata.nodes[key].name,
            "StyleType": flowdata.nodes[key].type,

            "X": flowdata.nodes[key].left,
            "Y": flowdata.nodes[key].top,
            "Height": flowdata.nodes[key].height,
            "Width": flowdata.nodes[key].width,
            "displayStatus": flowdata.nodes[key].displayStatus,
            // "FontSize": 16,
            // "FontColor": "black",
        }
        nodes.push($.extend(true, {}, flowdata.nodes[key].keepData, node))
    }
    for (var key in flowdata.lines) {
        var line = {
            "ID": key,
            "Text": flowdata.lines[key].name,
            "PreActivityCode": flowdata.lines[key].from,
            "PostActivityCode": flowdata.lines[key].to,
            // "FontSize": 16,
            // "FontColor": "black",
            "styleType": flowdata.lines[key].type,
            "M": flowdata.lines[key].M
        }
        lines.push($.extend(true, {}, flowdata.lines[key].keepData, line))
    }

    flow = {
        InstanceName: flowdata.title,
        WorkflowCode: appInstance.WorkflowCode,
        SheetCode: appInstance.SheetCode,
        ListWorkflow: nodes,
        ListRules: lines
    }

    return flow
}
/**
 * *通过id和类型(枚举[node, line])找到对象
 * @param {string} id 
 * @param {string} type 
 * @param {object} jsondata 
 */
function findObj(id, type, jsondata) {
    var data;
    if (type == 'node') {
        var flows = jsondata.ListWorkflow;
        for (var i = 0; i < flows.length; i++) {
            if (id == flows[i].ActivityCode) {
                obj = flows[i]
            }
        }
    } else {
        var lines = jsondata.ListRules;
        for (var i = 0; i < lines.length; i++) {
            if (id == lines[i].ID) {
                obj = lines[i]
            }
        }
    }

    return obj
}
/**
 * * 功能: 让元素变成可拖动改变大小, 使用了jQuery库, 注意该元素不能使用flex的宽度或高度
 * targetEle: 目标div元素(jQuery对象) 必填参数
 * direction: 可选值[x, y] 分别表示可拖动的方向 必填参数
 * position: 拖动的触发区域位置[top, bottom, left, right] 可选参数, 默认top(y方向), left(x方向)
 * minSize: 可拖到的最小宽度或高度 可选参数, 默认50px
 * maxSize: 可拖到的最大宽度或高度 可选参数, 默认不限制
 * cb: 回调函数, 可选
 **/
function resizeDivByDrag(targetEle, direction, position, minSize, maxSize, cb) {
    var newElem = $('<div></div>');
    var newId = 'line_' + new Date().getTime();
    newElem.attr('id', newId);
    newElem.addClass('dragLine')
    targetEle.append(newElem);
    targetEle.css({
        position: 'relative',
        overflow: 'hide'
    })

    var line = $('#' + newId);
    var svg = $('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="5" style="left: 50%;top: 0;position: relative;" viewBox="0 0 30 5"><g fill="none"><path fill="#93999F" d="M0 0h2v2h-2m3 1h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m-15-5h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m6-2h2v2h-2"/></g></svg>')
    if (direction == 'x') {
        var w = targetEle.width();
        targetEle.width(w);
        position = position || 'left';
        svg = $('<svg xmlns="http://www.w3.org/2000/svg" width="5" height="30" style="top: 50%;left: 0;position: relative;" viewBox="0 0 5 30"><g transform="rotate(90 3 3)" fill="none"><path fill="#93999F" d="M0 1h2v2h-2m3 1h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m-15-5h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m6-2h2v2h-2"/></g></svg>')
        line.css({
            width: '5px',
            height: 'inherit',
            position: 'absolute',
            backgroundColor: '#e5e5e5',
            cursor: 'ew-resize',
            zIndex: '99999'
        })
        if (position == 'right') {
            line.css({
                top: 0,
                right: 0
            })
        } else {
            line.css({
                top: 0,
                left: 0
            })
        }
    } else {
        var h = targetEle.height();
        targetEle.height(h);
        position = position || 'top'
        line.css({
            width: 'inherit',
            height: '5px',
            position: 'absolute',
            backgroundColor: '#e5e5e5',
            cursor: 'ns-resize',
            zIndex: '99999'
        })
        if (position == 'bottom') {
            line.css({
                bottom: 0,
                left: 0
            })
        } else {
            line.css({
                top: 0,
                left: 0
            })
        }
    }
    line.append(svg)
    var pl = parseInt(targetEle.css('padding-' + position))
    targetEle.css('padding-' + position, (pl > 6 ? pl : 6) + 'px')
    if (typeof cb == 'function') {
        cb();
    }
    minSize = minSize || 50;
    line.mousedown(function (e) {

        var startPosition = direction == 'x' ? e.pageX : e.pageY;
        var startSize = direction == 'x' ? targetEle.width() : targetEle.height();

        document.onmousemove = function (e) {

            var move = (direction == 'x' ? e.pageX : e.pageY) - startPosition;

            var currSize;
            if (position && (position == 'right' || position == 'bottom')) {
                currSize = startSize + move;
            } else {
                currSize = startSize - move;
            }

            if (currSize < minSize) {
                currSize = minSize;
            } else if (maxSize && currSize > maxSize) {
                currSize = maxSize;
            }
            if (direction == 'x') {
                targetEle.width(currSize)
                $("body").css({
                    "cursor": 'ew-resize',
                    '-moz-user-select': '-moz-none'
                });
            } else {
                targetEle.height(currSize)
                $("body").css({
                    "cursor": 'ns-resize',
                    '-moz-user-select': '-moz-none'
                });
            }

            e.preventDefault();
        }
        document.onmouseup = function (e) {

            $("body").css("cursor", 'auto')
            document.onmousemove = null;
        };
        return false;
    })
}

function toggleBar(obj, target) {
    console.log(obj)
    var that = $(obj)
    var elem = $('.' + target)
    if (elem.hasClass('hide-this')) {
        elem.removeClass('hide-this')
    } else {
        elem.addClass('hide-this');
    }
}
/**
 * 
 * @param {string} url 
 * @param {function} cb 
 */
function ajaxGetData(url, cb) {
    $.ajax({
        url: url,
        success: function (res) {
            if (res.State == 'success') {
                if (typeof cb == "function") {
                    cb(res.Data);
                }
            } else {
                layer.msg(res.Message)
            }
        }
    })
}
/**
 * * 扫描读取节点或线的属性并格式化成属性网格需要的数据格式
 * @param {*} id 
 * @param {*} model 
 */
function formatPropsData(appInstance, id, model) {
    var obj, rows = [],
        allProps;

    if (model == "line") {
        obj = appInstance.$lineData[id];
        allProps = obj.keepData;
        rows = [
            //{name: 'id: ', value: '',group:'基本属性', editor: {type:"textbox",options:{required:true}}},
            {
                name: '名称',
                value: obj.name,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                }
            },
            // {name: 'type: ', value: obj.type, group:'基本属性'},
            {
                name: '起点',
                value: obj.from,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                }
            },
            {
                name: '终点',
                value: obj.to,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                }
            },

            {
                name: '分支条件',
                value: allProps.UtilizeElse,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                },
                extendData: {
                    id: "UtilizeElse"
                }
            },
            {
                name: '条件',
                value: allProps.Formula,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                       // required: true
                    }
                },
                extendData: {
                    id: "Formula"
                }
            }
        ]
    } else {
        obj = appInstance.$nodeData[id];
        allProps = obj.keepData;
        rows = [{
                name: '编码',
                value: allProps.ActivityCode,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                },
                extendData: {
                    id: 'ActivityCode'
                }
            },
            {
                name: '名称',
                value: obj.name,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                }
            },
            {
                name: '排序码',
                value: allProps.SortCode,
                group: '基本属性',
                editor: {
                    type: "textbox",
                    options: {
                        required: true
                    }
                }
            },
        ]
        if (allProps.ActivityType == "FillSheet" || allProps.ActivityType == "Approve" || allProps.ActivityType == "Circulate") {
            var r = {
                name: '任务表单',
                value: allProps.SheetCode,
                group: '基本属性',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                            "value": allProps.SheetCode,
                            "text": "默认表单"
                        }, ],
                        required: true
                    }
                }
            };
            rows.push(r);
        }
        if (allProps.ActivityType == "SubInstance") {
            var r = {
                name: '子流程模板',
                value: allProps.subFlowCode,
                group: '基本属性',
                editor: {
                    type: 'mycombotree',
                    options: {
                        valueField: 'code',
                        textField: 'text',
                        checkbox: true,
                        onlyLeafCheck: true,
                        url: '/BPM2/WFMappingConfig/GetWFData',
                        required: true
                    }
                },
                extendData: {
                    id: 'subFlowCode',
                }
            };
            rows.push(r);
        }
        var baseProps = ["EntryCondition", "Sync", "FinishStartActivity", "NotifyType", "Receivers", "Title", "Content", "Description"];
        for (var i = 0; i < baseProps.length; i++) {
            if (allProps.hasOwnProperty(baseProps[i])) {
                var groupName = "基本属性";
                var _dict = getPropsFieldDataDict(baseProps[i]);
                var row = {
                    name: _dict.text,
                    value: allProps[baseProps[i]],
                    group: groupName,
                    editor: _dict.editor,

                    extendData: {
                        id: baseProps[i],
                    }
                }

                rows.push(row)
            }
        }
        if (allProps.hasOwnProperty('Participant')) { // * 参与者
            var obj = allProps.Participant;
            var groupName = "参与者";
            var props = Object.keys(obj);
            var ParticipantTemp = {};
            for (var i = 0; i < props.length; i++) {
                var options = {
                    modelID: appInstance.WorkflowCode,
                    // content: obj[props[i]]
                }
                var _dict = getPropsFieldDataDict(props[i], options);

                var row = {
                    name: _dict.text,
                    value: obj[props[i]],
                    group: groupName,
                    editor: _dict.editor,

                    extendData: {
                        pid: 'Participant',
                        id: props[i],
                    }
                }
                if (allProps.ActivityType == "Approve" || allProps.ActivityType == "SubInstance") { // !审核及子流程节点需要特殊处理
                    if (props[i] == "ParticipantMode") {
                        ParticipantTemp.mode = obj[props[i]];
                    }
                    if (props[i] == "ParticipateMethod") {
                        ParticipantTemp.row = rows[rows.length - 1];
                        ParticipantTemp.row.extendData.linkRows = [];
                    }
                    if (props[i] == "ParticipateMethod" || props[i] == "ApproveExit" || props[i] == "DisapproveExit") {
                        ParticipantTemp.row.extendData.linkRows.push(row)
                        if (ParticipantTemp.mode == 1) {
                            continue;
                        }
                    }
                }
                rows.push(row);
            }
        }
        if (allProps.hasOwnProperty('SubInstanceDataMaps')) { // * 数据映射
            var obj = allProps.SubInstanceDataMaps;
            var groupName = "数据映射";
            var modelID = appInstance.WorkflowCode;

            var row = {
                name: '数据映射',
                value: obj.DataMaps ? obj.DataMaps : '',
                group: groupName,
                editor: {
                    type: "layerbox",
                    options: {
                        data: {
                            title: '数据映射关系设置',
                            url: '/BPM2/WFMappingConfig/Index?modelID=' + modelID,
                            get openFunc() {
                                var that = this;
                                return function (options, cb) {
                                    var subProCode = options.subProCode;
                                    var content = options.content;
                                    var url = that.url + '&subProCode=' + subProCode + '&content=' + encodeURIComponent(JSON.stringify(content));
                                    openLayer(that.title, url, cb);
                                }
                            }
                        }
                    }
                },
                extendData: {
                    pid: 'SubInstanceDataMaps',
                    id: 'DataMaps'
                }
            };
            rows.push(row);
        }
        if (allProps.hasOwnProperty('Permission')) { // * 权限
            var objList = allProps.Permission;
            var groupName = "数据权限", value = {};
            if(allProps.ActivityType == 'Circulate') {
                value = {
                    "Visible": true,
                    "TrackVisble": false,
                    "MobileVisible": false
                }
            }else {
                value = {
                    "Editable": false,
                    "Visible": true,
                    "TrackVisble": false,
                    "Required": false,
                    "MobileVisible": false
                }
            }
            var count = 0;
            var r = [];
            for (var i = 0; i < objList.length; i++) {
                var item = objList[i];
                var row = {
                    // name: item.ItemName,
                    name: item.text,
                    value: JSON.parse(JSON.stringify(value)),
                    group: groupName,
                    editor: {
                        type: "subCheckbox",
                        options: {
                            data: {
                                "Editable": "可写",
                                "Visible": "可见",
                                "TrackVisble": "痕迹",
                                "Required": "必填",
                                "MobileVisible": "移动"
                            }
                        }
                    },
                    extendData: {
                        pid: 'Permission',
                        index: i
                    }
                }
                var keys = Object.keys(value);
                for(var m=0; m<keys.length; m++){
                    row.value[keys[m]] = item[keys[m]];
                }
                r.push(row);
                count++;
            }
            var titleRow = {
                name: '数据项',
                value: JSON.parse(JSON.stringify(value)),
                group: groupName,
                editor: {
                    type: "allCheckbox",
                    options: {
                        data: {
                            "Editable": "可写",
                            "Visible": "可见",
                            "TrackVisble": "痕迹",
                            "Required": "必填",
                            "MobileVisible": "移动"
                        }
                    }
                },
                extendData: {
                    pid: 'Permission',
                    index: -1,
                    count: count
                }
            }
            rows.push(titleRow);
            rows = rows.concat(r);
        }
        if (allProps.hasOwnProperty('Operation')) { // * 操作权限
            var obj = allProps.Operation;
            var groupName = "操作权限";
            var r = [{
                    name: '基本操作',
                    value: {
                        "Choose": obj.Choose,
                        "Jump": obj.Jump,
                        "Forward": obj.Forward,
                        "Retrieve": obj.Retrieve,
                        "AdjustParticipant": obj.AdjustParticipant,
                    },
                    group: groupName,
                    editor: {
                        type: "checkbox",
                        options: {
                            data: {
                                "Choose": "手工选择",
                                "Jump": "跳转",
                                "Forward": "转办",
                                "Retrieve": "取回",
                                "AdjustParticipant": "加签",
                            }
                        }
                    },
                    extendData: {
                        pid: 'Operation'
                    }
                },
                {
                    name: '流程操作',
                    value: {
                        "CancelIfUnfinished": obj.CancelIfUnfinished,
                        "CancelIfFinished": obj.CancelIfFinished,
                        "BatchProcessing": obj.BatchProcessing,
                        "MobileProcessing": obj.MobileProcessing,
                        "FinishInstance": obj.FinishInstance,
                    },
                    group: groupName,
                    editor: {
                        type: "checkbox",
                        options: {
                            data: {
                                "CancelIfUnfinished": '提交前可取消',
                                "CancelIfFinished": '提交后可以取消',
                                "BatchProcessing": '批量处理',
                                "MobileProcessing": '移动办公',
                                "FinishInstance": '结束流程',
                            }
                        }
                    },
                    extendData: {
                        pid: 'Operation'
                    }
                },
                {
                    name: '驳回操作',
                    // value: {
                    //     "RejectToStart": obj.RejectToStart,
                    //     "Reject": obj.Reject,
                    //     "RejectToFixed": obj.RejectToFixed,
                    //     "SubmitToRejectedActivity": obj.SubmitToRejectedActivity,
                    // }, 
                    value: obj.Reject,
                    group: groupName,
                    editor: {
                        type: "radio",
                        options: {
                            // data: {
                            //     "RejectToStart": '驳回至开始',
                            //     "Reject": '驳回上一步',
                            //     "RejectToFixed": '驳回至指定节点',
                            //     "SubmitToRejectedActivity": '提交至驳回活动处',
                            // }
                            data: [{
                                    "value": 1,
                                    "text": "驳回至开始"
                                },
                                {
                                    "value": 2,
                                    "text": "驳回上一步"
                                },
                                {
                                    "value": 3,
                                    "text": "驳回至指定节点"
                                },
                                {
                                    "value": 4,
                                    "text": "提交至驳回活动处"
                                },
                            ],
                        }
                    },
                    extendData: {
                        pid: 'Operation',
                        id: 'Reject'
                    }
                },
                {
                    name: '协办操作',
                    value: {
                        "Assist": obj.Assist,

                        "Consult": obj.Consult,

                        "Circulate": obj.Circulate,
                    },
                    group: groupName,
                    editor: {
                        type: "checkbox",
                        options: {
                            data: {
                                "Assist": '协助',
                                "Consult": '征询意见',
                                "Circulate": '传阅',
                            }
                        }
                    },
                    extendData: {
                        pid: 'Operation'
                    }
                },
            ]
            rows = rows.concat(r);
        }
        if (allProps.hasOwnProperty('Advanced')) { // * 高级
            var obj = allProps.Advanced;
            var groupName = "高级设置";
            var props = Object.keys(obj);
            for (var i = 0; i < props.length; i++) {
                var _dict = getPropsFieldDataDict(props[i]);
                var row = {
                    name: _dict.text,
                    value: obj[props[i]],
                    group: groupName,
                    editor: _dict.editor
                }
                rows.push(row);
            }
        }
        if (allProps.hasOwnProperty('EventOperate')) { // * 事件处理
            var obj = allProps.EventOperate;
            var groupName = "事件处理";
            var props = Object.keys(obj);
            for (var i = 0; i < props.length; i++) {
                var _dict = getPropsFieldDataDict(props[i]);
                var row = {
                    name: _dict.text,
                    value: obj[props[i]],
                    group: groupName,
                    editor: _dict.editor
                }
                rows.push(row);
            }
        }
        if (allProps.hasOwnProperty('Expanded')) { // * 拓展
            var obj = allProps.Expanded;
            var groupName = "拓展";
            // var props = Object.keys(obj);
            // for(var i=0; i<props.length; i++){
            //     var _dict = getPropsFieldDataDict(props[i]);
            //     var row = {
            //         name: _dict.text,
            //         value: obj[props[i]],
            //         group: groupName,
            //         editor: _dict.editor
            //     }
            //     rows.push(row);
            // }
        }
    }
    console.table(rows)
    return {
        rows: rows,
        allProps: allProps
    };
}
// 数据字典
var getPropsFieldDataDict = function (key, options) {
    switch (key) {
        case "ParticipantRule":
            var modelID;
            if (options) {
                modelID = options.modelID ? options.modelID : '';
            }
            return {
                text: '参与者',
                editor: {
                    type: "layerbox",
                    // type: 'textbox',
                    options: {
                        data: {
                            title: '参与者[Participant]',
                            url: '/BPM2/WFFormula/Index?modelID=' + modelID,
                            get openFunc() {
                                var that = this;
                                return function (options, cb) {
                                    var content = options.content;
                                    var url = that.url + '&content=' + encodeURIComponent(content);
                                    openLayer(that.title, url, cb);
                                }
                            }
                        }
                    }
                }
            };
        case "ParticipantMode":
            return {
                text: '参与者类型',

                editor: {
                    type: 'radio',
                    // valueType: 'simple',
                    options: {
                        data: [{
                                "value": 1,
                                "text": "单人"
                            },
                            {
                                "value": 2,
                                "text": "多人"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "ParticipateMethod":
            return {
                text: '审批方式',

                editor: {
                    type: 'radio',
                    // valueType: 'simple',
                    options: {
                        data: [{
                                "value": 1,
                                "text": "并行"
                            },
                            {
                                "value": 2,
                                "text": "串行"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "ApproveExit":
            return {
                text: '同意出口',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "DisapproveExit":
            return {
                text: '否决出口',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "NoParPolicy":
            return {
                text: '无参与者',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "不做处理"
                            },
                            {
                                "value": 2,
                                "text": "使用上一次审批结果"
                            },
                            {
                                "value": 3,
                                "text": "审批通过"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "OriginatorParPolicy":
            return {
                text: '是发起人',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "不做处理"
                            },
                            // { "value":2, "text":"使用上一次审批结果"},
                            {
                                "value": 3,
                                "text": "审批通过"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "DupParPolicy":
            return {
                text: '前一活动参与',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "不做处理"
                            },
                            {
                                "value": 2,
                                "text": "使用上一次审批结果"
                            },
                            {
                                "value": 3,
                                "text": "审批通过"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "ParticipatedParPolicy":
            return {
                text: '参与过审批',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "不做处理"
                            },
                            {
                                "value": 2,
                                "text": "使用上一次审批结果"
                            },
                            {
                                "value": 3,
                                "text": "审批通过"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "Permission":
            return {
                text: '数据项',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
            // 高级
        case "SubmittingValidation":
            return {
                text: '提交检查',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "提交不做检查"
                            },
                            {
                                "value": 1,
                                "text": "检查下一活动参与者是否为空"
                            },
                            {
                                "value": 2,
                                "text": "检查数据是否有必填"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "LockPolicy":
            return {
                text: '锁表策略',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "不执行锁定"
                            },
                            {
                                "value": 1,
                                "text": "打开表单时自动锁定"
                            },
                            {
                                "value": 2,
                                "text": "用户请求时执行锁定"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "AllowedTime":
            return {
                text: '许可时间',
                editor: {
                    type: 'datebox',
                    options: {

                    }
                }
            };
        case "OvertimePolicy":
            return {
                text: '超时策略',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "不执行策略"
                            },
                            {
                                "value": 1,
                                "text": "审批通过"
                            },
                            {
                                "value": 2,
                                "text": "自动完成"
                            },
                            {
                                "value": 10,
                                "text": "超时提醒策略1"
                            },
                            {
                                "value": 11,
                                "text": "超时提醒策略2"
                            },
                        ],
                        required: true
                    }
                }
            };
        case "JavascriptCode":
            return {
                text: 'Javascript扩展',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
            // 事件
        case "BeforeDisposal":
            return {
                text: '活动激活前',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "ActivatedDisposal":
            return {
                text: '活动激活后',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "AfterDisposal":
            return {
                text: '激动完成后',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "CancelledDisposal":
            return {
                text: '活动取消后',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "AsyncEndedDisposal":
            return {
                text: '任务异步结束',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "ApprovedDisposal":
            return {
                text: '任务提交后',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "RejectedDisposal":
            return {
                text: '任务驳回后',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "ExpectedDuration":
            return {
                text: '有效时间',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "OvertimeDisposal":
            return {
                text: '有效时间事件',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
            //拓展属性
        case "WorkItemFlag":
            return {
                text: '任务标记',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "ShortText1":
            return {
                text: '扩展标记',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };

            // * 基本属性一些字典 [EntryCondition, NotifyType, Receivers, Title, Content, Description];
        case "EntryCondition":
            return {
                text: '前置条件',
                editor: {
                    type: 'radio',
                    options: {
                        data: [{
                                "value": 0,
                                "text": "任一"
                            },
                            {
                                "value": 1,
                                "text": "全部"
                            },
                        ],
                    }
                }
            };
        case "NotifyType":
            return {
                text: '消息类型',
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                                "value": 0,
                                "text": "default"
                            },
                            {
                                "value": 1,
                                "text": "Internal"
                            },
                            {
                                "value": 2,
                                "text": "Email"
                            },
                            {
                                "value": 3,
                                "text": "MobileMessage"
                            },
                            {
                                "value": 4,
                                "text": "WeChat"
                            },
                            {
                                "value": 5,
                                "text": "App"
                            },
                            {
                                "value": 6,
                                "text": "RTX"
                            },
                            {
                                "value": 7,
                                "text": "QQ"
                            },
                            {
                                "value": 8,
                                "text": "Skype"
                            }
                        ],
                        required: true
                    }
                }
            };
        case "Receivers":
            return {
                text: '接收人',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "Title":
            return {
                text: '消息标题',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "Content":
            return {
                text: '消息模板',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "Description":
            return {
                text: '备注',
                editor: {
                    type: 'textbox',
                    options: {

                    }
                }
            };
        case "Sync":
            return {
                text: '同步/异步',
                editor: {
                    type: 'radio',
                    options: {
                        data: [{
                                "value": 1,
                                "text": "同步"
                            },
                            {
                                "value": 2,
                                "text": "异步"
                            },
                        ],
                    }
                }
            };
        case "FinishStartActivity":
            return {
                text: '发起环节',
                editor: {
                    type: "checkbox",
                    options: {
                        valueType: 'single',
                        data: {
                            "FinishStartActivity": "自动结束"
                        }
                    }
                },
            };

    }
}

// 重写combotree单选
$.extend($.fn.datagrid.defaults.editors, {
    mycombotree: {
        init: function (container, options) {
            var box = $('<input />').appendTo(container);
            box.combotree(options);
            return box;
        },
        getValue: function (target) {
            var t = $(target).combotree('tree', target);
            var n = t.tree('getSelected');
            return n.code;
        },
        setValue: function (target, value) {
            if (value) {
                $(target).combotree('setValue', value.code);
            }
        },
        resize: function (target, width) {
            var box = $(target);
            box.combotree('resize', width);
        },
        destroy: function (target) {
            $(target).combotree('destroy');
        }
    }
});
/**
 * * 数据渲染方式
 * @param {*} value 
 * @param {*} row 
 */
function formatterFunc(value, row) {

    if (row.editor && row.editor.options) {
        var d = row.editor.options.data != undefined ? row.editor.options.data : []

        switch (row.editor.type) {
            case 'radio':
                var r = ''
                // if(row.editor.valueType == 'simple'){

                for (var i = 0; i < d.length; i++) {
                    r += '<div style="display: inline-block;width:50%"><input class="pg-ck" value="' + d[i].value + '" id="' + row.name + value + '" type="radio" ' + (value == d[i].value ? 'checked' : '') + '>' + d[i].text + '</div>';
                    if (i > 0 && i % 2 == 1) r += '<br>';
                }
                // }else{
                //     for(var key in value){
                //         r += '<input class="pg-ck" id="'+ key +'" type="radio" ' + (value[key]?'checked':'') + '>' + key;
                //     }
                // }

                return r;
            case 'checkbox':
                var r = '',
                    i = 0;
                var valueType = row.editor.options.valueType ? row.editor.options.valueType : ''
                if (valueType == 'single') {
                    var key = row.extendData.id;
                    r = '<input class="pg-ck" id="' + key + '" type="checkbox" ' + (value ? 'checked' : '') + '>' + d[key]
                } else {
                    for (var key in value) {
                        r += '<div style="display: inline-block;width:50%"><input class="pg-ck" id="' + key + '" type="checkbox" ' + (value[key] ? 'checked' : '') + '>' + d[key] + '</div>';
                        if (i > 0 && i % 2 == 1) r += '<br>';
                        i++;
                    }
                }

                return r;
            case 'allCheckbox':
                var r = '';
                var len = Object.keys(value).length;
                for (var key in value) {
                    r += '<div style="display: inline-block;text-align: center;padding-top: 5px;width:'+100/len+'%"><input class="pg-ck" id="allCheckbox-' + key + '" type="checkbox" ' + (value[key] ? 'checked' : '') + '><br>' + d[key] + '</div>';
                }
                return r;
            case 'subCheckbox':
                var r = '';
                var index = row.extendData.index;
                var len = Object.keys(value).length;
                for (var key in value) {
                    r += '<div style="display: inline-block;text-align: center;padding-top: 5px;width:'+100/len+'%"><input class="pg-ck subCheckbox-' + key + '" id="subCheckbox-' + key + '-' + index + '" type="checkbox" ' + (value[key] ? 'checked' : '') + '></div>';
                }
                return r;
            case 'combobox':
                for (var i = 0; i < d.length; i++) {
                    if (value == d[i].value) {
                        return d[i].text;
                    }
                }
                break;
            case 'layerbox':
                var r = '';
                if (row.extendData.id == 'DataMaps') {
                    var dataMaps = row.value;
                    r += '<div style="width:100%">'
                    for (var i = 0; i < dataMaps.length; i++) {
                        r += '<span style="width:100%;display:block;text-align:center" class="pg-ck">' + dataMaps[i].ParentDataName + ' -> ' + dataMaps[i].ChildDataName + '</span>'
                    }
                    r += '</div>'
                } else {
                    r += '<input class="pg-ck" type="text" value="' + row.value + '">';
                }
                return r;
            default:
                return value;
        }
    }
}

function onLoadSuccessFunc(obj, data) {
    var pg = $(obj);
    $(obj).propertygrid('getPanel').off("click").click(function (e) {
        if ($(e.target).hasClass('pg-ck')) {
            var tr = $(e.target).closest('tr.datagrid-row');
            var index = parseInt(tr.attr('datagrid-row-index'));
            var row = pg.propertygrid('getRows')[index];
            console.log(row);
            var id = $(e.target).attr('id')
            if (row == undefined) return
            var type = row.editor.type;
            if (type == 'radio') {
                var oldValue = row.value;
                var newValue = $(e.target).val();
                if (oldValue == newValue) return;
                row.value = newValue;
                // 写回对象
                // data.allProps[row.extendData.pid][row.extendData.id] = row.value;
                updateOriginData(data.allProps, row, newValue);
                // ! 处理特殊情况(审批人类型)
                if (row.extendData.id == "ParticipantMode" && (data.allProps.ActivityType == "Approve" || data.allProps.ActivityType == "SubInstance")) {
                    if (newValue == 2) {
                        // 插入行
                        var newRows = row.extendData.linkRows
                        insertRows(pg, index, newRows);
                    } else {
                        var nextRow = pg.propertygrid('getRows')[index + 1];
                        if (nextRow.extendData.id == "ParticipateMethod") {
                            delAfterRowIndex(pg, index, 3);
                        }
                    }
                }
            } else if (type == 'checkbox') {
                var newValue;
                var valueType = row.editor.options.valueType ? row.editor.options.valueType : ''
                if (valueType == 'single') {
                    newValue = row.value = !row.value;
                } else {
                    newValue = row.value[id] = !row.value[id];
                }
                // data.allProps[row.extendData.pid][id] = row.value[id];
                updateOriginData(data.allProps, row, newValue, id);
            } else if (type == 'allCheckbox') {

                var id = id.split('-')[1];
                console.log(id)
                var newValue = row.value[id] = !row.value[id];
                $('.subCheckbox-' + id).attr('checked', newValue);
                $('.subCheckbox-' + id).prop('checked', newValue);
                updateSubCheckboxRowsData(pg, id, index, row, newValue); // 更新连带CheckBox行数据
                updateOriginData(data.allProps, row, newValue, id); //更新源数据
                console.log(row)
            } else if (type == 'subCheckbox') {
                var id = id.split('-')[1];
                var newValue = row.value[id] = !row.value[id];
                if (!newValue) {
                    $('#allCheckbox-' + id).attr('checked', false);
                    $('#allCheckbox-' + id).prop('checked', false);
                    var Otr = $('#allCheckbox-' + id).closest('tr.datagrid-row');
                    var Oindex = parseInt(Otr.attr('datagrid-row-index'));
                    var Orow = pg.propertygrid('getRows')[Oindex];
                    Orow.value[id] = false;
                }
                updateOriginData(data.allProps, row, newValue, id); //更新源数据
            } else if (type == 'layerbox') {
                var func = row.editor.options.data.openFunc;

                if (row.extendData.id == "DataMaps") {
                    if(!data.allProps.subFlowCode) {
                        layer.msg("请先选择目标子流程模板");
                        return;
                    }
                    var subFlowCode = data.allProps.subFlowCode
                }
                var options = {
                    content: row.value,
                    subProCode: subFlowCode ? subFlowCode : null
                }
                func(options, function (d) {
                    var newValue = row.value = d;
                    pg.propertygrid('refreshRow', index);
                    updateOriginData(data.allProps, row, newValue, id)
                })
            }
            console.table(row);
            pg.propertygrid('refreshRow', index);
        }
    })
}

function onBeforeEditFunc(index, row) {
    var type = row.editor.type;
    var key = row.extendData ? row.extendData.id : '';
    if(key == 'ActivityCode') return false;
    var stopEditList = ['radio', 'checkbox', 'allCheckbox', 'subCheckbox', 'layerbox']
    for (var i = 0; i < stopEditList.length; i++) {
        if (type == stopEditList[i]) {
            return fixbug; // ! 很奇怪的bug非要报错才能执行正确
        }
    }
}

/**
 * * 更新某一行的数据到原对象;
 * @param {*} originData 
 * @param {*} newValue 
 * @param {*} rowData 
 */
function updateOriginData(originData, rowData, newValue, id) {
    var id = id || rowData.extendData.id;

    if (rowData.extendData && rowData.extendData.pid == undefined) {
        originData[id] = newValue;
    } else {
        var pid = rowData.extendData.pid;
        if (pid == "Permission") {
            var index = rowData.extendData.index;
            if (index == -1) {
                for (var i = 0; i < rowData.extendData.count; i++) {
                    originData[pid][i][id] = newValue;
                }
            } else {
                originData[pid][index][id] = newValue;
            }
        } else {
            originData[pid][id] = newValue;
        }
    }

}

function updateSubCheckboxRowsData(target, id, index, row, newValue) {
    var len = row.extendData.count;
    for (var i = 0; i < len; i++) {
        var subRow = target.propertygrid('getRows')[index + 1 + i];
        subRow.value[id] = newValue;
    }
}
// !在某行之后插入行
function insertRows(target, index, newRows) {
    for (var i = 0; i < newRows.length; i++) {
        var localIndex = index + i + 1;
        target.propertygrid('insertRow', {
            index: localIndex,
            row: newRows[i]
        });
    }
}
/**
 * * 删除数据表格某行的后续几行
 * @param {*} target 
 * @param {*} index 
 * @param {*} count 
 */
function delAfterRowIndex(target, index, count) {
    for (var i = 0; i < count; i++) {
        target.propertygrid('deleteRow', index + 1);
    }
}

function renderProps(appInstance, target, data, id, model) {
    target.propertygrid({
        showGroup: true,
        showHeader: false,
        fitColumns: true,
        striped: true,
        columns: [
            [{
                    field: 'name',
                    title: '属性名',
                    width: '30%',
                    resizable: true
                },
                {
                    field: 'value',
                    title: '属性值',
                    width: '70%',
                    resizable: true,
                    formatter: formatterFunc
                }
            ]
        ],
        data: data.rows,
        onBeforeEdit: onBeforeEditFunc,
        onAfterEdit: function (rowIndex, rowData, changes) {
            // todo
            console.log(rowData)
            switch (rowData.name) {
                case '名称':
                    appInstance.setName(id, changes.value, model);
                    // row[rowData.name] = changes.value;
                    break;
                case '':
                    break;
            }
            if (rowData.extendData == undefined) return true;
            updateOriginData(data.allProps, rowData, changes.value);
        },
        onLoadSuccess: function () {
            onLoadSuccessFunc(this, data);
        },
    })
    // target.propertygrid('collapseGroup')
}

function resizeApp(appInstance) {
    var width = $('.top').width();
    var height = $('.top').height();
    appInstance.reinitSize(width - 5, height - 5);
}

function openLayer(title, url, cb) {
    layer.open({
        type: 2,
        title: title,
        offset: ['50px'],
        btn: ['确认'],
        maxmin: true,
        area: ['600px', '600px'],
        content: url,
        yes: function (index, layero) {
            //do something
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var data = iframeWin.getData();
            if (typeof cb == "function") {
                cb(data)
            }
            layer.close(index);
        }
    });
}

// function urlEncode(str){
//     return escape(str).replace('+', '\+')
// }
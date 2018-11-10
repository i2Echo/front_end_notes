var config = {
    property: {
        //width: 972,
        height: 500,
        toolBtns: [
            "start round", 
            "end round",
            "approve",
            "fillSheet",
            "circulate",
            "message",
            "subFlow",
            "business",
            "wait"
            // "task", 
            // "node", 
            // "chat", 
            // "state", 
            // "plug", 
            // "join",
            // "fork", 
            // "complex mix"
        ],
        haveHead: true,
        headLabel:true,
        headBtns: ["save", "undo", "redo", "reload", "print"], //如果haveHead=true，则定义HEAD区的按钮
        haveTool: true,
        haveGroup: false,
        useOperStack: true,
    },
    remark: {
        "cursor":"选择指针", 
        "direct":"连线",
        "start": "开始结点",
        "end": "结束结点",
        "approve": "审核节点",
        "fillSheet": "填报节点",
        "circulate": "传阅节点",
        "message": "消息节点",
        "subFlow": "子流程节点",
        "business": "业务动作节点",
        "wait": "等待节点",
    },
    headRemarks: {
        // new: "新建流程",
        // open: "打开文件",
        save: "保存",
        undo: "撤销",
        redo: "重做",
        reload: "刷新",
        print: "打印",
        // export: "导出JSON"
    },
    customColors: {
        main	: '#20A0FF',
        font	: '',
        node	: '#fffff',
        line	: '',
        lineFont: '',
        mark	: '',
        mix	    : '#fffff',
        mixFont	: '#009688',
    }
}
var jsondata = {
    "WorkflowCode": "qjsq",
    "InstanceName": "流程模板",
    "Description": null,
    "RequirePost": false,
    "Notify": false,
    "CirculateOriginator": false,
    "FlowSummary": null,
    "PlanUsedTime": null,
    "OnCancelActions": null,
    "OnStartActions": null,
    "OnFinishActions": null,
    "ShortText": null,
    "ListWorkflow": [
      {
        "ActivityType": "Start",
        "ActivityCode": "Activity1",
        "ID": 1,
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
      },
      {
        "ActivityType": "End",
        "ActivityCode": "Activity4",
        "ID": 4,
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
      },
      {
        "ActivityType": "FillSheet",
        "ActivityCode": "Activity2",
        "DisplayName": null,
        "SortCode": 0,
        "SheetCode": "qjsq",
        "Summary": null,
        "CommentTitle": null,
        "ID": 0,
        "Text": "申请",
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
          //"ParticipantMode": 1,
          "NoParPolicy": 0,
          "OriginatorParPolicy": 0,
          "DupParPolicy": 0,
          "ParticipatedParPolicy": 0
        },
        "Permission": [
          {
            "ItemName": "bh",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "sqr",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "sqbm",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "sqrq",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "zw",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          }
        ],
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
          "RejectToStart": false,
          "Reject": false,
          "RejectToFixed": false,
          "SubmitToRejectedActivity": false,
          "Assist": false,
          // "AssistData": false,
          "Consult": false,
          // "ConsultData": false,
          "Circulate": false,
          // "CirculateData": false
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
        "Expanded": [
          {
            "WorkItemFlag": null,
            "ShortText": null
          }
        ]
      },
      {
        "ActivityCode": "Activity3",
        "DisplayName": null,
        "SortCode": 0,
        "SheetCode": "qjsq",
        "Summary": null,
        "CommentTitle": null,
        "ID": 0,
        "Text": "直属主管审核",
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
          "ParticipantMode": 1,
          "ParticipateMethod": 1,
          "ApproveExit": "100%",
          "DisaproveExit": 1,
          "NoParPolicy": "0",
          "OriginatorParPolicy": "0",
          "DupParPolicy": "0",
          "ParticipatedParPolicy": "0"
        },
        "Permission": [
          {
            "ItemName": "bh",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "sqr",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "sqbm",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "sqrq",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          },
          {
            "ItemName": "zw",
            "Editable": true,
            "Visible": true,
            "TrackVisble": false,
            "Required": true,
            "MobileVisible": false
          }
        ],
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
          "RejectToStart": true,
          "Reject": true,
          "RejectToFixed": true,
          "SubmitToRejectedActivity": false,
          "Assist": false,
          "AssistData": false,
          "Consult": false,
          "ConsultData": false,
          "Circulate": false,
          "CirculateData": false
        },
        "Advanced": {
          "SubmittingValidation": "None",
          "LockPolicy": "None",
          "AllowedTime": "",
          "OvertimePolicy": "None",
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
        "Expanded": [
          {
            "WorkItemFlag": null,
            "ShortText": null
          }
        ]
      }
    ],
    "ListRules": [
      {
        "UtilizeElse": false,
        "Formula": null,
        "PreActivityCode": "Activity1",
        "PostActivityCode": "Activity2",
        "ID": 0,
        "Text": "开始",
        "FontSize": 0,
        "FontColor": null,
        "x": 0,
        "Y": 0,
        "Height": 0,
        "Width": 0
      },
      {
        "UtilizeElse": false,
        "Formula": null,
        "PreActivityCode": "Activity2",
        "PostActivityCode": "Activity3",
        "ID": 1,
        "Text": "提交审批",
        "FontSize": 0,
        "FontColor": null,
        "x": 0,
        "Y": 0,
        "Height": 0,
        "Width": 0
      },
      {
        "UtilizeElse": false,
        "Formula": null,
        "PreActivityCode": "Activity3",
        "PostActivityCode": "Activity4",
        "ID": 2,
        "Text": "结束",
        "FontSize": 0,
        "FontColor": null,
        "x": 0,
        "Y": 0,
        "Height": 0,
        "Width": 0,

        "StyleType": 'sl'
      }
  
    ]
  }
/*
 * 将流程图在Json格式与Bpmn2.0规范的XML格式之间互转并输出的方法
 */
;(function ( global, factory ) {
	'use strict';
	if ( typeof define !== 'undefined' && define.amd ) { // export as AMD...
		define( ['jquery','GooFlow'], factory );
	}
	else if ( typeof module !== 'undefined' && module.exports ) { // ...or as browserify
		factory( require('jquery'), require('GooFlow') );
	}else
		factory( global.$, global.GooFlow );

}( typeof window !== 'undefined' ? window : this, function ( $,GooFlow ) {
    //防止多次载入
	if(GooFlow.prototype.exportBpmnXML !=='function'){
	    var tab1 = '    ',tab2=tab1+tab1, tab3=tab2+tab1;
        var xmlStart='<?xml version="1.0" encoding="UTF-8"?>\n'
            +'<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"\n'
            + tab1 + 'xmlns:activiti="http://activiti.org/bpmn"\n'
            + tab1 + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
            + tab1 + 'targetNamespace="${targetNamespace}"\n'
            + tab1 + 'xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL\n'
            + tab1 + 'http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">\n';
        var xmlEnd='</definitions>';

        function renderBaseInfo(id, tagName, item){
            var g = ""+item.left +","+ item.top +","+ item.width +","+ item.height;
            return tab2 + '<' + tagName + ' id="'+id+'"' + ' g="'+g+'"';
        }
        //json格式内容转XML
        function json2XML(tagName, json, tabs,inline){
            var strXML = (inline?'':'\n')+tabs+'<'+tagName  , strProp='',strChildren='';
            var onlyText=false;
            for(var key in json){
                if(typeof json[key]==='object'){
                    strChildren += json2XML(key, json[key],tabs+tab1);
                }else if(key==='text'){
                    strChildren += json[key];
                    onlyText=true;
                }else{
                    strProp += ' '+key+'="'+json[key]+'"';
                }
            }
            if(strChildren!==''&&!onlyText)    strChildren+='\n'+tabs;
            strXML += strProp + (strChildren===''? '/>':'>'+strChildren +'</'+tagName+'>');
            return strXML;
        }
        //把流程图中的数据输出为Bpmn2.0格式的XML字符串
        //传参nodesMaps中定义了节点的各种类型需转换成的XML标签名
        GooFlow.prototype.exportBpmnXML=function(nodeMaps){
            if(typeof nodeMaps==='undefined')   nodeMaps={};
            var XML = xmlStart.replace('${targetNamespace}',this.$extra.targetNamespace||'Examples');

            //0.额外的定义信息
            for(var key in this.$extra){
                if(key==='targetNamespace'|| key==='id')    continue;
                else{
                    var item =this.$extra[key];
                    if(typeof item==='object') {
                        XML += json2XML(key, item, tab1, true)+'\n';
                    }else{
                        XML += tab1+'<'+key+'>'+item+'</'+key+'>'+'\n';
                    }
                }
            }

            var id = this.$extra.id||'myProcess', name = this.$title||'My Process';
            XML += tab1+'<initNum>'+this.$max+'</initNum>\n';
            XML += tab1+'<process id="'+id+'" name="'+name+'">\n';

            //1.转换泳道lane定义
            for(var id in this.$areaData){
                var item = this.$areaData[id];
                var tagName = 'swimlane';
                XML += renderBaseInfo(id, tagName, item);
                XML += ' name="'+id+'"' + ' title="'+item.name+'"';
                var content='';
                for(var key in item){
                    if(key==='left'||key==='top'||key==='width'||key==='height'||key==='name'){
                        continue;
                    }else{
                        if(typeof item[key]==='object'){
                            content += json2XML(key, item[key], tab3);
                        }else{
                            XML += ' '+key+'="'+item[key]+'"';
                        }
                    }
                }
                XML += content===''? '/>\n':'>'+content +'\n'+tab2+'</swimlane>\n';
            }

            //2.转换nodes定义
            for(var id in this.$nodeData){
                var item = this.$nodeData[id];
                var tagName = nodeMaps[ item.type ]||item.type;
                XML += renderBaseInfo(id, tagName, item);
                var content='';
                for(var key in item){
                    if(key==='left'||key==='top'||key==='width'||key==='height'||key==='type'){
                    }else if(key==='areaId' && item.areaId!=null){
                        XML += ' swimlane="'+item.areaId+'"';
                    }else{
                        if(typeof item[key]==='object'){
                            content += json2XML(key, item[key], tab3);
                        }else{
                            XML += ' '+key+'="'+item[key]+'"';
                        }
                    }
                }
                XML += content===''? '/>\n':'>'+content +'\n'+tab2+'</'+tagName+'>\n';
            }

            //3.转换连线定义
            for(var id in this.$lineData){
                var item = this.$lineData[id];
                XML += tab2+'<sequenceFlow id="'+id+'" sourceRef="'+item.from+'" targetRef="'+item.to+'"';
                var content='';
                for(var key in item){
                    if(key==='from'||key==='to'){
                        continue;
                    }else{
                        if(typeof item[key]==='object'){
                            content += json2XML(key, item[key], tab3);
                        }else{
                            XML += ' '+key+'="'+item[key]+'"';
                        }
                    }
                }
                XML += content===''? '/>\n':'>'+content +'\n'+tab2+'</sequenceFlow>\n';
            }

            //4.结束，闭包
            XML += tab1 +'</process>\n'+xmlEnd;
            return XML;
        }
	}
    //防止多次载入
    if(GooFlow.prototype.loadBpmnXML !=='function'){

	    function transVal(val){
            if($.isNumeric(val)){
                return parseFloat(val);
            }else if(val==='true'){
                return true;
            }else if(val==='false'){
                return false;
            }
            return val;
        }
	    //XML对象转json对象
        function Xml2Json(xml,json) {
            //遍历属性
            for(var p=0; p<xml.attributes.length; ++p){
                var prop = xml.attributes[p];
                if(prop.nodeName==='id')    continue;
                json[prop.nodeName] = transVal( prop.nodeValue );
            }
            //遍历子节点，重新造一组子json
            if(xml.childNodes.length===1 && typeof xml.childNodes[0].data==='string') {
                json.text = xml.childNodes[0].data;
            }else{
                for(var c=0; c<xml.childNodes.length; ++c){
                    var item = xml.childNodes[c];
                    if(typeof item.data==='string')   continue;
                    json[item.tagName]={};
                    Xml2Json(item, json[item.tagName]);
                }
            }
        }

        //载入Bpmn2.0规范的XML文件格式的流程图数据
        //传参nodesMaps中定义了XML标签名中哪些需要转换成各种类型节点
        GooFlow.prototype.loadBpmnXML=function(xmlDoc, nodeMaps){
            if(typeof nodeMaps==='undefined')   nodeMaps={};
            var json={extra:{}};
            if(typeof xmlDoc==='string'){
                if(window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf("Edge")>-1){
                    xmlDoc = new ActivexObject ("MSXML2.DOMDocument");
                    xmlDoc.loadXML(strXml);
                }else{
                    xmlDoc = (new DOMParser()).parseFromString(strXml,"text/xml");
                }
            }
            var definitions=xmlDoc.getElementsByTagName('definitions')[0];

            json.extra.targetNamespace = definitions.getAttribute("targetNamespace");
            for(var i = 0;i<definitions.childNodes.length;i++){
                var level = definitions.childNodes[i];
                if(typeof level.data==='string')   continue;
                var tag = level.tagName;
                if(tag!=='process'){//如果只是一些定义
                    if(tag==='initNum'){
                        json.initNum=parseInt(level.textContent,10);
                        continue;
                    }
                    json.extra[tag]={};
                    //todo:解析这些非process定义的所有内容
                    if(level.childNodes.length>0 && typeof level.childNodes[0].data==='string')
                        json.extra[tag]=level.childNodes[0].data;
                    else
                        Xml2Json( level, json.extra[tag] );

                }else{//如果是process
                    json.extra.id = level.getAttribute("id");
                    json.title = level.getAttribute("name");
                    json.lines={};
                    json.nodes={};
                    json.areas={};
                    //解析process中的所有内容
                    for(var pr=0; pr<level.childNodes.length; ++pr){
                        var item = level.childNodes[pr];
                        if(typeof item.data==='string')   continue;
                        var tag = item.tagName, id = item.getAttribute("id");
                        if(tag==='swimlane'){//1.解析泳道

                            json.areas[id]={};
                            Xml2Json(item, json.areas[id]);
                            delete json.areas[id].id;
                            json.areas[id].name=json.areas[id].title;
                            delete json.areas[id].title;
                            var g=json.areas[id].g.split(",");
                            delete json.areas[id].g;
                            json.areas[id].left=parseFloat(g[0]);
                            json.areas[id].top=parseFloat(g[1]);
                            json.areas[id].width=parseFloat(g[2]);
                            json.areas[id].height=parseFloat(g[3]);

                        }else if(tag==='sequenceFlow'){//2.解析连线

                            json.lines[id]={};
                            Xml2Json(item, json.lines[id]);
                            delete json.lines[id].id;
                            json.lines[id].from = json.lines[id]['sourceRef'];
                            json.lines[id].to = json.lines[id]['targetRef'];
                            delete json.lines[id]['sourceRef'];
                            delete json.lines[id]['targetRef'];

                        }else{//3.解析节点

                            json.nodes[id]={};
                            Xml2Json(item, json.nodes[id]);
                            delete json.nodes[id].id;
                            if(typeof json.nodes[id]['swimlane']!=='undefined'){
                                json.nodes[id].areaId=json.nodes[id]['swimlane'];
                                delete json.nodes[id]['swimlane'];
                            }

                            var g=json.nodes[id].g.split(",");
                            delete json.nodes[id].g;
                            json.nodes[id].left=parseFloat(g[0]);
                            json.nodes[id].top=parseFloat(g[1]);
                            json.nodes[id].width=parseFloat(g[2]);
                            json.nodes[id].height=parseFloat(g[3]);
                            json.nodes[id].type=nodeMaps[ item.tagName ]||item.tagName;

                        }
                    }

                }

            }
            //console.log("json",json);
            this.loadData(json);
        };
        GooFlow.prototype.loadBpmnXMLAjax=function(para,nodeMaps){
            var This=this;
            $.ajax({
                type:para.type,
                url:para.url,
                data:para.data,
                dataType:'xml',
                success: function(msg){
                    if(para['dataFilter'])	para['dataFilter'](msg,"html");
                    This.loadBpmnXML(msg,nodeMaps);
                    if(para.success)	para.success(msg);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    if(para.error)	para.error(textStatus,errorThrown);
                }
            })
        };
    }
}));
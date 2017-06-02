"use strict";
var Ui=new(function(){
  var width = 640,
      height = 480;

  var SpriteManager=new(function(){
    var spriteTypes={}
    var spriteBase=function(props){};
    spriteTypes.generic=function(props){
      spriteBase.call(this,props);
      var myNode=forceDirectedGrapher.addNode();
      this.remove=function(){
        forceDirectedGrapher.removeNode(myNode);
      }
      this.representEvent=function(){
      }
    }
    spriteTypes.presetKit=function(props){
      var nodeList=[];
      spriteBase.call(this,props);
      nodeList.push(forceDirectedGrapher.addNode());
      var centerNode=nodeList[0];
      for(var a=0; a<16; a++){
        var nNodeHandle=forceDirectedGrapher.addNode();
        nodeList.push(nNodeHandle);
        forceDirectedGrapher.addLink(nNodeHandle,centerNode);
      }
      this.remove=function(){
        for(var a in this.nodeList){
          forceDirectedGrapher.removeNode(a);
        }
      }
      this.representEvent=function(event){}
    }
    this.add=function(options){
      var type=options.type;
      var selectedProto;
      switch (type){
        case "Midi Through 14:0":
          selectedProto=spriteTypes.generic;
        break;
        case "UM-1 20:0":
          selectedProto=spriteTypes.generic;
        break;
        case "grade":
          selectedProto=spriteTypes.generic;
        break;
        case "presetKit":
          selectedProto=spriteTypes.presetKit;
        break;
        default:
          selectedProto=spriteTypes.generic;
        break;
      }
      var ret=new(selectedProto)(options);
      return (ret);
    };
    this.remove=function(handler){
      handler.remove();
    };
  })();
  this.representEvent=function(handler,event){
    handler.representEvent(event);
  };
  this.addSprite=SpriteManager.add;
  this.addLink=forceDirectedGrapher.addLink;
  this.removeSprite=SpriteManager.remove;
  this.start=function(){
  }
})();

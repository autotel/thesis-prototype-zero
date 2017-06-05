"use strict";
var Ui=new(function(){


  var SpriteManager=new(function(){
    var spriteTypes={}
    var thisSm=this;
    this.spriteFromNames={};
    var spriteBase=function(props){};
    spriteTypes.generic=function(props){
      spriteBase.call(this,props);
      var myNode=forceDirectedGrapher.addNode();
      this.remove=function(){
        forceDirectedGrapher.removeNode(myNode);
      }
      this.representEvent=function(){
      }
      this.applyProperties=function(props){}
      this.getNodeHandle=function(){
        return myNode;
      }
    }
    //this is just to shorten the code. see spriteTypes.js
    this.addSpriteType=function(type,creator){
      spriteTypes[type]=creator(forceDirectedGrapher,spriteBase);
    }
    this.applyProperties=function(who, props){
      who.applyProperties(props);
    }
    this.add=function(options){
      var type=options.type;
      var selectedProto;
      if(spriteTypes[type]){
        selectedProto=spriteTypes[type];
      }else{
        selectedProto=spriteTypes.generic;
      }
      var ret=new(selectedProto)(options);
      thisSm.spriteFromNames[options.name]=ret;
      return (ret);
    };
    this.remove=function(handler){
      handler.remove();
    };
  })();
  this.representEvent=function(handler,event){
    handler.representEvent(event);
  };
  this.applyProperties=SpriteManager.applyProperties;
  this.addSprite=SpriteManager.add;
  this.addSpriteType=SpriteManager.addSpriteType;
  this.addLink=forceDirectedGrapher.addLink;
  this.removeSprite=SpriteManager.remove;
  this.spriteFromNames=SpriteManager.spriteFromNames;
  this.start=function(){
  }
})();

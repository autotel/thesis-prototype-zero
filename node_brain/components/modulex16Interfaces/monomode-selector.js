'use strict';
var base=require('./interactionModeBase');
var currentlySelectedMode=0;
var modes=[]

module.exports=function(environment){
  return new(function(){
    var shiftPressed=false;
    var thisMode=this;
    var monoModesMap=0x0000;
    var mutedMap=0x0000;
    this.isModeSelector=true;
    base.call(this);
    function updateHardware(){
      var selectedMap=0x1<<currentlySelectedMode;
      var allModesMap=~(0xffff<<modes.length);
      environment.hardware.draw([(selectedMap|(allModesMap^monoModesMap))&(~mutedMap),selectedMap|((allModesMap)^monoModesMap),(selectedMap|monoModesMap)]);
      // console.log(0x1<<currentlySelectedMode);
    }
    this.setModeList=function(list){
      for(var a in list){
        if(list[a]!=this)
        modes.push(a);
      }
      monoModesMap=~(0xffff<<modes.length)
    }
    this.addModuleUi=function(a){
      modes.push(a);
    }
    this.engage=function(){
      // console.log("engage mode selector");
      environment.hardware.sendScreenA("Select module");
      updateHardware();
    }
    this.disengage=function(){
      shiftPressed=false;
      return modes[currentlySelectedMode]||"add";
    }
    this.eventResponses.buttonMatrixPressed=function(evt){
      if(shiftPressed&&modes[currentlySelectedMode]){
        if(environment.patcher.modules[modes[currentlySelectedMode]])
        if(environment.patcher.modules[modes[currentlySelectedMode]].mute){
          environment.patcher.unmuteModule(modes[currentlySelectedMode]);
          mutedMap|=1<<evt.data[0];
        }else{
          environment.patcher.muteModule(modes[currentlySelectedMode]);
          mutedMap&=~(1<<evt.data[0]);
        }
      }
      currentlySelectedMode=evt.data[0];
      environment.hardware.sendScreenB(">"+(modes[currentlySelectedMode]||"add"));
      updateHardware();
    }
    this.eventResponses.encoderScroll=function(evt){
      currentlySelectedMode++;
      updateHardware();
    }
    this.eventResponses.encoderPressed=function(evt){
    }
    this.eventResponses.encoderReleased=function(evt){
    }
    this.eventResponses.selectorButtonPressed=function(evt){
      if(evt.data[0]==3){
        shiftPressed=true;
        environment.hardware.sendScreenA("Mute modules");
      }
    }
    this.eventResponses.selectorButtonReleased=function(evt){

    }
  })();
};
'use strict';
var base=require('./interactionModeBase');
var currentlySelectedMode=0;
var modes=[]

module.exports=function(environment){
  return new(function(){
    var thisMode=this;
    var monoModesMap=0x0000;
    this.isModeSelector=true;
    base.call(this);
    function updateHardware(){
      var selectedMap=0x1<<currentlySelectedMode;
      var allModesMap=~(0xffff<<modes.length);
      environment.hardware.draw([selectedMap|(allModesMap^monoModesMap),selectedMap|(allModesMap^monoModesMap),selectedMap|monoModesMap]);
      // console.log(0x1<<currentlySelectedMode);
    }
    this.setModeList=function(list){
      for(var a in list){
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
      return modes[currentlySelectedMode]||"add";
    }
    this.eventResponses.buttonMatrixPressed=function(evt){
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
  })();
};
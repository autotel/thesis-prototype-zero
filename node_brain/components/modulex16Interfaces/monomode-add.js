'use strict';
var base=require('./interactionModeBase');
// var selectors={};
var selectedMap=0x00;
var modulesMap=0x00;
var currentSelection=false;
module.exports=function(environment){
  return new(function(){
    var thisMode=this;
    var available=environment.patcher.availableModules;
    base.call(this);
    function updateHardware(){
      var modulesMap=~(0xffff<<available.length);
      environment.hardware.draw([selectedMap,modulesMap|selectedMap,selectedMap]);
    }
    function updateLCD(){
      if(currentSelection!==false){
        environment.hardware.sendScreenA(available[currentSelection]||"cancel");
        environment.hardware.sendScreenB("tap again");
      }
    }
    this.engage=function(){
      environment.hardware.sendScreenA("Add a new module");
      updateHardware();
      updateLCD();
    }
    this.disengage=function(){}
    this.eventResponses.buttonMatrixPressed=function(evt){
      selectedMap=0x1<<evt.data[0];
      if(currentSelection===evt.data[0]){
        var newModule=environment.patcher.createModule(available[currentSelection]);
        thisMode.disengage();
        if(newModule.x16Interface){
          newModule.x16Interface.engage();
        }
      }else{
        currentSelection=evt.data[0];
        updateHardware();
        updateLCD();
      }
    }
    this.eventResponses.buttonMatrixReleased=function(evt){
      // selectedMap&=~(0x1<<evt.data[0]);
      updateHardware();
    }
    this.setAvailableInterfaces=function(list){
      for(var name in list){
        available.push(name);
      }
    }
    this.eventResponses.encoderScroll=function(evt){
      //program change is CX PP https://www.midi.org/specifications/item/table-1-summary-of-midi-message

      environment.metronome.interval(evt.data[0]);
      environment.hardware.sendScreenB("interval"+evt.data[0]+"ms");
    }
    this.eventResponses.encoderPressed=function(evt){

    }
    this.eventResponses.encoderReleased=function(evt){

    }
  })();
}
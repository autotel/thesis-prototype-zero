'use strict';
var base=require('./interactionModeBase');
// var selectors={};
var selectedMap=0x00;
var modulesMap=0x00;
module.exports=function(environment){return new(function(){
  base.call(this);
  function updateHardware(){
    var modulesMap=~(0xff<<environment.patcher.modules.length);
    environment.hardware.draw([modulesMap,selectedMap,0]);
  }
  function updateLCD(){
    if(environment.patcher.modules[selectedSlot]){
      environment.hardware.sendScreenB(environment.patcher.modules[selectedSlot]);
    }
  }
  this.engage=function(){
    environment.hardware.sendScreenA("Patcher");
    updateHardware();
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    fingerMap|=0x1<<evt.data[0];
    updateHardware();
  }
  this.eventResponses.buttonMatrixReleased=function(evt){
    fingerMap&=~(0x1<<evt.data[0]);
    updateHardware();
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
  return this;
})()};
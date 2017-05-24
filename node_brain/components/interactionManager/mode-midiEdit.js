'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var editingOutput=false;
module.exports=function(environment){return new(function(){
  var midiOutputs=environment.midi.getMidiList();
  var midiMap=~(0xffff<<midiOutputs.length);
  base.call(this);
  function updateHardware(){
    environment.hardware.draw([midiMap|fingerMap,fingerMap,fingerMap]);
  }
  this.engage=function(){
    environment.hardware.sendScreenA("Midi config");
    // console.log("engage mode selector");
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
  }
  this.eventResponses.encoderPressed=function(evt){

  }
  this.eventResponses.encoderReleased=function(evt){

  }
  return this;
})()};
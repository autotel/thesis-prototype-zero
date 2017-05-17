'use strict';
var base=require('./interactionModeBase');
var currentlySeleectedMode=0;
var modes=[
  "sequencer",
  "performer",
]
module.exports=function(environment){return new(function(){
  base.call(this);
  function updateHardware(){
    environment.hardware.draw([0x1<<currentlySeleectedMode,~(0xffff<<modes.length),~(0xffff<<modes.length)]);
    console.log(0x1<<currentlySeleectedMode);
  }
  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    updateHardware();
  }
  this.eventResponses.encoderScroll=function(evt){
    console.log("hola",evt);
  }
  this.eventResponses.encoderPressed=function(evt){
    console.log("erf",evt);
  }
  this.eventResponses.encoderReleased=function(evt){
    console.log("plum",evt);
  }
  return this;
})()};
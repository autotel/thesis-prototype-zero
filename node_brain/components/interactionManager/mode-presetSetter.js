'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;

module.exports=function(environment){return new(function(){
  base.call(this);
  function updateHardware(){
    environment.hardware.draw([fingerMap,fingerMap,fingerMap]);
  }
  this.engage=function(){
    environment.hardware.sendScreenA("preset set");
    // console.log("engage mode selector");
    updateHardware();
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    fingerMap=evt.data[2]|(evt.data[3]<<8);
    updateHardware();
  }
  this.eventResponses.buttonMatrixReleased=function(evt){
    fingerMap=evt.data[2]|(evt.data[3]<<8);
    updateHardware();
  }
  this.eventResponses.encoderScroll=function(evt){

  }
  this.eventResponses.encoderPressed=function(evt){

  }
  this.eventResponses.encoderReleased=function(evt){

  }
  return this;
})()};
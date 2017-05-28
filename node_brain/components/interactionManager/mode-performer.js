'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var recording=false;

module.exports=function(environment){return new(function(){
  base.call(this);
  function updateHardware(){
    if(recording){
      environment.hardware.draw([fingerMap,fingerMap,0xffff]);
    }else{
      environment.hardware.draw([fingerMap,fingerMap,fingerMap]);
    }
  }
  this.engage=function(){
    environment.hardware.sendScreenA("Performer");
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

  }
  this.eventResponses.encoderPressed=function(evt){

  }
  this.eventResponses.encoderReleased=function(evt){

  }
  this.eventResponses.selectorButtonPressed=function(evt){
    if(evt.data[0]==3)
    recording=!recording;
  }
  return this;
})()};
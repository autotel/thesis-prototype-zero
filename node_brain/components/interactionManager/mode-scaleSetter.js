'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var scaleMap=0xAB5;//major scale :)
module.exports=function(environment){return new(function(){
  base.call(this);
  function updateHardware(){
    var displayScaleMap=scaleMap|scaleMap<<12;
    var displayFingerMap=fingerMap|fingerMap<<12;
    environment.hardware.draw([displayFingerMap|displayScaleMap,displayFingerMap^displayScaleMap,displayScaleMap]);
  }
  this.engage=function(){
    environment.hardware.sendScreenA("set scale");
    // console.log("engage mode selector");
    updateHardware();
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    fingerMap=evt.data[2]|(evt.data[3]<<8);
    //wrap around chromatic 12, as we are using our occidental logic
    fingerMap|=fingerMap>>12;
    scaleMap^=fingerMap;
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
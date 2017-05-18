'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;

module.exports=function(environment){return new(function(){
  base.call(this);
  function updateHardware(){
    environment.hardware.draw([fingerMap,fingerMap,fingerMap]);
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
  return this;
})()};
/*
0000 0000
0000 0000

0000 0001
0010 1000

0000 0010
0000 0011
0001 0100

0000 0100
0010 1001

0000 0110
0000 0111
0000 1010



*/
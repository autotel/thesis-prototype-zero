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
    // console.log(0x1<<currentlySeleectedMode);
  }
  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.disengage=function(){
    return modes[currentlySeleectedMode];
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    currentlySeleectedMode=evt.data[0];
    updateHardware();
  }
  this.eventResponses.encoderScroll=function(evt){
    currentlySeleectedMode++;
    updateHardware();
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
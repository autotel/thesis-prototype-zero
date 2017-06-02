'use strict';
var base=require('./interactionModeBase');
var currentlySelectedMode=0;
var modes=[]

module.exports=function(environment){return new(function(){
  var thisMode=this;
  this.isModeSelector=true;
  base.call(this);
  function updateHardware(){
    environment.hardware.draw([0x1<<currentlySelectedMode,~(0xffff<<modes.length),~(0xffff<<modes.length)]);
    // console.log(0x1<<currentlySelectedMode);
  }
  this.setModeList=function(list){
    for(var a in list){
      modes.push(a);
    }
  }
  this.engage=function(){
    // console.log("engage mode selector");
    environment.hardware.sendScreenA("Select module");
    updateHardware();
  }
  this.disengage=function(){
    return modes[currentlySelectedMode];
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    currentlySelectedMode=evt.data[0];
    environment.hardware.sendScreenB(">"+modes[currentlySelectedMode]);
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
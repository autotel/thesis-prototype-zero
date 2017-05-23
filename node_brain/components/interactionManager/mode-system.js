'use strict';
var base=require('./interactionModeBase');
var shell = require('shelljs');

var fingerMap=0x0000;
var functions=["shutdown"];
var lastFunctionPressed=false;
var confirm=0;
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
    var selectedFunction=functions[evt.data[0]];
    if(selectedFunction!=lastFunctionPressed) confirm=0;

    if(selectedFunction=="shutdown"){
      lastFunctionPressed="shutdown";
      environment.hardware.sendScreenA("confirm shutdown");
      if(confirm>0){
        environment.hardware.sendScreenA("K. Bye");
        shell.exec('sudo shutdown -h now');
      }
      confirm++;
    }
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
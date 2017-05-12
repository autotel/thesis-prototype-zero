'use strict';
var base=require('./interactionModeBase');
var modes=[
  "sequencer",
  "performer",
]
module.exports=function(environment){return new(function(){
  base.call(this);
  this.engage=function(){
    // console.log("engage mode selector");
    environment.hardware.draw([0,~(0xffff<<modes.length),~(0xffff<<modes.length)]);
  }
  this.eventResponses.hello=function(evt){
    console.log("miau",evt);
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    console.log("miau",evt);
  }
  this.eventResponses.buttonMatrixReleased=function(evt){
    console.log("guau",evt);
  }
  this.eventResponses.buttonMatrixHold=function(evt){
    console.log("muu",evt);
  }
  this.eventResponses.buttonMatrixVelocity=function(evt){
    console.log("bee",evt);
  }
  this.eventResponses.selectorButtonPressed=function(evt){
    console.log("piu",evt);
  }
  this.eventResponses.selectorButtonReleased=function(evt){
    console.log("croac",evt);
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
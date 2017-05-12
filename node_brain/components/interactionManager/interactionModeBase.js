'use strict';
module.exports=function(){
  this.eventResponses={};
  this.eventResponses.hello=function(){}
  this.eventResponses.buttonMatrixPressed=function(){}
  this.eventResponses.buttonMatrixReleased=function(){}
  this.eventResponses.buttonMatrixHold=function(){}
  this.eventResponses.buttonMatrixVelocity=function(){}
  this.eventResponses.selectorButtonPressed=function(){}
  this.eventResponses.selectorButtonReleased=function(){}
  this.eventResponses.encoderScroll=function(){}
  this.eventResponses.encoderPressed=function(){}
  this.eventResponses.encoderReleased=function(){}
}
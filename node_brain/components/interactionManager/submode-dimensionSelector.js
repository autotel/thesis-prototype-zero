'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
module.exports=function(environment){return new(function(){
  base.call(this);
  var currentValue=0;
  var currentDimension=0;
  var dimensions=[{
    name:'notes',
    currentValue:45,
    valueNames:function(value){
      return value;
    }
  },{
    name:'channels',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'cc\'s',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'grade',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'sequences',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  }];

  function updateHardware(){
    environment.hardware.draw([0x1<<currentDimension,~(0xffff<<dimensions.length),~(0xffff<<dimensions.length)]);
    var displayValue=dimensions[currentDimension].valueNames(dimensions[currentDimension].currentValue);
    environment.hardware.sendScreenB("dim:"+dimensions[currentDimension].name+RARROW+displayValue);
  }
  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.disengage=function(){
    return dimensions[currentDimension];
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    if(dimensions.length>evt.data[0]){
      currentDimension=evt.data[0];
      updateHardware();
    }
  }
  this.eventResponses.encoderScroll=function(evt){
    dimensions[currentDimension].currentValue=evt.data[0];
    updateHardware();
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }
  return this;
})()};
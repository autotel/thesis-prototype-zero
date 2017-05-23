'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
var eventMessage=require('../../datatype-eventMessage');
module.exports=function(environment){return new(function(){

  base.call(this);
  var currentValue=0;
  var currentDimension=0;
  var destNames=["midi","presetKit","grade","sequence","etc.."];
  var options=[{
    name:'dest',
    currentValue:0,
    valueNames:function(value){
      return destNames[value];
    }
  },{
    name:'header',
    currentValue:0,
    valueNames:function(value){
      return "C"+(value&0x0F);
    }
  },{
    name:'value a',
    currentValue:45,
    valueNames:function(value){
      return value;
    }
  },{
    name:'value b',
    currentValue:97,
    valueNames:function(value){
      return value;
    }
  }];

  function updateHardware(){
    environment.hardware.draw([0x1<<currentDimension,~(0xffff<<options.length),~(0xffff<<options.length)]);
    updateLcd();
  }
  function updateLcd(){
    var displayValue=options[currentDimension].valueNames(options[currentDimension].currentValue);
    environment.hardware.sendScreenB(""+options[currentDimension].name+RARROW+displayValue);

  }
  this.Filter=function(criteria){
    this.criteria=criteria;
    var criteria=this.criteria;
    return function(message){
      var ret=true;
      if(criteria){
        // console.log(criteria);
        if(criteria.destination)
          ret&=(message.destination===options[0].valueNames(options[0].currentValue));
        if(criteria.header)
          ret&=(message.value[0]===options[1].currentValue);
        if(criteria.value_a)
          ret&=(message.value[1]===options[2].currentValue);
        if(criteria.value_b)
          ret&=(message.value[2]===options[3].currentValue);
      }
      return ret;
    }
  }
  this.setFromSeqEvent=function(evm){
    if(!evm) evm=new eventMessage(this.getSeqEvent());
    if(!evm.isEventMessage) evm=new eventMessage(this.getSeqEvent());
    options[0].currentValue=destNames.indexOf(evm.destination);
    options[1].currentValue=evm.value[0];
    options[2].currentValue=evm.value[1];
    options[3].currentValue=evm.value[2];
    updateLcd();
  }
  this.getSeqEvent=function(){
    return new eventMessage({
      destination:options[0].valueNames(options[0].currentValue),
      value:[options[1].currentValue,options[2].currentValue,options[3].currentValue]
    });
  }
  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.disengage=function(){
    return options[currentDimension];
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    if(options.length>evt.data[0]){
      currentDimension=evt.data[0];
      updateHardware();
    }
  }
  this.eventResponses.encoderScroll=function(evt){
    if(evt.data[1]==0xff)
      options[currentDimension].currentValue--;
    else  options[currentDimension].currentValue++;

    updateLcd();
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }
  return this;
})()};
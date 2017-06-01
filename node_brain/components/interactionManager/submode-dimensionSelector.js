'use strict';
//pendant: make this to extend the 2dConfigurator instead of being exactly like it
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
var eventMessage=require('../../datatype-eventMessage');
module.exports=function(environment){return new(function(){

  base.call(this);
  var currentValue=0;
  var currentDimension=0;
  var destNames=environment.patcher.getDestList();


  destNames.push("none");

  var options=[{
    name:'dest',
    currentValue:0,
    maximumValue:destNames.length-1,
    minimumValue:0,
    valueNames:function(value){
      if(destNames.length!==environment.patcher.destinations.length){
        destNames=environment.patcher.getDestList();
        options[0].maximumValue=destNames.length-1;
      }
      return destNames[value];
    }
  },{
    name:'header',
    currentValue:0,
    maximumValue:255,
    minimumValue:0,
    valueNames:function(value){
      return "C"+(value&0x0F);
    }
  },{
    name:'value a',
    currentValue:0,
    maximumValue:256,
    minimumValue:0,
    valueNames:function(value){
      if(value==256) return "transp."
      return value;
    }
  },{
    name:'value b',
    currentValue:97,
    maximumValue:256,
    minimumValue:0,
    valueNames:function(value){
      if(value==256) return "transp."
      return value;
    }
  },{
    name:'rec from',
    currentValue:-1,
    maximumValue:destNames.length-1,
    minimumValue:-1,
    valueNames:function(value){
      if(value==-1) return "off"
      return destNames[value];
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
      var onMessage=message.on
      var ret=true;
      if(criteria){
        // console.log(criteria);
        if(criteria.destination)
          ret&=(onMessage.destination===options[0].valueNames(options[0].currentValue));
        if(criteria.header)
          ret&=(onMessage.value[0]===options[1].currentValue);
        if(criteria.value_a)
          ret&=(onMessage.value[1]===options[2].currentValue);
        if(criteria.value_b)
          ret&=(onMessage.value[2]===options[3].currentValue);
      }
      return ret;
    }
  }
  this.setFromSeqEvent=function(evm){
    if(!evm) evm=new eventMessage(this.getSeqEvent());
    if(!evm.isEventMessage) evm=new eventMessage(this.getSeqEvent());
    evm=evm.on;
    options[0].currentValue=destNames.indexOf(evm.destination);
    options[1].currentValue=evm.value[0];
    options[2].currentValue=evm.value[1];
    options[3].currentValue=evm.value[2];
    updateLcd();
  }
  this.getSeqEvent=function(){
    var newDest=options[0].valueNames(options[0].currentValue);
    return {
      on:new eventMessage({
        destination:newDest,
        value:[options[1].currentValue,options[2].currentValue,options[3].currentValue]
      }),
      off:new eventMessage({
        destination:newDest,
        value:[options[1].currentValue,options[2].currentValue,0]
      }),
      stepLength:1
    };
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
    var currentOption=options[currentDimension];
    if(evt.data[1]==0xff)
      currentOption.currentValue--;
    else  currentOption.currentValue++;

    if(currentOption.currentValue<currentOption.minimumValue){
      currentOption.currentValue=currentOption.minimumValue;
    }
    if(currentOption.currentValue>currentOption.maximumValue){
      currentOption.currentValue=currentOption.maximumValue;
    }

    updateLcd();
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }
  return this;
})()};
'use strict';
// TODO: : make this to extend the 2dConfigurator instead of being exactly like it
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
var eventMessage=require('../../datatype-eventMessage');
var patternEvent=require('../../datatype-patternEvent');

module.exports=function(environment){return new(function(){

  base.call(this);
  var value=0;
  var currentDimension=0;
  var destNames=environment.patcher.getDestList();
  var shiftMode=false;

  var dangerName=false;

  destNames.push("none");

  var options=[{
    name:'dest',
    value:0,
    maximumValue:destNames.length-1,
    minimumValue:0,
    valueNames:function(value){
      if(destNames.length!==environment.patcher.modules.length){
        destNames=environment.patcher.getDestList();
        options[0].maximumValue=destNames.length-1;
      }
      if(destNames[value]==dangerName) return (destNames[value]+" X!");
      //just in case
      if(!destNames[value]) return destNames[0];
      return (destNames[value]);
    }
  },{
    name:'H0',
    value:0,
    maximumValue:255,
    minimumValue:-1,
    valueNames:function(value){
      return "x"+(value.toString(16))+" d"+(value.toString(10));
    }
  },{
    name:'V1',
    value:0,
    maximumValue:255,
    minimumValue:-1,
    valueNames:function(value){
      if(value==-1) return "transp."
      return "x"+(value.toString(16))+" d"+(value.toString(10));
    }
  },{
    name:'V2',
    value:-1,
    maximumValue:255,
    minimumValue:-1,
    valueNames:function(value){
      if(value==-1) return "transp."
      return "x"+(value.toString(16))+" d"+(value.toString(10));
    }
  },{
    name:'note off',
    value:1,
    maximumValue:1,
    minimumValue:0,
    valueNames:function(value){
      return (value==1)? "yes":"no";
    }
  }];
  this.options=options;
  function updateHardware(){
    environment.hardware.draw([0x1<<currentDimension,~(0xffff<<options.length),~(0xffff<<options.length)]);
    updateLcd();
  }
  function updateLcd(){
    var displayValue=options[currentDimension].valueNames(options[currentDimension].value);
    environment.hardware.sendScreenB(""+options[currentDimension].name+(RARROW+displayValue).substr(-12));
  }
  this.dangerName=function(name){
    dangerName=name;
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
          ret&=(onMessage.destination===options[0].valueNames(options[0].value));
        if(criteria.header)
          ret&=(onMessage.value[0]===options[1].value);
        if(criteria.value_a)
          ret&=(onMessage.value[1]===options[2].value);
        if(criteria.value_b)
          ret&=(onMessage.value[2]===options[3].value);
      }
      return ret;
    }
  }
  this.setFromSeqEvent=function(evm){
    if(evm){
      if(evm.on){
        // console.log(evm);
        // evm=evm.on;
        // if(!evm) evm=new eventMessage(this.getSeqEvent());
        // if(!evm.isEventMessage) evm=new eventMessage(this.getSeqEvent());
        // console.log(evm);
        options[0].value=destNames.indexOf(evm.on.destination);
        // console.log(" selector:",options[0].value);
        options[1].value=evm.on.value[0];
        // console.log(" selector:",options[1].value);
        options[2].value=evm.on.value[1];
        // console.log(" selector:",options[2].value);
        options[3].value=evm.on.value[2];
        // console.log(" selector:",options[3].value);
        updateLcd();
      }
      if(evm.off){
        options[4].value=1;
      }else{
        options[4].value=0;
      }
    }

  }

  this.getSeqEvent=function(){
    var newDest=options[0].valueNames(options[0].value);
    // if(!newDest) newDest=options[0].valueNames(0);
    var newSeqEvent=new patternEvent({
      on:new eventMessage({
        destination:newDest,
        value:[options[1].value,options[2].value,options[3].value]
      }),
      off:new eventMessage({
        destination:newDest,
        value:[options[1].value,options[2].value,0]
      }),
      stepLength:1
    });
    if(options[4].value===0){
      newSeqEvent.off=false;
    }
    return newSeqEvent;
  }
  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.disengage=function(){
    shiftMode=false;
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
    if(shiftMode){
      if(evt.data[1]==0xff)
        currentOption.value-=16;
      else  currentOption.value+=16;
    }else{
      if(evt.data[1]==0xff)
        currentOption.value--;
      else  currentOption.value++;
    }

    if(currentOption.value<currentOption.minimumValue){
      currentOption.value=currentOption.maximumValue;
    }
    if(currentOption.value>currentOption.maximumValue){
      currentOption.value=currentOption.minimumValue;
    }
    updateLcd();
  }
  this.eventResponses.selectorButtonPressed=function(evt){
    if(evt.data[0]==3)
    shiftMode=true;
    // console.log("selector shift",evt);
  }
  this.eventResponses.selectorButtonReleased=function(evt){
    shiftMode=false;
    // console.log("selector unshift",evt);
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }
  return this;
})()};
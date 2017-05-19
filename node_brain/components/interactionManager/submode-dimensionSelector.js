'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
module.exports=function(environment){return new(function(){
  base.call(this);
  var currentValue=0;
  var currentDimension=0;
  var options=[{
    name:'midi notes',
    currentValue:45,
    valueNames:function(value){
      return value;
    }
  },{
    name:'midi channels',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch grade',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch preset',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch alterator',
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch seqs',
    currentValue:0,
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
  this.getFilter=function(){
    if(currentDimension==0){
      return function(a){
        if(a.value[0]==options[1].currentValue&&a.value[1]==options[0].currentValue) return true
        return false
      }
    }else if(currentDimension==1){
      return function(a){
        if(a.value[0]==options[1].currentValue) return true
        return false
      }
    }else if(currentDimension<6){
      return function(a){
        if(a.value==options[currentDimension].currentValue) return true
        return false
      }
    }
  }
  this.getSeqEvent=function(){
    if(currentDimension<2){
      return({type:'patch',destination:"midi",value:[options[1].currentValue,options[0].currentValue,97]});
    }else if(currentDimension<6){
      return({type:'patch',destination:options[currentDimension].name,value:options[currentDimension].currentValue});
    }
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
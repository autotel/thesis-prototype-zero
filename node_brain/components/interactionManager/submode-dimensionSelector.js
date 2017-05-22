'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
var eventMessage=require('../../datatype-eventMessage');
module.exports=function(environment){return new(function(){
  base.call(this);
  var currentValue=0;
  var currentDimension=0;
  var options=[{
    name:'header',
    destination:"midi",
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'midi notes',
    destination:"midi",
    currentValue:45,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch grade',
    destination:"grade",
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch preset',
    destination:"preset",
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch alterator',
    destination:"alterator",
    currentValue:0,
    valueNames:function(value){
      return value;
    }
  },{
    name:'patch seqs',
    destination:"sequencer",
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
  this.Filter=function(criteria){
    var checkValue=[];
    if(criteria.value){
      checkValue[0]=criteria.value[0];
      checkValue[1]=criteria.value[1];
      checkValue[2]=criteria.value[2];
    }
    var checkDestination=criteria.destination;
    return function(message){//or new?
      var ret=false;
      //if not checking something, returns true. if checking, has to evaluate the criteria
      if((!checkValue[0])||message.value[0]==options[0].currentValue){
        if((!checkValue[1])||message.value[1]==options[currentDimension].currentValue){
          // if((!checkValue[2])||message.value[2]==options[2].currentValue){
          if((!checkDestination)||message.destination[1]==options[currentDimension].destination){
            return true;
          }
          // }
        }
      }
      return ret;
    }
  }
  this.getSeqEvent=function(){
    if(currentDimension<2){
      return new eventMessage({type:'patch',destination:options[currentDimension].destination,value:[options[0].currentValue,options[1].currentValue,97]});
    }else if(currentDimension<6){
      return new eventMessage({type:'patch',destination:options[currentDimension].destination,value:[options[0].currentValue,options[currentDimension].currentValue,97]});
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
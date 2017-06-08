// TODO: : these configurators are still quite patchy, and it would
//be hard for someone new to implement them in a custom module.
//make a clearer, easier way of making these submodes.
'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var RARROW=String.fromCharCode(126);
var Option=function(opts){
  var valueNames=opts.valueNames||[];
  this.value=0;
  this.name="nothing";
  this.getValueName=function(a){ return valueNames[a] }
  this.getCurrentValueName=function(){ return this.getValueName(this.value) }
  this.minimumValue=0;
  for(var a in opts){
    this[a]=opts[a];
  }
  this.bindValue=false;
  //wether to apply the value of this option o an objects property upon change.
  this.bindValueWith=function(object,property){
    this.bindValue=[object,property];
  }
  if(!opts.maximumValue)this.maximumValue=valueNames.length;
}

module.exports=function(environment){return new(function(){
  base.call(this);
  var thisInterface=this;
  var option;
  this.option;

  this.initOption=function(monoOption){
    option=new Option(monoOption);
    thisInterface.option=option;
    updateChoicesMap();
  }

  var choicesRange;
  var choicesMap;
  var inputBinary=false;
  var negativeMap=0;
  function updateChoicesMap(){
    choicesRange=(option.maximumValue-option.minimumValue)+1;
    if(choicesRange>16){
      choicesMap=0x00;
      inputBinary=true;
    }else{
      inputBinary=false;
      negativeMap=0x1>>(Math.min(0,option.minimumValue)-1);
      choicesMap=~(0xffff<<choicesRange);
    }
  }

  function updateHardware(){
    var selectionMap;
    if(inputBinary){
      selectionMap=option.value;
    }else{
      selectionMap=0x1<<option.value;
    }
    environment.hardware.draw([choicesMap|selectionMap,selectionMap,negativeMap|selectionMap]);
    updateLcd();
  }

  function updateLcd(){
    var displayValue=option.getCurrentValueName();
    environment.hardware.sendScreenB(""+option.name+RARROW+displayValue);
  }
  this.updateLcd=updateLcd;

  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.disengage=function(){
    return option;
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    if(inputBinary){
      option.value=evt.data[1]|(evt.data[2]<<8);
    }else{
      option.value=evt.data[0];
    }
    option.value=Math.min(option.value,option.maximumValue);
    updateLcd();
    updateHardware();
  }
  this.eventResponses.encoderScroll=function(evt){
    if(evt.data[1]==0xff){
      if(option.valueChangeFunction){
        option.valueChangeFunction(false,-1);
      }else{
        if(option.value>option.minimumValue)
          option.value--;
      }
    }else{
      if(option.valueChangeFunction){
        option.valueChangeFunction(false,+1);
      }else{
        if(option.value<option.maximumValue)
          option.value++;
      }
    }
    updateLcd();
    updateHardware();
    //bind values if binded
    //we can set the option value to set some parameter in an arbitrary object, here it is applied
    if(option.bindValue){
      (option.bindValue[0])[option.bindValue[1]]=option.value;
    }
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }

  return this;
})()};
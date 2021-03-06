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
  var currentSelection=0;
  var options=Array();
  var thisSelector=this;
  this.options=options;
  function updateHardware(){
    environment.hardware.draw([0x1<<currentSelection,~(0xffff<<options.length),~(0xffff<<options.length)]);
    updateLcd();
  }

  function updateLcd(){
    var displayValue=options[currentSelection].getCurrentValueName();
    environment.hardware.sendScreenB(""+options[currentSelection].name+RARROW+displayValue);
  }
  this.updateLcd=updateLcd;

  this.initOptions=function(structure){
    for(var a in structure){
      if(!structure[a].name) structure[a].name=a;
      options.push(new Option(structure[a]));
    }
  }
  this.engage=function(){
    // console.log("engage mode selector");
    updateHardware();
  }
  this.disengage=function(){
    return options[currentSelection];
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    if(options.length>evt.data[0]){
      currentSelection=evt.data[0];
      updateHardware();
      if(typeof thisSelector.valueChangeFunction==="function"){
        thisSelector.valueChangeFunction(evt.data[0]);
      }
    }
  }
  this.eventResponses.encoderScroll=function(evt){
    var currentOption=options[currentSelection];
    // //get values if binded
    // if(currentOption.bindValue){
    //   currentOption.value=(currentOption.bindValue[0])[currentOption.bindValue[1]];
    //   updateLcd();
    // }
    //set values in the configurator
    if(evt.data[1]==0xff){
      if(currentOption.valueChangeFunction){
        currentOption.valueChangeFunction(false,-1);
      }else{
        if(currentOption.value>currentOption.minimumValue)
          currentOption.value--;
      }
    }else{
      if(currentOption.valueChangeFunction){
        currentOption.valueChangeFunction(false,+1);
      }else{
        if(currentOption.value<currentOption.maximumValue)
          currentOption.value++;
      }
    }
    updateLcd();
    //bind values if binded
    //we can set the option value to set some parameter in an arbitrary object, here it is applied
    if(currentOption.bindValue){
      (currentOption.bindValue[0])[currentOption.bindValue[1]]=currentOption.value;
    }
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }

  return this;
})()};
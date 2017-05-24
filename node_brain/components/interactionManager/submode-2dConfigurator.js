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
  if(!opts.maximumValue)this.maximumValue=valueNames.length;
}
module.exports=function(environment){return new(function(){
  base.call(this);
  var currentSelection=0;
  var options=Array();
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
    }
  }
  this.eventResponses.encoderScroll=function(evt){
    var currentOption=options[currentSelection];
    if(evt.data[1]==0xff){
      if(currentOption.value>currentOption.minimumValue)
        currentOption.value--;
    }else{
      if(currentOption.value<currentOption.maximumValue)
        currentOption.value++;
    }
    updateLcd();
  }
  this.eventResponses.encoderPressed=function(evt){
  }
  this.eventResponses.encoderReleased=function(evt){
  }
  return this;
})()};
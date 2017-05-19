'use strict';
var base=require('./interactionModeBase');
var selectors={};
selectors.dimension=require('./submode-dimensionSelector');

module.exports=function(environment){return new(function(){

  base.call(this);
  var tPattern=this;
  var patData={};
  var currentStep=0;
  var engaged=false;

  console.log(selectors);
  for(var a in selectors){
    console.log("init subs "+a);
    selectors[a]=selectors[a](environment);
  }

  var lastsubSelectorEngaged=0;
  var subSelectorEngaged=false;

  var currentDimension=0;

  // var selectors=['dimension','value','modulus'];
  var currentSelector=0;

  this.init=function(){
    environment.metronome.on('step',step);
  }
  var store=function(place,data){
    patData[place]=data;
  }
  var getBoolean=function(place){
    return patData[place]||false;
  };
  var getBitmapx16=function(){
    var ret=0x0000;
    for(var a=0; a<16;a++){
      if(patData[a]){
        ret|=0x1<<a;
      }
    }
    console.log(">"+ret.toString(16));
    return ret;
  }
  //some events run regardless of engagement. in these cases, the screen refresh is conditional
  function step(evt){
    currentStep=evt.step;
    if(engaged)
    if(subSelectorEngaged===false)
    updateLeds();
  }
  function updateLeds(){
    environment.hardware.draw([getBitmapx16(),0x1<<currentStep^getBitmapx16(),0x1<<currentStep|getBitmapx16()]);
  }

  this.engage=function(){
    environment.hardware.sendScreenA("Sequencer mode");
    engaged=true;
    updateLeds();
  }
  this.disengage=function(){
    engaged=false;
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    console.log("bmatr",evt);
    if(subSelectorEngaged===false){
      store(evt.data[0],!getBoolean(evt.data[0]));
    }else{
      selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
    }
    updateLeds();
  }
  this.eventResponses.buttonMatrixReleased=function(evt){
    if(subSelectorEngaged===false){
      updateLeds();
    }else{
      selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
    }
  }
  this.eventResponses.encoderScroll=function(evt){
    selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
    // if(subSelectorEngaged===false){
    //   environment.hardware.sendScreenB(String.fromCharCode(evt.data[0])+"-"+evt.data[0]);
    // }else{
    // }
  }
  this.eventResponses.selectorButtonPressed=function(evt){
    if(evt.data[0]==1){
      subSelectorEngaged='dimension';
      lastsubSelectorEngaged='dimension';
      selectors.dimension.engage();
    }
  }
  this.eventResponses.selectorButtonReleased=function(evt){
    subSelectorEngaged=false;
    selectors.dimension.disengage();
  }
  return this;
})()};
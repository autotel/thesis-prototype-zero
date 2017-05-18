'use strict';
var base=require('./interactionModeBase');

module.exports=function(environment){return new(function(){
  base.call(this);
  var tPattern=this;
  var patData={};
  var currentStep=0;
  var engaged=false;

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
    updateHardware();
  }
  function updateHardware(){
    environment.hardware.draw([getBitmapx16(),0x1<<currentStep^getBitmapx16(),0x1<<currentStep|getBitmapx16()]);
  }
  this.engage=function(){
    engaged=true;
    updateHardware();
  }
  this.disengage=function(){
    engaged=false;
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    console.log("bmatr",evt);
    store(evt.data[0],!getBoolean(evt.data[0]));
    // environment.hardware.testByte(evt.data[2]);
    updateHardware();
  }
  this.eventResponses.buttonMatrixReleased=function(evt){
    console.log("bmatr",evt);
    // store(evt.data[0],!getBoolean(evt.data[0]));
    // environment.hardware.testByte(evt.data[2]);
    updateHardware();
  }
  this.eventResponses.encoderScroll=function(evt){
    console.log(evt.data[0]);
    environment.hardware.testByte(evt.data[0]);
    // environment.hardware.draw([evt.data[0],0,0]);
  }
  return this;
})()};
'use strict';
var base=require('./interactionModeBase');

module.exports=function(environment){return new(function(){
  base.call(this);

  var tPattern=this;
  var patData={};
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

  function updateHardware(){
    environment.hardware.draw([getBitmapx16(),getBitmapx16(),getBitmapx16()]);
  }
  this.engage=function(){

    // environment.hardware.draw([0x9096,0,0]);
    // updateHardware();
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
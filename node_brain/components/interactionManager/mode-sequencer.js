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
    environment.hardware.draw([getBitmapx16(),0,0]);
  }
  this.engage=function(){
    updateHardware();
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    console.log("bmatr",evt);
    store(evt.data[0],!getBoolean(evt.data[0]));
    updateHardware();
  }

  return this;
})()};
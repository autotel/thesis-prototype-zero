'use strict';
var base=require('./interactionModeBase');

module.exports=function(environment){return new(function(){
  base.call(this);

  var tPattern=this;
  var patData={};
  this.store=function(place,data){
    patData[place]=data;
  }
  this.getBoolean=function(place){
    return patData[place]||false;
  };
  this.getBitmapx16=function(){
    var ret=0x0000;
    for(var a=0; a<16;a++){
      if(patData[a]){
        ret|=0x1<<a;
      }
    }
    return ret;
  }
  return this;
})()};
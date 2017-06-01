'use strict';

const onhandlers=require('onhandlers');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){
  if(!environment.patcher.modules) environment.patcher.modules={};
  onhandlers.call(this);
  //pendant: these musical events should be instances of an event object, that work like a vector
  this.receiveEvent=function(event){
//console.log("not implemented yet");
    this.handle('receive',moduleEvent(this,event));
  }
}
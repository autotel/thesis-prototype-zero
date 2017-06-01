'use strict';

const onhandlers=require('onhandlers');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){
  if(!environment.patcher.modules) environment.patcher.modules={};
  onhandlers.call(this);
  this.receiveEvent=function(event){
//console.log("not implemented yet");
    this.handle('receive',moduleEvent(this,event));
  }
}
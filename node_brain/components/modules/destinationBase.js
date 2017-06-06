'use strict';

const onhandlers=require('onhandlers');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){
  onhandlers.call(this);
  this.receiveEvent=function(event){
    console.log("this module's receive function is not implemented yet");
    this.handle('receive',moduleEvent(this,event));
  }
}
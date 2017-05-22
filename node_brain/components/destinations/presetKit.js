var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
  environment.patcher.destinations.presetKit=this;
  var thisDest=this;
  var kit=[];
  this.receive=function(event){
    environment.patcher.receiveEvent(kit[event.value[1]%kit.length]);
  }
  this.triggerPad=function(num){
    environment.patcher.receiveEvent(kit[num%kit.length]);
  }
  this.set=function(number,data){
    if(!kit[number]){
      kit[number]=new eventMessage(data);
    }else{
      kit[number].set(data);
    }
  }
})()}
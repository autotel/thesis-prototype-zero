var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const onhandlers=require('onhandlers');
module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
  onhandlers.call(this);
  environment.patcher.destinations.presetKit=this;
  var thisDest=this;
  var kit=[];
  this.kit=kit;
  this.receive=function(event){
    if(kit[event.value[1]])
    environment.patcher.receiveEvent(kit[event.value[1]]);
    this.handle('receive',event);
  }
  this.padOn=function(num){
    if(kit[num])
    environment.patcher.receiveEvent(kit[num].on);
  }
  this.padOff=function(num){
      if(kit[num])
      environment.patcher.receiveEvent(kit[num].off)
  }
  this.set=function(number,data){
    if(!kit[number]){
      kit[number]=new eventMessage(data);
    }else{
      kit[number].set(data);
    }
  }
})()}
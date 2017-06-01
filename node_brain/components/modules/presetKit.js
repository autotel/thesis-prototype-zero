var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
  environment.patcher.addModule("presetKit",this);

  var thisDest=this;
  var kit=[];
  this.kit=kit;
  this.receive=function(event){
    if(kit[event.value[1]])
    //pendant: I feel that this solution to route note offs is a bit too patchy and too much like midi.
    if(event.value[2]==0){
      environment.patcher.receiveEvent(kit[event.value[1]].on);
    }else{
      environment.patcher.receiveEvent(kit[event.value[1]].off);
    }
    this.handle('receive',moduleEvent(this,event));
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
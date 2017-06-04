var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
const onhandlers=require('onhandlers');
var environment=false;

function MetronomePrototype(props) {
  var props=props||{};
  var interval=140;
  if(props.interval) interval=props.interval;
  var currentStep=0;
  var tMetro=this;
  var myIndex=0;
  // var myDestination=false;
  var tickEventMessage=new eventMessage({destination:false,value:[0,0,0]});
  if(props.destination) tickEventMessage.destination=props.destination;
  onhandlers.call(this);
  this.onTick=function(evt){
    tickEventMessage.value[1]=currentStep;
    if(tickEventMessage.destination){
      console.log(tickEventMessage);
      environment.patcher.receiveEvent(tickEventMessage);
    }
    tMetro.handle('tick',evt);
  };
  function stm(){
    tMetro.onTick({step:currentStep,indexNumber:myIndex});
    setTimeout(stm,interval);
    currentStep++;
    currentStep%=16*15*14*13*12*11*10*9*8*7*6*5*4*3*2;
  }
  this.setIndex=function(index){
    myIndex=index;
  }
  this.setDestination=function(to){
    // myDestination=to;
    tickEventMessage.destination=to;
  }
  stm();
  this.interval=function(val){
    if(val) interval=val;
    return interval;
  }
}
module.exports=function(env){
  environment=env;
  //singleton return
  return new(function(){
    //instancing function return;
    //some modules could have many different possible instances
    //some modules even instance themselves, like midi.
    this.instance=function(props){
      var clocks=[];
      destinationBase.call(this,environment);
      this.addClock=function(cprop){
        var newMetro=new MetronomePrototype(cprop);
        newMetro.setIndex(clocks.length);
        clocks.push(newMetro);
        return newMetro;
      }
      for(var a in props.clocks){
        this.addClock(props.clocks[a]);
      }
      this.getClocks=function(){
        return clocks;
      }
      this.setDestination=function(of,to){
        of.setDestination(to);
      }
    }

  })();
}
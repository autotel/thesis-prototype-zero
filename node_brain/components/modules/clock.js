'use strict';
var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
const onhandlers=require('onhandlers');
var environment=false;
var microStepDivide=12;

function MetronomePrototype(clockParent,props) {
  var props=props||{};
  var interval=62.5;
  if(props.interval) interval=props.interval;
  var microInterval=interval/microStepDivide;

  var currentStep=0;
  var currentMicroStep=0;

  this.clockMode="absolute";
  if(props.mode)this.clockMode=props.mode;

  var tMetro=this;
  var myIndex=0;
  //vars for anti drifting
  var absoluteMicroInterval=0;
  var absoluteMicroDrift=0;
  var timeAnchor=0;
  var microIterations=0;
  var microTickEventMessage=new eventMessage({destination:false,value:[0,0,microStepDivide]});

  this.event=microTickEventMessage;
  if(props.destination) microTickEventMessage.destination=props.destination;
  onhandlers.call(this);

  function tick(){
    tMetro.handle('tick');
    // console.log("ti");
    //todo: optionally send an absolute step message?.
  }
  function microTick(){
    // console.log("microTick",microTickEventMessage.value);
    //if(microTickEventMessage.destination!==tickEventMessage.destination) microTickEventMessage.destination=tickEventMessage.destination;
    // to send absolute steps:
    currentMicroStep%=microStepDivide;
    // console.log(currentMicroStep);
    if(currentMicroStep==0){
      tick();
    }
    microTickEventMessage.value[1]=currentMicroStep;
    if(microTickEventMessage.destination){
      environment.patcher.receiveEvent(microTickEventMessage);
    }
    // clockParent.handle('messagesend',{origin:tMetro,sub:myIndex,eventMessage:microTickEventMessage});
    currentMicroStep++;
  };
  function stm(){
    var hrtime=process.hrtime();
    var now=(hrtime[1]/1000000)+(hrtime[0]*1000);
    //anti drifting funcs
    microIterations++;
    var elapsed=now-timeAnchor;
    var nextInterval=(microIterations*microInterval)-elapsed;
    setTimeout(stm,nextInterval-absoluteMicroDrift);
    absoluteMicroInterval=(elapsed/microIterations);
    absoluteMicroDrift=microInterval-absoluteMicroInterval;
    // console.log("tick n "+currentMicroStep
    // +"\n  Tartget:"+microInterval
    // +"\n  Interval:"+absoluteMicroInterval
    // +"\n  drift:"+absoluteMicroDrift
    // +"\n  nextinterval:"+nextInterval);
    // operation functions
    microTick();
    // currentMicroStep++;
    // currentMicroStep%=microStepDivide;
  }
  this.setIndex=function(index){
    myIndex=index;
  }
  this.setDestination=function(to){
    // myDestination=to;
    tickEventMessage.destination=to;
  }
  this.receiveEvent=function(){
  }
  function start(){
    // timeAnchor=new Date();

    var hrtime=process.hrtime();
    timeAnchor=(hrtime[1]/1000000)+(hrtime[0]*1000);

    stm();
  }
  start();
  this.interval=function(val){
    if(val){
      interval=val;
      microInterval=interval/microStepDivide;
      var hrtime=process.hrtime();
      timeAnchor=(hrtime[1]/1000000)+(hrtime[0]*1000);
      microIterations=0;
    }
    return interval;
  }
  this.bpm=function(val){
    if(val){
      //60,000 / BPM = interval
      //bp/k=1/interval
      //bp=1/interval*k
      interval=60000/(val);
      microInterval=interval/microStepDivide;
      // console.log("cal",interval);
      return val;
    }else{
      return Math.floor((1/interval)*60000);
    }
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
      props=props||{};
      var clocks=[];
      this.clocks=clocks;
      destinationBase.call(this,environment);
      this.getClocksDestinations=function(){
        var ret={};
        for(var a in clocks){
          ret[a]=clocks[a].event.destination;
        }
        return ret;
      }
      this.addClock=function(cprop){
        var newMetro=new MetronomePrototype(this,cprop);
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
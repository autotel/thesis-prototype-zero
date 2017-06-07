'use strict';
var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
const onhandlers=require('onhandlers');
var environment=false;

function MetronomePrototype(clockParent,props) {
  var props=props||{};
  var interval=125;
  if(props.interval) interval=props.interval;
  var currentStep=0;
  var tMetro=this;
  var myIndex=0;
  //vars for anti drifting
  var absoluteInterval=0;
  var absoluteDrift=0;
  var timeAnchor=0;
  var iterations=0;
  // var myDestination=false;
  var tickEventMessage=new eventMessage({destination:false,value:[0,0,0]});
  this.event=tickEventMessage;
  if(props.destination) tickEventMessage.destination=props.destination;
  onhandlers.call(this);
  this.onTick=function(evt){
    tickEventMessage.value[1]=currentStep;
    if(tickEventMessage.destination){
      //console.log(tickEventMessage);
      environment.patcher.receiveEvent(tickEventMessage);
      clockParent.handle('messagesend',{origin:tMetro,sub:myIndex,eventMessage:evt});
    }
    tMetro.handle('tick',evt);
  };
  function stm(){
    //anti drifting funcs
    iterations++;
    var now=new Date();
    var elapsed=now-timeAnchor;
    absoluteInterval=(elapsed/iterations);
    absoluteDrift=interval-absoluteInterval;
    setTimeout(stm,interval+2*absoluteDrift);
    // console.log("tick");
    // console.log("  Tartget:"+interval);
    // console.log("  Interval:"+absoluteInterval);
    // console.log("  drift:"+absoluteDrift);
    // console.log("  nextinterval:"+(interval+2*absoluteDrift));
    //operation functions
    tMetro.onTick({step:currentStep,indexNumber:myIndex});
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
  this.receiveEvent=function(){
  }
  function start(){
    timeAnchor=new Date();
    stm();
  }
  start();
  this.interval=function(val){
    if(val){
      interval=val;
      timeAnchor=new Date();
      iterations=0;
    }
    return interval;
  }
  this.bpm=function(val){
    if(val){
      //60,000 / BPM = interval
      //bp/k=1/interval
      //bp=1/interval*k
      interval=60000/val
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
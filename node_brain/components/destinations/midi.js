'use strict';
var midi = require('midi');
var midiOutputs={};
var midiInputs={};
var eventMessage=require('../../datatype-eventMessage');
var child_process = require('child_process');
// Set up a new output.
module.exports=function(environment){return new (function(){
  if(!environment.patcher.destinations) environment.patcher.destinations={};
  // environment.patcher.destinations.midi=this;
  this.headerToDestination={
    0xF8:"clock",
  };
  console.log("midi setup:");
  // Count the available output ports.
  var outputPortCount=(new midi.output()).getPortCount();
  // console.log(output.getoutputPortCount());
  // Get the name of a specified output port.
  for(var a=0; a<outputPortCount; a++){
    var output = new midi.output();
    var portName=output.getPortName(a);
    console.log(" opening port["+a+"]="+portName);
    try{
      output.openPort(a);
      midiOutputs[portName]=output;
      environment.patcher.destinations[portName]=new(function(output){
        this.receive=function(evt){
          this.note(evt.value[0],evt.value[1],evt.value[2]);
        }
        this.note=function(chan,num,velo){
          var b=0x00;
          if(velo==0){
            b=0x80|(chan&0xf);
          }else{
            b=0x90|(chan&0xf);
          }
          // console.log("midi"+[b,num&0xff,velo&0xff]);
          output.sendMessage([b,num&0xff,velo&0xff]);
        }
        this.closeMidi=function(){
          // Close the port when done.
          output.closePort();
        }
        console.log("  created output "+portName);
      })(output);
    }catch(e){
      console.log("  creating "+portName+" output was not possible: ",e);
    }
  }

  var averageClockDelta=0;

  var closeHandler=function(e){
    createMidiInputs();
    console.log("midi input crashed",e);
  }
/*
  var createMidiInputs=function(){
    var child = child_process.fork('./components/destinations/midiInputWorkaround.js');
    child.send({type:"initialize",val:0});
    child.on('error', closeHandler);
    child.on('close', closeHandler);
    child.on('message', function(message) {
      // console.log('input sends:', message);
      if(message.val[0]==248){
        if(message.delta!=0){
          if(averageClockDelta=0){
            averageClockDelta=message.delta;
          }else{
            averageClockDelta=message.delta*0.999+averageClockDelta*0.001;
            console.log("average: "+averageClockDelta*2400);
            environment.metronome.interval(averageClockDelta*2400);
          }
        }
      }
    });
  };
  createMidiInputs();*/


  this.getMidiOutList=function(){return midiOutputs;}

  //library is broken. no midi inputs possible :(
  // var inputPortCount=(new midi.input()).getPortCount();
  // for(var a=0; a<inputPortCount; a++){
  //   try{
      // var a=sss;
      // var input = new midi.input();
      // var portName=input.getPortName(a);
      // console.log(" opening port["+a+"]="+portName);
      // input.openPort(a);
  //     midiInputs[portName]=input;
  //     input.on('message', function(deltaTime, message) {
  //       if(this.headerToDestination[message[0]]){
  //         var newEvent=new eventMessage({destination:this.headerToDestination[message[0]],data:message});
  //         environment.patcher.receiveEvent(newEvent);
  //       }
  //     });
  //   }catch(e){
  //     console.log("  creating "+portName+" input was not possible: ",e);
  //   }
  // }
  // this.getMidiInList=function(){return midiInputs;}
  return this;
})()};
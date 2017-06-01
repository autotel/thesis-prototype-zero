//not compatible with raspi
'use strict';
var jazz = require('jazz-midi');
var midi = new jazz.MIDI();

var midiOutputs={};
var midiInputs={};
var eventMessage=require('../../datatype-eventMessage');
// Set up a new output.
module.exports=function(environment){return new (function(){
  if(!environment.patcher.modules) environment.patcher.modules={};
  // environment.patcher.modules.midi=this;
  this.headerToDestination={
    0xF8:"clock",
  };
  console.log("midi setup:");
  // Count the available output ports.
  var outports=midi.MidiOutList();
  // console.log(output.getoutputPortCount());
  // Get the name of a specified output port.
  // for(var a=0; a<outports.length; a++){
  var a=1;
    var output = midi.MidiOutOpen(a);
    var portName=midi.MidiOutInfo(a);
    // console.log(" opening port["+a+"]="+portName);
    try{
      output.openPort(a);
      midiOutputs[portName]=output;
      var midiModule=new(function(output){
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
      environment.patcher.addModule(portName,midiModule);
    }catch(e){
      console.log("  creating "+portName+" output was not possible: ",e);
    }
  // }
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
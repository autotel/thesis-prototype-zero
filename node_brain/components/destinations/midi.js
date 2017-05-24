'use strict';
var midi = require('midi');
var midiOutputs={};
// Set up a new output.

module.exports=function(environment){return new (function(){
  if(!environment.patcher.destinations) environment.patcher.destinations={};
  // environment.patcher.destinations.midi=this;

  console.log("midi setup:")
  // Count the available output ports.
  var portCount=(new midi.output()).getPortCount();
  // console.log(output.getPortCount());
  // Get the name of a specified output port.
  for(var a=0; a<portCount; a++){
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
  this.getMidiList=function(){return midiOutputs;}
  //actually, should connecto to all available midi or have a config
  // output.openPort(1);
  // setInterval(function(){
  //   // Send a MIDI message.
  //   output.sendMessage([176,22,1]);
  // },100);

  return this;
})()};
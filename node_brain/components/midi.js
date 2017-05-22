'use strict';
var midi = require('midi');

// Set up a new output.
var output = new midi.output();
module.exports=function(environment){return new (function(){
  if(!environment.patcher.destinations) environment.patcher.destinations={};
  environment.patcher.destinations.midi=this;

  console.log("midi setup:");
  // Count the available output ports.
  console.log(output.getPortCount());
  // Get the name of a specified output port.
  for(var a=0; a<output.getPortCount(); a++){
    console.log("port["+a+"]="+output.getPortName(a));
  }
  //actually, should connecto to all available midi or have a config
  output.openPort(1);
  // setInterval(function(){
  //   // Send a MIDI message.
  //   output.sendMessage([176,22,1]);
  // },100);
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
  return this;
})()};
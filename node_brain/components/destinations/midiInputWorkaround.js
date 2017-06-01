/*
NPM midi input is broken, and provokes a fatal error when trying to create a midi
input is any other midi input or output has been created.
This file is ment to be opened as a branch process and hopefully will allow
to have input and output.

*/
var midi = require('midi');
var inputList=[];
var messageResponses={
  initialize:function(val){
    console.log("initializing MIDI inputs",val);
    var inputPortCount=(new midi.input()).getPortCount();
    for(var a=1; a<inputPortCount; a++){
      var input = new midi.input();
      var portName=input.getPortName(a);
      input.openPort(a);
      input.ignoreTypes(false, false, false);
      console.log(" opening in port["+a+"]="+portName);
      input.on('message',function(a,b){
        process.send({type:"midi",val:b,delta:a});
      });
    }
    process.send({type:"initResult",val:inputList});
  }
}
process.on('message', function(message) {
  if(messageResponses[message.type]){
    messageResponses[message.type](message.val);
  }
});
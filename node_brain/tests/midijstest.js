var midi = require('midi');

var outputPortCount=(new midi.output()).getPortCount();

var inputPortCount=(new midi.input()).getPortCount();
//
// for(var a=1; a<outputPortCount; a++){
//   var output = new midi.output();
//   var portName=output.getPortName(a);
//   output.openPort(a);
//   console.log(" opening out port["+a+"]="+portName);
//   setInterval(function(){
//     output.sendMessage([0x88,60,97]);
//     output.sendMessage([0x98,60,97]);
//   },1000);
// }

for(var a=1; a<inputPortCount; a++){
  var input = new midi.input();
  var portName=input.getPortName(a);
  input.openPort(a);
  input.ignoreTypes(false, false, false);
  console.log(" opening in port["+a+"]="+portName);
  input.on('message',function(a,b){console.log(b,a)});
}


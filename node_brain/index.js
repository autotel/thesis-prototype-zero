var SerialPort = require('serialport').SerialPort;
var prompt = require('prompt');

prompt.start();
var myPort;

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
  });
  console.log("select port ("+ports[0].comName+")");
  prompt.get(['pname'], function (err, result) {
    console.log('  selecting port: ' + result.pname);
    myPort = new SerialPort(result.pname||ports[0].comName,{
    baudRate: 38400,
    //  parser: SerialPort.parsers.readline("\n")
    });


    myPort.on('open', function(e){
    console.log(e);});
    myPort.on('data', function(e){
    console.log(e);});
    myPort.on('close', function(e){
    console.log(e);});
    myPort.on('error', function(e){
    console.log(e);});

    function sendToSerial(data) {
      for(var a =0 ; a<data.length; a+=2){
        data[a]=parseInt(data[a]+data[a+1],16);
        console.log("+"+data[a]);
      }
      console.log("sending to serial: " + data);
      myPort.write(data);
    }
    function promptMessage(){
      prompt.get(['send'], function (err, result) {
        sendToSerial(result.send);
        promptMessage();
      });
    }

    promptMessage();

  });
});


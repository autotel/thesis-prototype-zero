var SerialPort = require('serialport');
var port = new SerialPort('COM21',{ baudRate: 115200 });
var question=require('./components/interactive-console.js');
var count=0;
port.on('open', function() {
  port.write("Hello from usbserial", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('out');
  });
  port.on('data', function (data) {
    console.log('in: ' + data);
  });

  setInterval(function(){
    port.write('hi there'+count);
    console.log("out:"+'hi there'+count);
    count++;
  },800);

  // function ask(){
  //   question('>>:',function(a){
  //     port.write(a,function(error){  if (error) console.error("message not sent: ",e)});
  //     ask();
  //   });
  // }
  // ask();

});

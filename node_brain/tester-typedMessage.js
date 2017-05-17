var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0',{ baudRate: 19200 });//
var question=require('./components/interactive-console.js');
var count=0;
port.on('open', function() {
  console.log("serial opened");
  var inBuff=new Buffer(3);
  var expectedHeader=0x8;
  var expectedLength=3;
  var byteNumber=0;
  var recordingBuffer=false;

  port.on('data', function (data) {
    for(var a=0; a<data.length; a++){
      if(!recordingBuffer)
        recordingBuffer=data[a]==expectedHeader;

      if(recordingBuffer){
        if(byteNumber<expectedLength-1){
          inBuff[byteNumber]=data[a];
          byteNumber++;
        }else{
          inBuff[byteNumber]=data[a];
          recordingBuffer=false;
          console.log(inBuff);
          byteNumber=0;
        }
      }else{
        console.log("inv:",data[a]);
      }
    }
  });

  // setInterval(function(){
  //   port.write(count);
  //   // console.log("out:"+'hi there'+count);
  //   count++;
  // },800);

  // function ask(){
  //   question('>>:',function(a){
  //     port.write(a,function(error){  if (error) console.error("message not sent: ",e)});
  //     ask();
  //   });
  // }
  // ask();

});

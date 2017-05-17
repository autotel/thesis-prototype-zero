var SerialPort = require('serialport');

var question=require('./components/interactive-console.js');


var comConsts=require('./components/constants.js');
var tHeaders=comConsts.tHeaders;
var tLengths=comConsts.tLengths;
var rHeaders=comConsts.rHeaders;
var rHNames=comConsts.rHNames;
var rLengths=comConsts.rLengths;
var baudRate=comConsts.baudRate;
var eoString=comConsts.eoString;

var port = new SerialPort('/dev/ttyUSB0',{ baudRate: baudRate });//



var count=0;
port.on('open', function() {
  console.log("serial opened");

  var inBuff;
  var expectedLength;

  var byteNumber=0;
  var recordingBuffer=false;

  //would be nice that this part was handled by a DLL file ot something like that. Js is too high level
  port.on('data', function (data) {
    for(var a=0; a<data.length; a++){
      if(!recordingBuffer){
        //we are expecting a message header, so we check what header current byte is
        //if is successfull, we start gathering or recording a new data packet.

        //byte  is in our header list?
        recordingBuffer=rLengths.length>=data[a];

        if(recordingBuffer){
          // console.log(rLengths[data[a]]);
          expectedLength=rLengths[data[a]]+1;
          inBuff=new Buffer(expectedLength);
          byteNumber=0;
        }
      }

      if(recordingBuffer){
        if(byteNumber<expectedLength-1){
          //a new byte arrived and is added to the current packet
          inBuff[byteNumber]=data[a];
          byteNumber++;
        }else{
          //a whole expected packet arrived
          inBuff[byteNumber]=data[a];
          recordingBuffer=false;
          console.log(inBuff);
          byteNumber=0;

        }
      }else{
        //a byte arrived, but there is no packet gathering bytes
        console.log("invalid: ",data[a]);
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

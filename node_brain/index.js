var prompt = require('prompt');
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
//headers for output
var tHeaders={
  hello:0x1,
  ledMatrix:0x2,
  screenA:0x3,
  screenB:0x4,
}
//headers for input
var rHeaders={
  hello:0x1,
  buttonMatrix:0x2,
  selectorButton:0x3,
  encoderScroll:0x4,
  encoderButton:0x5,
}
/*

//headers to communicate with the 'brain' controller
#define RH_hello 0x1
#define RH_ledMatrix 0x2
#define RH_screenA 0x3
#define RH_screenB 0x4
#define RH_hello 0x1

#define TH_buttonMatrix 0x2
#define TH_selectorButton 0x3
#define TH_encoderScroll 0x4
#define TH_encoderButton 0x5
*/
function updateScreen(){};
var currentStep=0;
setInterval(function(){
  currentStep++;
  currentStep%=16;
  updateScreen();
},100);

raspi.init(() => {
  var serial = new Serial();
  serial.open(() => {

    var hardware=new(function(){
      var tHardware=this;
      this.log=function(theString){
        theString=JSON.stringify(theString);
        theString=theString.substring(0,15);
        tHardware.sendx8(tHeaders.screenA,theString);
        tHardware.sendx8(tHeaders.screenB,theString);
      };
      this.sendx8=function(header,dataArray){
        if(dataArray.constructor !== Array)
          dataArray=Array.from(dataArray);
        dataArray.unshift(header&0xff);
        var buf1 = Buffer.from(dataArray);
        serial.write(buf1);
        // console.log("sent",buf1);
      }
      this.sendx8_16=function(header,dataArray){
        var arr8=[];
        for(var a of dataArray){
          arr8.push(a&0xff);
          arr8.push((a>>8)&0xff);
        }
        if(dataArray.constructor !== Array)
          dataArray=Array.from(dataArray);
        arr8.unshift(header&0xff);
        var buf1 = Buffer.from(arr8);
        serial.write(buf1);
        // console.log("sent",buf1);
      }

      return this;
    })();

    console.log("serial connected");
    serial.write(tHeaders.hello);
    updateScreen=function(){

      // hardware.sendx8(tHeaders.ledMatrix,[0xff,0xff,0xff,0xff,0xff,0xff]);
      var seqB=pattern.getBitmapx16();
      hardware.sendx8_16(tHeaders.ledMatrix,[seqB^0x0001<<currentStep,seqB,0x0001<<currentStep]);
    }
    serial.on('data', (data) => {
      if(data[0]==rHeaders.buttonMatrix){
        // console.log("buttonMatrix",data);
        if(data[2]!=0){
          pattern.store(data[1],!pattern.getBoolean(data[1]));
        }
        updateScreen();
        // hardware.log("buttonMatrix");
      }else if(data[0]==rHeaders.selectorButton){
        // console.log("selectorButton",data);
        // hardware.log("selectorButton");
      }else if(data[0]==rHeaders.encoderScroll){
        // console.log("encoderScroll",data);
        hardware.log("mimimi");
      }else if(data[0]==rHeaders.encoderButton){
        // console.log("encoderButton",data);
        // hardware.log("encoderButton");
      }else{
        // console.log("unknown",data);
        // hardware.log("unknown");
      }
    });
  });
});
//pattern should store messages, that were defined in other part of this project.
var pattern=new(function(){
  tPattern=this;
  var patData={};
  this.store=function(place,data){
    patData[place]=data;
  }
  this.getBoolean=function(place){
    return patData[place]||false;
  };
  this.getBitmapx16=function(){
    var ret=0x0000;
    for(var a=0; a<16;a++){
      if(patData[a]){
        ret|=0x1<<a;
      }
    }
    return ret;
  }
  return this;
})();


var midi = require('midi');

// Set up a new output.
var output = new midi.output();

// Count the available output ports.
console.log(output.getPortCount());

// Get the name of a specified output port.
console.log(output.getPortName(0));

// Open the first available output port.
console.log(output.openPort(0));
setInterval(function(){
  // Send a MIDI message.
  output.sendMessage([176,22,1]);
},100);

// Close the port when done.
output.closePort();
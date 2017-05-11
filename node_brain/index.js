// var prompt = require('prompt');
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
const readline = require('readline');
const baudRate=115200;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function q(){
  rl.question('js:', (answer) => {
    // console.log(answer);
    if(answer=="x"){
      process.exit();
    }
    console.log("eval:");
    try{
      console.log(eval(answer));
    }catch(e){
      console.log("error:");
      console.log(e);
    }
    // rl.close();
    q();
  });
};


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
//inverse array for instant lookup
var rHNames=[];
for(var a in rHeaders){
  rHNames[rHeaders[a]]=a;
}
console.log(rHNames);
//lookup on how to chop the incoming buffer
var rLengths={
  int:2,
  char:1,
  string:false,//if false, waits for a line ending or something
  float:4,
  hello:0,
  buttonMatrix:4,
  selectorButton:2,
  encoderScroll:2,
  encoderButton:1,
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
function getChoppedData(from){
  var ret=[];
  //never use short iterator for arrayBuffers!
  var a=0;
  while(a<from.length){
    // console.log(from[a]+":");
    //get message header and it's expected message length
    var currentHeader=rHNames[from[a]];
    var currentLen=rLengths[currentHeader];
    a++;
    //false currentLen indicates that a end character indicates the end of buffer
    if(currentLen===false){
      console.log("using untested undefined length stream");
      currentLen=(from.indexOf(0x3)||from.length)-a;
    }
    if(currentLen){
      // ret.push(currentHeader+":"+currentLen+"="+a);
      ret.push({type:currentHeader,data:from.slice(a,a+currentLen)});
      // console.log(" ->"+currentHeader+", "+rLengths[currentHeader]);
      a+=currentLen;
    }else{
      ret.push({type:currentHeader,data:[false]});
    }
  }
  // console.log(ret);
  return ret;
}
raspi.init(() => {
  var serial = new Serial({baudRate:baudRate});
  serial.open(() => {

    var rEventHandlers={
      buttonMatrix:function(data){
        console.log("buttonMatric event"+data[0]);
        if(data[1]!=0){
          pattern.store(data[0],!pattern.getBoolean(data[0]));
        }
        updateScreen();
      }
    }

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

    console.log("serial connected-");
    serial.write(tHeaders.hello);
    updateScreen=function(){

      // hardware.sendx8(tHeaders.ledMatrix,[0xff,0xff,0xff,0xff,0xff,0xff]);
      var seqB=pattern.getBitmapx16();
      hardware.sendx8_16(tHeaders.ledMatrix,[seqB^0x0001<<currentStep,seqB,0x0001<<currentStep]);
    }
    serial.on('data', (data) => {

      var chd=getChoppedData(data);
      for(var event of chd){
        console.log(event.type);
        if(event.data){
          // console.log(event.type,event.data[0]);
          if( typeof rEventHandlers[event.type] ==='function' ){
             rEventHandlers[event.type](event.data);
          }
        }else{
            console.log("wrong event: ",event);
        }
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


// q();
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
const listens=require('onhandlers');

const baudRate=115200;
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
module.exports=new (function(){
  var tHardware=this;
  listens.call(this);
  raspi.init(() => {
    var serial = new Serial({baudRate:baudRate});
    serial.open(() => {
      tHardware.handle('serialopened');
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
      tHardware.updateLeds=function(bitmaps){
        // hardware.sendx8(tHeaders.ledMatrix,[0xff,0xff,0xff,0xff,0xff,0xff]);

        hardware.sendx8_16(tHeaders.ledMatrix,bitmaps);
      }
      serial.on('data', (data) => {
        var chd=getChoppedData(data);
        for(var event of chd){
          tHardware.handle('interaction',event);
          tHardware.handle(event.type,event);
        }
      });
    });
  });
  return this;
})();
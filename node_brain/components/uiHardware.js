'use strict';
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
const listens=require('onhandlers');
const comConsts=require('./constants.js');

var tHeaders=comConsts.tHeaders;
var tLengths=comConsts.tLengths;
var rHeaders=comConsts.rHeaders;
var rHNames=comConsts.rHNames;
var rLengths=comConsts.rLengths;
var baudRate=comConsts.baudRate;
var eoString=comConsts.eoString;
console.log(comConsts);

function getChoppedData(from){
  var ret=[];
  //never use short iterator for arrayBuffers!
  var a=0;
  while(a<from.length){
    // console.log(from[a]+":");
    //get message header and it's expected message length
    var currentHeader=rHNames[from[a]];
    var currentLen=rLengths[from[a]];
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
      (function(){

        // this.log=function(theString){
        //   theString=JSON.stringify(theString);
        //   theString=theString.substring(0,15);
        //   tHardware.sendx8(tHeaders.screenA,theString);
        //   tHardware.sendx8(tHeaders.screenB,theString);
        // };
        this.sendx8=function(header,dataArray){
          if(dataArray.constructor !== Array)
            dataArray=Array.from(dataArray);
          dataArray.unshift(header&0xff);
          var buf1 = Buffer.from(dataArray);
          serial.write(buf1);

          console.log("sent",buf1);
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

          console.log("sent",buf1);
        }
        this.sendScreenA=function(str){
          sendString(tHeaders.screenA,str);
        }
        this.sendScreenB=function(str){
          sendString(tHeaders.screenB,str);
        }
        var sendString=function(header,string){
          console.log(header,string);
          if(tLengths[header]!=="unknown"){
            console.warn("warning: this header is not specified for unknown lengths");
          }
          var arr8=[];
          for(var a in string){
            arr8.push(string.charCodeAt(a));
          }
          arr8.unshift(header&0xff);
          arr8.push(eoString);
          var buf1 = Buffer.from(arr8);
          // console.log("send str len"+buf1.length);
          serial.write(buf1);
          console.log("sent",buf1);
        }

        tHardware.handle('serialopened');
      }).call(tHardware);

      // console.log("serial connected-");
      serial.write(tHeaders.hello);
      console.log("wrote hello");



      tHardware.updateLeds=function(bitmaps){
        // tHardware.sendx8_16(tHeaders.ledMatrix,[0xff,0xff,1,1,0xff,0xff]);

        tHardware.sendx8_16(tHeaders.ledMatrix,bitmaps);
      }
      serial.on('data', (data) => {
        console.log("recv",data);
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
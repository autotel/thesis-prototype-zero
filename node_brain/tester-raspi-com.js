'use strict';
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
const comConsts=require('./components/constants.js');
var serialPort="/dev/ttyUSB0";

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
var count=0;
// listens.call(this);
raspi.init(() => {
  var serial = new Serial({baudRate:baudRate,portId:serialPort});
  serial.open(() => {
    var sendx8=function(header,dataArray){
      if(dataArray.constructor !== Array)
        dataArray=Array.from(dataArray);
      dataArray.unshift(header&0xff);
      var buf1 = Buffer.from(dataArray);
      serial.write(buf1);
      console.log("send:",buf1);
    }
    var sendx8_16=function(header,dataArray){
      var arr8=[];
      for(var a of dataArray){
        arr8.push(a&0xff);
        arr8.push((a>>8)&0xff);
      }
      // console.log("aa");
      if(dataArray.constructor !== Array)
        dataArray=Array.from(dataArray);
      arr8.unshift(header&0xff);
      var buf1 = Buffer.from(arr8);
      serial.write(buf1);
      console.log("send:",buf1);
    }
    var updateLeds=function(bitmaps){
      sendx8_16(tHeaders.ledMatrix,bitmaps);
    }
    serial.on('data', (data) => {
      console.log("recv:",data);
      var chd=getChoppedData(data);


      sendx8_16(tHeaders.ledMatrix,[0x1<<count,0x1<<count,0x1<<count]);


    });
    setInterval(function(){
      sendx8(tHeaders.comTester,[count]);

      count++;
      count%=0xf;
    },500);
  });
});
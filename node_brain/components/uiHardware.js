'use strict';
const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
// const listens=require('onhandlers');
const comConsts=require('./constants.js');
//fastest is hardware GPIO UART. by the way this is the default of the lubrary
// var serialPort="/dev/ttyAMA0"
//But if you happened to fry the GPIO UART, you can use a USB port
var serialPort="/dev/ttyUSB0";


var tHeaders=comConsts.tHeaders;
var tLengths=comConsts.tLengths;
var rHeaders=comConsts.rHeaders;
var rHNames=comConsts.rHNames;
var rLengths=comConsts.rLengths;
var baudRate=comConsts.baudRate;
var eoString=comConsts.eoString;

var lazyStack=new (function(){
  var stack=[];
  var interval=1;
  this.enq=function(cb){
    stack.push(cb);
  }
  setInterval(function(){
    if(stack.length>0){
      stack[0]();
      stack.splice(0,1);
    }
  },interval);
})();

var lastSentBitmap={
  bitmap:[0,0,0],
  screenA:"",
  screenB:""
};

// console.log(comConsts);

var dataChopper=new(function(){
  var inBuff;
  var expectedLength;
  var byteNumber=0;
  var recordingBuffer=false;
  this.wholePacketReady=function(packet){
    // console.log("packet ready",packet);
  }
  this.incom= function(data){
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
          this.wholePacketReady(inBuff);
          recordingBuffer=false;
          // console.log(inBuff);
          byteNumber=0;
        }
      }else{
        //a byte arrived, but there is no packet gathering bytes
        /**/console.log("invalid byte: ",data[a], "in the context of: ", data);
      }
    }
  }
  return this;
})();

module.exports=function(environment){return new (function(){
  if(typeof environment.on!=="function"){
    console.error("uiHardware provided environment must have event listeners");
    return false;
  }
  var tHardware=this;
  // listens.call(this);
  raspi.init(() => {
    var serial = new Serial({baudRate:baudRate,portId:serialPort});
    serial.open(() => {
      serial.write(tHeaders.hello);
      // console.log("wrote hello");


      var sendx8=function(header,dataArray){
        lazyStack.enq(function(){
          if(dataArray.constructor !== Array)
            dataArray=Array.from(dataArray);
          dataArray.unshift(header&0xff);
          var buf1 = Buffer.from(dataArray);
          serial.write(buf1);
        });
      }

      var sendx8_16=function(header,dataArray){
        lazyStack.enq(function(){
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

          // console.log("sent",buf1);
        });
      }
      var sendString=function(header,string){
        lazyStack.enq(function(){
          // console.log(header,string);
          if(tLengths[header]!=="unknown"){
            console.warn("warning: this header is not specified for unknown lengths");
          }
          var arr8=[];
          for(var a in string){
            arr8.push(string.charCodeAt(a));
            // console.log(string.charCodeAt(a));
          }
          arr8.push('\0');
          arr8.unshift(0xff&arr8.length);
          arr8.unshift(header&0xff);
          // console.log(arr8.length);
          // arr8.push(eoString);
          var buf1 = Buffer.from(arr8);
          // console.log(buf1);
          // console.log("string of "+buf1.length);
          // console.log("send str len"+buf1.length);
          serial.write(buf1);
          // console.log("sent",buf1);
        });
      }
      var sendScreenA=function(str){
        sendString(tHeaders.screenA,str.substring(0,16));
      }
      var sendScreenB=function(str){
        sendString(tHeaders.screenB,str.substring(0,16));
      }
      this.sendScreenA=sendScreenA;
      this.sendScreenB=sendScreenB;
      var updateLeds=function(bitmaps){
        // tHardware.sendx8_16(tHeaders.ledMatrix,[0xff,0xff,1,1,0xff,0xff]);
        sendx8_16(tHeaders.ledMatrix,bitmaps);
        lastSentBitmap.bitmap=bitmaps;
        // sendx8(tHeaders.ledMatrix,bitmaps);
      }
      tHardware.testByte=function(byte){
        sendx8(tHeaders.comTester,[byte]);
      }
      tHardware.draw=updateLeds;
      //pendant: make a function that takes shorter to communicate
      tHardware.updateLayer=function(n,to){
        if(n<3){
          lastSentBitmap[n]=to&0xffff;
          updateLeds(bitmaps);
        }else{
          console.error("tried to update layer "+n+" which doesnt exist");
        }
      }
      environment.handle('serialopened');

      serial.on('data', (data) => {
        // console.log("       data:",data);
        dataChopper.incom(data);
      });

      dataChopper.wholePacketReady=function(chd){
        // console.log("------------packet",chd);
        // console.log(data);
        if(chd&&chd[0]!==rHeaders.null){
          // console.log("-------handle",chd);
          var event={
            type:rHNames[chd[0]],
            data:chd.slice(1),
            originalMessage:chd
          }
          // console.log("recv",chd);
          environment.handle('interaction',event);
          environment.handle(event.type,event);
        }
      }



    });
  });
  return this;
})() };
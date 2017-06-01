'use strict';
//client side!

//apply this functions to element that have data binding with the server,
//it adds the local flag, that can be used to choose wether changes are emitted
//or they happen only locally. On a node listening event we want them to happen
//only locally, but when the user changes them, we want them to be emitted to the
//server
// var glocal=function(){
//   thisThing=this;
//   this.locally=function(targetFn,params){
//     targetFn(params,true);
//   }
//   this.bind=function(changeFunction,messageName,dataParams){
//     return function(params,localFlag){
//       var normalizedParams=changeFunction(params);
//       if(!localFlag){
//         normalizedParams.unique=thisThing.unique;
//         socketMan.requestChange(messageName,normalizedParams);
//       }
//     }
//   }
// }

var globalBindFunction;
var uniqueArray=[];
var socketMan=new (function(){
  var socket = io();

  getMessageNames(this);
  var messageIndexes=this.messageIndexes;
  var messageNames=this.messageNames;

  var applyReceivedProperties=function(e){
    document.getElementById('stage').html+="<br>"+JSON.stringify(e);
  }

  socket.on(messageIndexes.CHANGE, function(e){
    applyReceivedProperties(e);
  });
  socket.on(messageIndexes.HELLO, function(e){
    console.log("socket hello:",e);
  });
  socket.on(messageIndexes.CONSOLE, function(e){
    console.log("socket console:",e);
  });
  socket.on(messageIndexes.CREATE,function(e){
    console.log("socket created a module",e);
    var modl;
    var c=e.unique;
    var mode=e.mode;
    //pendant: remove this local id nonesense
    var localId=modules.length;
    modl=new CodeModule(layer,localId);
    modules.push(modl);
    modl.setMode(mode);
    modl.unique=e.unique;
    uniqueArray[e.unique]=modl;

    applyReceivedProperties(e);
  });
	window.addEventListener("beforeunload", function(e){
	  socket.close();
	});

  this.requestCreation=function(prototype){
    // console.log("socket",e,messageIndexes.CREATE);
    console.log({x:prototype.x,y:prototype.y,mode:prototype.modeName},prototype);
    socket.emit(messageIndexes.CREATE,{x:prototype.sprite.attrs.x,y:prototype.sprite.attrs.y,mode:prototype.modeName});
  }
  this.requestChange=function(messageName,params){
    socket.emit(messageName,params);
  }
  globalBindFunction=this.bindFunction=function(normalChanges){
    // normalChanges.global=true;
    socket.emit(messageIndexes.CHANGE,normalChanges);
  }
  this.connectBindFunction=function(from,chn,to){
    var change={unique:from.unique};
    change["connection."+chn]=to.unique;
    globalBindFunction(change);
  }
  this.disconnectBindFunction=function(from,chn,to){
    var change={unique:from.unique};
    change["connection."+chn]=-1;
    globalBindFunction(change);
  }
  this.connectionCreated=function(e){
    socket.emit(messageIndexes.CONNECT,{fromid:e.from.unique,toid:e.to.unique});
  }


  return this;
});
'use strict';
//client side!

var globalBindFunction;
var uniqueArray=[];
var socketMan=new (function(){
  var socket = io();

  getMessageNames(this);
  var messageIndexes=this.messageIndexes;
  var messageNames=this.messageNames;


  socket.on(messageIndexes.CHANGE, function(e){
  });
  socket.on(messageIndexes.HELLO, function(e){
    console.log("socket hello:",e);
  });
  socket.on(messageIndexes.CONSOLE, function(e){
    console.log("socket console:",e);
  });
  socket.on(messageIndexes.CREATE,function(e){
    console.log("socket created a module",e);
    uniqueArray[e.unique]=Ui.addSprite(e);
  });
  //not implemented yet
  socket.on(messageIndexes.CONNECT,function(e){
    console.log("socket linked a module",e);
    Ui.addLink(uniqueArray[e.fromUnique],uniqueArray[e.toUnique]);
  });
  socket.on(messageIndexes.EVENT,function(e){
    console.log("socket reported event",e);
    Ui.representEvent(uniqueArray[e.unique],e);
  });
  //not implemented yet
  socket.on(messageIndexes.DELETE,function(e){
    console.log("socket removed a module",e);
    Ui.removeSprite(uniqueArray[e.unique]);
    delete uniqueArray[e.unique];
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
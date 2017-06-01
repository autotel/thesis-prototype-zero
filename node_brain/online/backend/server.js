'use strict';
var onHandlers=require('onhandlers');
var httpPort=80;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var SocketMan = require('socket.io')(http);
var getMessageNames=require('../bothEnds/messageNames.js');
var SocketClient = require('./SocketClient.js');


module.exports=function(nodeServer){ return new (function(nodeServer){
  onHandlers.call(this);
  var serverMan=this;

  var socketClients=new SocketClient(this);
  getMessageNames(this);

  this.start=function(file){
    app.get('/', function(req, res){
      /*
      var directory = require('serve-index');
       app.use(directory(your_path));
      */
      app.use("/",express.static('./online/frontend'));
      app.use("/shared",express.static('./online/bothEnds'));
      res.sendFile(file);
    });
    http.listen(httpPort, function(){
      console.log('listening on :'+httpPort);
    });
    SocketMan.on('connection', function(socket){
      socketClients.add(socket,nodeServer);
      //emit current state
      // nodeServer.systemManager.each(function(){
      //   var nparams=this.getOntoParams();
      //   socket.emit(serverMan.messageIndexes.CREATE,nparams);
      // });
      // nodeServer.systemManager.each(function(){
      //   var nparams=this.getAllParameters();
      //   socket.emit(serverMan.messageIndexes.CHANGE,nparams);
      // });
    });

  }



//pseudo code
  // SocketMan.on('message',function(event){
  //   var newEvent=event;
  //   console.log(event);
  //   this.handle(event.message,event);
  // });

  this.emit=function(a,b){
    SocketMan.emit(a,b);
  }

  return this;
})(nodeServer)};
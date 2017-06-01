//this is created when a client connects to the socket, and keeps track of the user and it's events and so on.
var socketList=[];

var onHandlers=require('onHandlers');

var SocketClient=function(socket,master){
  var server=master.httpSocket;
  console.log('a client connected');
  console.log(master);
  onHandlers.call(this);
  socketList.push(this);
  socket.emit(server.messageIndexes.HELLO,"hellolo");
  var thisClient=this;

  for(var a in server.messageNames){
    (function(mtn){
      var messageName=server.messageNames[mtn];
      socket.on(mtn,function(e){
        var event={
          originalEvent:e,
          client:thisClient,
          messageName:messageName,
          messageIndex:mtn
        };
        console.log(JSON.stringify(event));
        server.handle('message',event);
        server.handle("rec_"+messageName.toLowerCase(),event);
      });
    })(a);
  }

  socket.on(server.messageIndexes.CREATE,function(event){
    console.log("component create requested");
    master.systemManager.createComponent(event,function(params){
      socket.broadcast.emit(server.messageIndexes.CREATE,params);
      socket.emit(server.messageIndexes.CREATE,params);
    });
  });
  socket.on(server.messageIndexes.CHANGE,function(params){
    master.systemManager.tweakComponent(params,function(original){
      socket.broadcast.emit(server.messageIndexes.CHANGE,params);
    });
  });





  socket.on('disconnect',function(e){
    console.log("client disconnected");
  });
}

module.exports=function(server){
  onHandlers.call(this);
  this.add=function(socket,master){
    return new SocketClient(socket,master);
  }
  this.each=function(cb){
    for(var a in socketList){
      cb.call(socketList[a],{index:a});
    }
  }
  return this;
};
var bindedModules=[];
module.exports=function(environment){
  //rename some intricate variables to locals
  var header=environment.server.messageIndexes;
  var myBroadcaster=environment.server.httpSocket;

  console.log(header);
  return new (function(){
    environment.patcher.on('modulecreated',function(ev){
      console.log(ev);
      myBroadcaster.broadcast(header.CREATE);
    });

  })();
}
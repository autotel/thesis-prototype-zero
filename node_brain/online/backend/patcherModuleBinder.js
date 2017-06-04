var uniques=require('./idToObject.js');
var bindedModules=uniques.whoIs;
module.exports=function(environment){
  //rename some intricate variables to locals
  var header=environment.server.messageIndexes;
  var myBroadcaster=environment.server.httpSocket;



  environment.patcher.on('modulecreated',function(ev){
    /**/console.log(ev);
    var newUnique=uniques.add({
      original:ev.module,
      trackedData:{
        type:ev.type,
        name:ev.name,
      },
    });
    bindedModules[newUnique].trackedData.unique=newUnique;
    var data=bindedModules[newUnique].trackedData;
    myBroadcaster.broadcast(header.CREATE,data);
  });
  return new (function(){
    this.eachData=function(callback){
      for(var a in bindedModules){
        if(bindedModules[a])
        callback(bindedModules[a].trackedData,a);
      }
    }
  })();
}
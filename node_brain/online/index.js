'use strict';
var nodeServer={};
var httpSocket=require('./backend/httpSocket.js');
var systemManager=require('./backend/patcherModuleBinder.js');
var getMessageNames=require('./bothEnds/messageNames.js');
module.exports=function(environment){
  getMessageNames(nodeServer);

  environment.server=nodeServer;
  nodeServer.httpSocket = httpSocket(nodeServer);
  nodeServer.binder = systemManager(environment);

  // console.log("modules:",nodeServer.modules);
  nodeServer.httpSocket.start(__dirname + '/frontend/index.html');
}

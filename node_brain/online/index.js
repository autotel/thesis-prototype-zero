'use strict';
var nodeServer={};
var httpSocket=require('./backend/server.js');
var systemManager=require('./backend/patcherModuleBinder.js');
module.exports=function(environment){

  nodeServer.httpSocket = httpSocket(nodeServer);
  nodeServer.binder = systemManager(environment);

  environment.server=nodeServer;
  // console.log("modules:",nodeServer.modules);
  nodeServer.httpSocket.start(__dirname + '/frontend/index.html');
}

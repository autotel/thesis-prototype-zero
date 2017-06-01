'use strict';
var master={};
master.httpSocket = require('./backend/server.js')(master);
module.exports=function(environment){
  master.modules=environment.patcher.modules;
  console.log("modules:",master.modules);
  var httpSocket=master.httpSocket;
  var systemManager=master.systemManager;
  httpSocket.start(__dirname + '/frontend/index.html');
}

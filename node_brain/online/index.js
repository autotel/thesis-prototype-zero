'use strict';
var master={};
master.httpSocket = require('./backend/server.js')(master);
module.exports=function(environment){
  master.destinations=environment.patcher.destinations;
  console.log("destinations:",master.destinations);
  var httpSocket=master.httpSocket;
  var systemManager=master.systemManager;
  httpSocket.start(__dirname + '/frontend/index.html');
}

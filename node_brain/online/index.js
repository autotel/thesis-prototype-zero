var master={};

master.outputManager = require('./backend/outputManager.js')(master);
master.httpSocket = require('./backend/server.js')(master);
master.systemManager = require('./backend/systemManager.js')(master);
var outputManager=master.outputManager;
var httpSocket=master.httpSocket;
var systemManager=master.systemManager;

httpSocket.start(__dirname + '/frontend/index.html');

outputManager.midi.play(0);
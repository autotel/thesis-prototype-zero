var constants=require('./input');
var fs = require('fs');

//add an identifier for each message name
var c=0;

var jsOutput={
  tHeaders:{},
  tLengths:[],
  rHeaders:{},
  rHNames:[],
  rLengths:[],
  baudRate:constants.baudRate,
  eoString:constants.eoString,
};
var cOutput="//these constants are shared between brain and this, and thus should be updated with the update app\n";
cOutput+="#define SOFT_BAUDRATE "+constants.baudRate+"\n";
cOutput+="#define EOMessage "+constants.eoString+"\n";
cOutput+="#define unknown -1\n";

cOutput+="\n//recieve headers \n";

for(var a in constants.messagesToArduino){
  var message=constants.messagesToArduino[a];
  message.identifier=c;
  jsOutput.tHeaders[a]=c;
  jsOutput.tLengths[c]=message.payload;
  cOutput+="#define RH_"+a+" 0x"+c.toString(16)+"\n";
  if(message.payload=="unknown"){
    cOutput+="#define RH_"+a+"_len -1\n";
  }else{
    cOutput+="#define RH_"+a+"_len 0x"+message.payload.toString(16)+"\n";
  }
  c++;
}
cOutput+="\n//transmit headers \n";

c=0;
for(var a in constants.messagesFromArduino){
  var message=constants.messagesFromArduino[a];
  message.identifier=c;
  jsOutput.rHeaders[a]=c;
  jsOutput.rHNames[c]=a;
  jsOutput.rLengths[c]=message.payload;
  cOutput+="#define TH_"+a+" 0x"+c.toString(16)+"\n";
  if(message.payload=="unknown"){
    cOutput+="#define TH_"+a+"_len -1\n";
  }else{
    cOutput+="#define TH_"+a+"_len 0x"+message.payload.toString(16)+"\n";
  }
  c++;
}

//write javascript format constants
fs.writeFile ('constants.js', "module.exports="+JSON.stringify(jsOutput), function(err) {
  if (err) throw err;
  console.log('complete');
});
//write c format constants
fs.writeFile ('_0_comConst.ino', cOutput, function(err) {
  if (err) throw err;
  console.log('complete');
});

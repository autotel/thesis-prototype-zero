
module.exports.baudRate=115200;//230400;//9600;//
module.exports.eoString=0x3;
module.exports.receptionStatemetStart="void messageReceived(byte datarray [], int len) {\n\
  int a = 0;\n\
  //lcdPrintB(String(len));\n\
  while (a < len) {\n\
    byte currentHeader = datarray[a];\n\
    a++;\n\
    switch (currentHeader) {\n"
module.exports.messagesToArduino={
  null:{
    payload:0,
    reception:'',
  },
  //user friendly name
  hello:{
    payload:0,//amount of bytes that the message contains
    reception:'lcdPrintA("rcv hello");',
  },
  ledMatrix:{
    payload:6,//amount of bytes that the message contains
    reception:'layers[0] = datarray[a + 0] | (datarray[a + 1] << 8);\n\
    layers[1] = datarray[a + 2] | (datarray[a + 3] << 8);\n\
    layers[2] = datarray[a + 4] | (datarray[a + 5] << 8);',
  },
  //user friendly name
  screenA:{
    payload:'unknown',//amount of bytes that the message contains
    reception:false,
  },
  //user friendly name
  screenB:{
    payload:'unknown',//amount of bytes that the message contains
    reception:false,
  },
  mode_none:{
    payload:0,
    reception:false,
  },
  mode_perform:{
    payload:2,//bitmap a, bitmap b
    reception:false,
  },
  mode_sequencer:{
    payload:2,//bitmap a, bitmap b
    reception:false,
  },
  mode_scale:{
    payload:2,//bitmap a, bitmap b
    reception:false,
  },
  currentStep:{
    payload:2,//step int a, step int b (ls)
    reception:false,
  },
  interfaceMap:{
    payload:3,//which, new value a, new value b
    reception:false,
  }
};
module.exports.messagesFromArduino={
  null:{
    payload:0
  },
  hello:{
    payload:0
  },
  buttonMatrixPressed:{
    payload:4
  },
  buttonMatrixReleased:{
    payload:4
  },
  buttonMatrixHold:{
    payload:4
  },
  buttonMatrixVelocity:{
    payload:4
  },
  selectorButtonPressed:{
    payload:2
  },
  selectorButtonReleased:{
    payload:2
  },
  encoderScroll:{
    payload:2
  },
  encoderPressed:{
    payload:1
  },
  encoderReleased:{
    payload:1
  }
}
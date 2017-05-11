
module.exports.baudRate=115200;
module.exports.eoString=0x3;
module.exports.messagesToArduino={
  null:{
    payload:0
  },
  //user friendly name
  hello:{
    payload:0,//amount of bytes that the message contains
  },
  ledMatrix:{
    payload:6,//amount of bytes that the message contains
  },
  //user friendly name
  screenA:{
    payload:'unknown',//amount of bytes that the message contains
  },
  //user friendly name
  screenB:{
    payload:'unknown',//amount of bytes that the message contains
  },
  setInteractionMode:{
    payload:4,
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
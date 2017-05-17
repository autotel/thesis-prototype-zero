'use strict';
var activeModes={};

var modeBeingTweaked="sequencer";
var changeToMode=modeBeingTweaked;

activeModes.modeSelector=require('./mode-selector');
activeModes.sequencer=require('./mode-sequencer');

module.exports=function(environment){
  //transform function declarations into new objects providing the environment
  for(var a in activeModes){
    activeModes[a]=activeModes[a](environment);
  }

  environment.on('serialopened',function(){
    console.log("serial opened");
    // hardware.sendScreenB("nande");
  });
  environment.on('interaction',function(event){
    //the selector button 0 engages modeselector temporarily
    // console.log(event.data);
    if(event.type=="selectorButtonPressed"&&event.data[0]==0){
      changeToMode=modeBeingTweaked;
      modeBeingTweaked="modeSelector";
      activeModes[modeBeingTweaked].engage(changeToMode);
      console.log("<"+modeBeingTweaked+">");
    }else if(event.type=="selectorButtonReleased"&&event.data[0]==0){
      modeBeingTweaked="modeSelector";
      modeBeingTweaked=changeToMode;
      activeModes[modeBeingTweaked].engage();
      console.log("<"+modeBeingTweaked+">");
    }

    var interactionResponse = activeModes[modeBeingTweaked].eventResponses[event.type];
    if(typeof interactionResponse==="function"){
      interactionResponse(event);
    }else{
      console.log(modeBeingTweaked+" has no interaction mode response to "+event.type,interactionResponse);
    }

  });
}
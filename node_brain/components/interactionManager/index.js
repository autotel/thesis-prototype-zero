'use strict';
var activeModes={};

var modeBeingTweaked="modeSelector";

activeModes.modeSelector=require('./mode-selector');
activeModes.sequencer=require('./mode-sequencer');

module.exports=function(environment){
  environment.on('serialopened',function(){
    console.log("serial opened");
    // hardware.sendScreenB("nande");
  });
  environment.on('interaction',function(event){
    var interactionResponse = activeModes[modeBeingTweaked].eventResponses[event.type];
    if(typeof interactionResponse==="function"){
      interactionResponse(event);
    }else{
      console.log(modeBeingTweaked+" has no interaction mode response to "+event.type,interactionResponse);
    }
  });
}
'use strict';
var activeModes={};

var modeBeingTweaked="sequencer";
var changeToMode=modeBeingTweaked;

activeModes.sequencer=require('./mode-sequencer');
activeModes.performer=require('./mode-performer');
activeModes.modeSelector=require('./mode-selector');

module.exports=function(environment){
  //transform function declarations into new objects providing the environment
  for(var a in activeModes){
    activeModes[a]=activeModes[a](environment);
  }

  activeModes.modeSelector.setModeList(activeModes);

  environment.on('serialopened',function(){
    console.log("serial opened");
    //init all active modes, supposedly only once per run
    for(var a in activeModes){
      activeModes[a].init();
    }
  });
  environment.on('interaction',function(event){
    //the selector button 0 engages modeselector temporarily
    if(event.type=="selectorButtonPressed"&&event.data[0]==0){
      activeModes[modeBeingTweaked].disengage();
      changeToMode=modeBeingTweaked;
      modeBeingTweaked="modeSelector";
      activeModes[modeBeingTweaked].engage(changeToMode);
      console.log("<"+modeBeingTweaked+">");
    }else if(event.type=="selectorButtonReleased"&&event.data[0]==0){
      modeBeingTweaked="modeSelector";
      //get from the modeselector, the mode that was selected
      var newMode=activeModes[modeBeingTweaked].disengage();
      modeBeingTweaked=newMode||changeToMode;
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
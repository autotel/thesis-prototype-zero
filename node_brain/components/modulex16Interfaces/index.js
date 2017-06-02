'use strict';
var moduleUserInterfaces={};

var modeBeingTweaked="scaleSetter";
var changeToMode=modeBeingTweaked;


moduleUserInterfaces.sequencer=require('./mode-sequencer');
moduleUserInterfaces.scaleSetter=require('./mode-scaleSetter');
moduleUserInterfaces.presetSetter=require('./mode-presetSetter');
moduleUserInterfaces.performer=require('./mode-performer');

moduleUserInterfaces.modeSelector=require('./mode-selector');
moduleUserInterfaces.midiEdit=require('./mode-midiEdit');
moduleUserInterfaces.system=require('./mode-system');
moduleUserInterfaces.patcher=require('./mode-selector');

module.exports=function(environment){
  //transform function declarations into new objects providing the environment
  for(var a in moduleUserInterfaces){
    moduleUserInterfaces[a]=moduleUserInterfaces[a](environment);
  }

  moduleUserInterfaces.modeSelector.setModeList(moduleUserInterfaces);

  environment.on('serialopened',function(){
    console.log("serial opened");
    //init all active modes, supposedly only once per run
    for(var a in moduleUserInterfaces){
      moduleUserInterfaces[a].init();
    }
  });
  environment.on('interaction',function(event){
    //the selector button 0 engages modeselector temporarily
    if(event.type=="selectorButtonPressed"&&event.data[0]==0){
      moduleUserInterfaces[modeBeingTweaked].disengage();
      changeToMode=modeBeingTweaked;
      modeBeingTweaked="modeSelector";
      moduleUserInterfaces[modeBeingTweaked].engage(changeToMode);
      // console.log("<"+modeBeingTweaked+">");
    }else if(event.type=="selectorButtonReleased"&&event.data[0]==0){
      modeBeingTweaked="modeSelector";
      //get from the modeselector, the mode that was selected
      var newMode=moduleUserInterfaces[modeBeingTweaked].disengage();
      modeBeingTweaked=newMode||changeToMode;
      moduleUserInterfaces[modeBeingTweaked].engage();
      // console.log("<"+modeBeingTweaked+">");
    }

    var interactionResponse = moduleUserInterfaces[modeBeingTweaked].eventResponses[event.type];
    if(typeof interactionResponse==="function"){
      interactionResponse(event);
    }else{
      console.log(modeBeingTweaked+" has no interaction mode response to "+event.type,interactionResponse);
      console.log(event);
    }

  });
  // environment.hardware.sendScreenA("ready");
  // environment.hardware.sendScreenB("");
}
'use strict';
//interfaces for general use, are needed one and only one
var basicUserInterfaces={};
//singleton available interfaces to control modules
var Modulex16Interfaces={};
//interfaces that have been instanced, they are correlated to modules.
var moduleUserInterfaces=[];
//all interfaces, to be able to engage from a number that is related to a pad
var allUserInterfaces=[];

var modeBeingTweaked="moduleSelector";
var changeToMode=modeBeingTweaked;

Modulex16Interfaces.grade=require('./moduleController-grade');
Modulex16Interfaces.presetKit=require('./moduleController-presetKit');
Modulex16Interfaces.sequencer=require('./moduleController-sequencer');

allUserInterfaces.moduleSelector=require('./monomode-selector');
allUserInterfaces.midiEdit=require('./monomode-midiEdit');
allUserInterfaces.system=require('./monomode-system');
allUserInterfaces.add=require('./monomode-add');

basicUserInterfaces.moduleSelector=allUserInterfaces.moduleSelector;
basicUserInterfaces.midiEdit=allUserInterfaces.midiEdit;
basicUserInterfaces.system=allUserInterfaces.system;
basicUserInterfaces.add=allUserInterfaces.add;

module.exports=function(environment){
  //initialize the user interfaces now that environment is provided;
  for(var a in allUserInterfaces){
    allUserInterfaces[a]=allUserInterfaces[a](environment);
  }
  //create singletons for available module interfaces
  for(var a in Modulex16Interfaces){
    Modulex16Interfaces[a]=Modulex16Interfaces[a](environment);
  }
  allUserInterfaces.add.setAvailableInterfaces(['grade','presetKit','sequencer']);
  // var moduleSelector=basicUserInterfaces.moduleSelector=new basicUserInterfaces.moduleSelector(environment);

  allUserInterfaces.moduleSelector.setModeList(allUserInterfaces);

  environment.patcher.on('modulecreated',function(event){
    var newUserInterface=new Modulex16Interfaces[event.type].instance(event.module);
    event.module.x16Interface=newUserInterface;
    allUserInterfaces.moduleSelector.addModuleUi(event.name);
    allUserInterfaces.push(newUserInterface);
    moduleUserInterfaces.push(newUserInterface);
  });
  // environment.on('serialopened',function(){
  //   console.log("serial opened");
  //   //init all active modes, supposedly only once per run
  //   // for(var a in basicUserInterfaces){
  //   //   basicUserInterfaces[a].init();
  //   // }
  // });
  environment.on('interaction',function(event){
    //the selector button 0 engages modeselector temporarily
    if(event.type=="selectorButtonPressed"&&event.data[0]==0){
      allUserInterfaces[modeBeingTweaked].disengage();
      changeToMode=modeBeingTweaked;
      modeBeingTweaked="moduleSelector";
      allUserInterfaces[modeBeingTweaked].engage(changeToMode);
      // console.log("<"+modeBeingTweaked+">");
    }else if(event.type=="selectorButtonReleased"&&event.data[0]==0){
      modeBeingTweaked="moduleSelector";
      //get from the modeselector, the mode that was selected
      var newMode=allUserInterfaces[modeBeingTweaked].disengage();
      modeBeingTweaked=newMode||changeToMode;
      console.log(modeBeingTweaked);
      allUserInterfaces[modeBeingTweaked].engage();
      // console.log("<"+modeBeingTweaked+">");
    }

    var interactionResponse = allUserInterfaces[modeBeingTweaked].eventResponses[event.type];
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
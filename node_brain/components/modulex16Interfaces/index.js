'use strict';
//interfaces for general use, are needed one and only one
var basicUserInterfaces={};
//singleton available interfaces to control modules
var Modulex16Interfaces={};
//interfaces that have been instanced, they are correlated to modules.
var moduleUserInterfaces=[];

var modeBeingTweaked="moduleSelector";
var changeToMode=modeBeingTweaked;

Modulex16Interfaces.presetKit=require('./mode-presetSetter');

basicUserInterfaces.moduleSelector=require('./mode-selector');
basicUserInterfaces.add=require('./mode-add');

module.exports=function(environment){
  //initialize the user interfaces now that environment is provided;
  for(var a in Modulex16Interfaces){
    Modulex16Interfaces[a]=Modulex16Interfaces[a](environment);
  }
  var add=basicUserInterfaces.add=new basicUserInterfaces.add(environment);
  add.setAvailableInterfaces(Modulex16Interfaces);
  var moduleSelector=basicUserInterfaces.moduleSelector=new basicUserInterfaces.moduleSelector(environment);

  basicUserInterfaces.moduleSelector.setModeList(basicUserInterfaces);

  environment.patcher.on('modulecreated',function(event){
    var newUserInterface=Modulex16Interfaces[event.type].create(event.module);
    event.module.x16Interface=newUserInterface;
    moduleSelector.addModuleUi(event.name);
    moduleUserInterfaces.push(newUserInterface);
  });
  environment.on('serialopened',function(){
    console.log("serial opened");
    //init all active modes, supposedly only once per run
    for(var a in basicUserInterfaces){
      basicUserInterfaces[a].init();
    }
  });
  environment.on('interaction',function(event){
    //the selector button 0 engages modeselector temporarily
    if(event.type=="selectorButtonPressed"&&event.data[0]==0){
      basicUserInterfaces[modeBeingTweaked].disengage();
      changeToMode=modeBeingTweaked;
      modeBeingTweaked="moduleSelector";
      basicUserInterfaces[modeBeingTweaked].engage(changeToMode);
      // console.log("<"+modeBeingTweaked+">");
    }else if(event.type=="selectorButtonReleased"&&event.data[0]==0){
      modeBeingTweaked="moduleSelector";
      //get from the modeselector, the mode that was selected
      var newMode=basicUserInterfaces[modeBeingTweaked].disengage();
      modeBeingTweaked=newMode||changeToMode;
      basicUserInterfaces[modeBeingTweaked].engage();
      // console.log("<"+modeBeingTweaked+">");
    }

    var interactionResponse = basicUserInterfaces[modeBeingTweaked].eventResponses[event.type];
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
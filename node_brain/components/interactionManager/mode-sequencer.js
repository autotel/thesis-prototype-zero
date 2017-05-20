'use strict';
var base=require('./interactionModeBase');
var selectors={};
selectors.dimension=require('./submode-dimensionSelector');
//pendant: the sequencer functionality should be in the destinations folder,
//as to separate the functionality (which can receive events) from the interaction
var sequencer=require('../destinations/sequencer');

module.exports=function(environment){return new(function(){

  base.call(this);
  var tPattern=this;
  var patData={};
  var currentStep=0;
  var engaged=false;

  var currentModulus=16;


  console.log(selectors);
  for(var a in selectors){
    console.log("init subs "+a);
    selectors[a]=selectors[a](environment);
  }

  var lastsubSelectorEngaged=0;
  var subSelectorEngaged=false;

  var currentDimension=0;

  // var selectors=['dimension','value','modulus'];
  var currentSelector=0;

  this.init=function(){
    environment.metronome.on('step',step);
  }
  environment.destinations.sequencer=this;
  this.receiveEvent=function(){
    console.log("not implemented yet");
  }
  var store=function(step,data){
    if(!patData[step]) patData[step]=[];
    if(data){
      patData[step].push(data);
    }
  }
  var clearStepNewest=function(step){
    patData[step].pop();
  }
  var clearStepOldest=function(step){
    patData[step].shift();
  }
  var clearStep=function(step){
    delete patData[step];
  }
  var clearStepByFilter=function(step,filterFunction){
    if(patData[step])
      if(typeof filterFunction==="function"){
        for(var sEvt in patData[step]){
          if(filterFunction(patData[step][sEvt])){
            patData[step].splice(sEvt,1);
            return true;
          }
        }
        return false;
      }
    return false;
  }
  var getBoolean=function(step,filterFunction){
    if(patData[step])
      if(typeof filterFunction==="function"){
        //yes, every step is an array
        for(var stepData of patData[step]){
          if(filterFunction(stepData))
            return true;
          return false;
        }
      }else{
        for(var stepData of patData[step]){
          if(patData[step]||false)
            return true;
          return false;
        }
      }
    return false;
  };
  var getBitmapx16=function(filter){
    var ret=0x0000;
    if(filter){
      for(var step=0; step<16;step++)
        if(patData[step])
          for(var stepData of patData[step])
            if(filter(stepData)){
              ret|=0x1<<step;
            }
    }else{
      for(var step=0; step<16;step++)
        if(patData[step])
          for(var stepData of patData[step])
            if(stepData){
              ret|=0x1<<step;
            }
    }
    // console.log(">"+ret.toString(16));
    return ret;
  }
  //some events run regardless of engagement. in these cases, the screen refresh is conditional
  function step(evt){
    currentStep=evt.step;
    if(engaged)
    if(subSelectorEngaged===false)
    updateLeds();

    if(getBoolean(currentStep)){
      for(var stepData of patData[currentStep]){
        // if(stepData.destination=="midi"){
        // }else if(stepData.destination=="midi"){
          // var val=stepData.value;
          environment.patcher.receiveEvent(stepData);
        // }else
      }
    }
  }
  function updateLeds(){
    var mostImportant=getBitmapx16(selectors.dimension.getFilter());
    var leastImportant=getBitmapx16();
    var playHeadBmp=0x1<<currentStep;
    environment.hardware.draw([leastImportant,playHeadBmp^mostImportant,playHeadBmp|mostImportant]);
  }

  this.engage=function(){
    environment.hardware.sendScreenA("Sequencer mode");
    engaged=true;
    updateLeds();
  }
  this.disengage=function(){
    engaged=false;
  }
  this.eventResponses.buttonMatrixPressed=function(evt){
    var editorFilter=selectors.dimension.getFilter();
    if(subSelectorEngaged===false){
      if(clearStepByFilter(evt.data[0],editorFilter)){
      }else{
        // console.log(selectors.dimension);
        // console.log(selectors.dimension.getSeqEvent());
        store(evt.data[0],/*currentModulus,*/selectors.dimension.getSeqEvent());
      }
    }else{
      selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
    }
    updateLeds();
  }
  this.eventResponses.buttonMatrixReleased=function(evt){
    if(subSelectorEngaged===false){
      updateLeds();
    }else{
      selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
    }
  }
  this.eventResponses.encoderScroll=function(evt){
    if(selectors[lastsubSelectorEngaged])
    selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
    // if(subSelectorEngaged===false){
    //   environment.hardware.sendScreenB(String.fromCharCode(evt.data[0])+"-"+evt.data[0]);
    // }else{
    // }
  }
  this.eventResponses.selectorButtonPressed=function(evt){
    if(evt.data[0]==1){
      subSelectorEngaged='dimension';
      lastsubSelectorEngaged='dimension';
      selectors.dimension.engage();
    }
  }
  this.eventResponses.selectorButtonReleased=function(evt){
    subSelectorEngaged=false;
    selectors.dimension.disengage();
  }
  return this;
})()};
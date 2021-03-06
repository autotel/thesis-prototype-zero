
'use strict';
var eventMessage=require('../../../datatype-eventMessage');
var patternEvent=require('../../../datatype-patternEvent');
module.exports=function(sequencerModule){ return new(function(){
  var thisModule=this;

  //the "invisible" sub-unit of a step, good for recording quantization and midi clock input
  var microStep={value:0};
  this.microStep=microStep;
  // var microStepDivide={value:12};
  // this.microStepDivide=microStepDivide;

  //the visible step that can be divided if the user wants a slower sequence
  var substep={value:0};
  var stepDivide={value:2}
  this.stepDivide=stepDivide;

  //the step that is used to read the pattern memory
  var currentStep=sequencerModule.currentStep;

  var loopLength=sequencerModule.loopLength;
  var patData=sequencerModule.patData;
  var loopDisplace={value:0};
  this.loopDisplace=loopDisplace;
  var store=function(step,data){
    if(!patData[step]) patData[step]=[];
    if(data){
      patData[step].push(data);
      return data;
    }
  }
  var storeNoDup=function(step,data){
    var ret=false;
    if(!patData[step]) patData[step]=[];
    if(data){
      var cancel=false;
      for(var a in patData[step]){
        try{
          if(patData[step][a].on.compareTo(data.on,['destination','value'])){
            cancel=true;
            break;
          }
        }catch(e){
          // console.log(patData[step]);
          // console.log(e);
        }
      }
      if(!cancel){
        patData[step].push(data); return data;
      }
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

  var clearStepRange=function(from,to){
    for(var step=to; step>from; step--){
      //maybe this iteration is unnecesary?
      for(var a in patData[step]){
        delete patData[step][a];
      }
      delete patData[step];
    }
  }
  var duplicateSequence=function(startingStep,originalEndingStep,multiplyFactor){
    var initialStepSize=originalEndingStep-startingStep;
    if(multiplyFactor>1){
      clearStepRange(originalEndingStep+1,initialStepSize*(multiplyFactor-1));
      //starts in 1 because the 0 is the currently existing one
      for(var duplicationNumber=1; duplicationNumber<multiplyFactor; duplicationNumber++){
        for(var step=startingStep; step<originalEndingStep; step++){
          // var testc=0;
          if(patData[step])
          for(var a=0; a<patData[step].length; a++){
            // testc++;
            var targetStep=(initialStepSize*duplicationNumber)+step;
            // console.log(duplicationNumber,step,testc,targetStep);
            // TODO: in many places I create these sequencer memory events, they should be
            //instances of the same class, to avoid easter egg bugs
            if(!patData[targetStep]) patData[targetStep]=[];
            patData[targetStep].push(new patternEvent({
              on:new eventMessage(patData[step][a].on),
              off:new eventMessage(patData[step][a].off),
              stepLength:patData[step][a].stepLength,
            }));
          }
        }
      }
    }else{
      clearStepRange(originalEndingStep*multiplyFactor,originalEndingStep);
    }
  }

  // var clockIncremental=false;
  this.stepAbsolute=function(s){
    // clockIncremental=false;
    // console.log("absolute"+microStep.value);
    substep.value=s%stepDivide.value;
    substep.value+=loopDisplace.value;
    loopDisplace.value=0;
    currentStep.value=Math.floor(s/stepDivide.value);
    if(currentStep.value>=loopLength.value) currentStep.value%=loopLength.value;
    if(currentStep.value<0) currentStep.value%=loopLength.value;
    if(substep.value==0)
    step(s);
    // console.log("memema");
    // console.log("aa",currentStep.value,loopLength.value);
    microStep.value=0;
  }
  this.restart=function(s){
    if(!s) var s=0;
    loopDisplace.value=0;
    currentStep.value=s;
    if(currentStep.value>=loopLength.value) currentStep.value%=loopLength.value;
    if(currentStep.value<0) currentStep.value%=loopLength.value;
    if(substep.value==0)
    step(s);
    microStep.value=0;
  }
  this.stepIncremental=function(s){
    // clockIncremental=true;
    substep.value+=loopDisplace.value;
    loopDisplace.value=0;
    microStep.value=0;
  }
  this.stepMicro=function(number,base){
    // console.log(base,number);s
    // console.log(" micro"+microStep.value);
    microStep.value=number;
    if(microStep.value==0){
      // if(clockIncremental){
      // thisModule.step();
      // console.log("incremental"+microStep.value);
      // console.log(substep);
      substep.value++;
      if(substep.value>=stepDivide.value){
        step(currentStep.value);
        currentStep.value++;
        currentStep.value+=loopDisplace.value;
        // console.log("mememe");
        substep.value=substep.value%stepDivide.value;
        loopDisplace.value=0;
        if(currentStep.value>=loopLength.value) currentStep.value%=loopLength.value;
        if(currentStep.value<0) currentStep.value%=loopLength.value;
        }
      // }
    }
  }

  function step(evt){
    sequencerModule.noteLenManager.step();
    if(!sequencerModule.mute)
    // if(substep.value==0){
      if(getBoolean(currentStep.value)){
        // console.log("memem");
        // console.log(patData[currentStep.value].length);
        for(var stepData of patData[currentStep.value]){
          sequencerModule.sendEvent(stepData.on);
          sequencerModule.noteLenManager.noteStarted(stepData);
          sequencerModule.handle('messagesend',{origin:sequencerModule,step:currentStep.value,eventMessage:stepData.on});
        }
      }
      sequencerModule.onPatchStep();
    // }
  }
  this.store=store;
  this.storeNoDup=storeNoDup;
  this.clearStepNewest=clearStepNewest;
  this.clearStepOldest=clearStepOldest;
  this.clearStep=clearStep;
  this.clearStepByFilter=clearStepByFilter;
  this.getBoolean=getBoolean;
  // this.eachFold=eachFold;
  // this.getThroughfoldBoolean=getThroughfoldBoolean;
  this.clearStepRange=clearStepRange;
  this.duplicateSequence=duplicateSequence;
  // this.getBitmapx16=getBitmapx16;
  this.step=step;
})(); };

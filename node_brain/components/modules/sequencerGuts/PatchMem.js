module.exports=function(sequencerModule){ return new(function(){
  var loopLength=sequencerModule.loopLength;
  var patData=sequencerModule.patData;
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
        if(patData[step][a].on.compareTo(data.on,['destination','value'])){
          cancel=true;
          break;
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

  function eachFold(button,callback){
    var len=loopLength.value;
    var look=lookLoop.value||len;
    button%=look;
    //how many repetitions of the lookloop are represented under this button?
    var stepFolds;
    if(len%look>button){
      stepFolds=Math.ceil(len/look);
    }else{
      stepFolds=Math.floor(len/look);
    }
    // console.log("start check folds:"+stepFolds+" len:"+len+" look:"+look);
    for(var foldNumber=0; foldNumber<stepFolds; foldNumber++){
      callback((look*foldNumber)+button);
    }
    return {stepFolds:stepFolds}
  }

  //does the event under the button repeat througout all the repetitions of lookLoop?
  var getThroughfoldBoolean=function(button,filterFunction){
    var ret=0;
    var stepFolds=eachFold(button,function(step){
      if(patData[step])
        if(typeof filterFunction==="function"){
          //yes, every step is an array
          for(var stepData of patData[step]){
            if(filterFunction(stepData)) ret ++;
          }
        }else{
          // console.log("   check bt"+step);
          for(var stepData of patData[step]){
            if(patData[step]||false) ret ++;
          }
        }
    }).stepFolds;
    //if the step was repeated throughout all the folds, the return is true.
    if(ret>=stepFolds) ret=true; //ret can be higher than twofold because each step can hold any n of events
    // console.log("ret is "+ret);
    return ret;
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
            if(!patData[targetStep]) patData[targetStep]=[];
            patData[targetStep].push(new eventMessage(patData[step][a]));
          }
        }
      }
    }else{
      clearStepRange(startingStep,originalEndingStep*multiplyFactor);
    }
  }

  var getBitmapx16=function(filter, requireAllFold){
    var ret=0x0000;
    if(requireAllFold){
      for(var button=0; button<16;button++)
        if(getThroughfoldBoolean(button,filter)===requireAllFold) ret|=0x1<<button;
    }else{
      if(filter){
        for(var button=0; button<16;button++)
          if(patData[button])
            for(var stepData of patData[button])
              if(filter(stepData)){
                ret|=0x1<<button;
              }
      }else{
        for(var button=0; button<16;button++)
          if(patData[button])
            for(var stepData of patData[button])
              if(stepData){
                ret|=0x1<<button;
              }
      }
    }
    // console.log(">"+ret.toString(16));
    return ret;
  }
  function step(evt){

    currentStep++;
    currentStep+=loopDisplace.value;
    loopDisplace.value=0;
    if(currentStep>=loopLength.value) currentStep%=loopLength.value;
    if(currentStep<0) currentStep%=loopLength.value;

    NoteLenManager.step();

    if(getBoolean(currentStep)){
      for(var stepData of patData[currentStep]){
        // if(stepData.destination=="midi"){
        // }else if(stepData.destination=="midi"){
          // var val=stepData.value;
          environment.patcher.receiveEvent(stepData.on);
          NoteLenManager.noteStarted(stepData);
        // }else
      }
    }

    if(engaged){
      if(subSelectorEngaged===false)
      updateLeds();//, console.log("step"+currentStep);
      if(lastsubSelectorEngaged==="timeConfig"){
        selectors.timeConfig.updateLcd();
      }
    }
  }
  this.store=store;
  this.storeNoDup=storeNoDup;
  this.clearStepNewest=clearStepNewest;
  this.clearStepOldest=clearStepOldest;
  this.clearStep=clearStep;
  this.clearStepByFilter=clearStepByFilter;
  this.getBoolean=getBoolean;
  this.eachFold=eachFold;
  this.getThroughfoldBoolean=getThroughfoldBoolean;
  this.clearStepRange=clearStepRange;
  this.duplicateSequence=duplicateSequence;
  this.getBitmapx16=getBitmapx16;
  this.step=step;
})(); };

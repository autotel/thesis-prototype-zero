'use strict';
var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
const sequencerFunctions=require("./sequencerGuts");

module.exports=function(environment){
  //singleton return
  return new(function(){
    this.instance=function(props){
      if(!props) props={};
      var currentStep={value:0};
      this.currentStep=currentStep;
      /**/console.log(sequencerFunctions);
      var thisModule=this;
      this.patData={};
      var currentModulus=16;
      this.loopLength={value:16};
      this.stepLength={value:12}

      var clockSource=false;
      this.disableClockSource=function(){
        if(clockSource!==false){
          clockSource.disableOutputTo(this);
        }
      }
      this.updateClockSource=function(newOne){
        thisModule.disableClockSource();
        clockSource=environment.patcher.inputs[newOne];
        if(clockSource){
          clockSource.sendOutputTo(this);
        }else{
          clockSource=false;
          console.warn("patcher doesn't have input named "+newOne);
        }
      }
      this.getClockSource=function(){
        return clockSource;
      }
      if(props.clockSource){
        this.updateClockSource(props.clockSource);
      }
      this.getStepEventDestinations=function(){
        var ret={};
        for(var a in this.patData)
          for(var b in this.patData[a])
            if(this.patData[a][b].on){
              if(!ret[a]) ret[a]=[];
              ret[a][b]=(this.patData[a][b].on.destination)
            }
        return ret;
      }
      this.sendEvent=environment.patcher.receiveEvent;
      this.noteLenManager=sequencerFunctions.NoteLenManager(this);
      var patchMem=sequencerFunctions.PatchMem(this);
      //import submodule functions to my own;
      //I don't use an iterator to have more clear control of the namespace
      //but in some text tools you can always multiline edit
      this.store=patchMem.store;
      this.loopDisplace=patchMem.loopDisplace;
      this.storeNoDup=patchMem.storeNoDup;
      this.clearStepNewest=patchMem.clearStepNewest;
      this.clearStepOldest=patchMem.clearStepOldest;
      this.clearStep=patchMem.clearStep;
      this.clearStepByFilter=patchMem.clearStepByFilter;
      this.getBoolean=patchMem.getBoolean;
      this.stepDivide=patchMem.stepDivide;
      this.microStep=patchMem.microStep;
      this.microStepDivide=patchMem.microStepDivide;
      // this.eachFold=patchMem.eachFold;
      // this.getThroughfoldBoolean=patchMem.getThroughfoldBoolean;
      this.clearStepRange=patchMem.clearStepRange;
      this.duplicateSequence=patchMem.duplicateSequence;
      // this.getBitmapx16=patchMem.getBitmapx16;
      this.step=patchMem.step;
      this.stepAbsolute=patchMem.stepAbsolute;
      this.stepIncremental=patchMem.stepIncremental;
      this.stepMicro=patchMem.stepMicro;
      var tPattern=this;

      this.onPatchStep=function(evt){
        //console.log("MMO"+currentStep.value);
        this.handle('step',evt);
      }
      destinationBase.call(this,environment);
      this.receiveEvent=function(evt){
        this.handle('receive',evt)
        if(evt.value[0]==0){
          this.stepAbsolute(evt.value[1]);
        }else if(evt.value[0]==1){
          this.stepIncremental(evt.value[1]);
        }else if(evt.value[0]==0xf8){
          this.stepMicro(evt.value[1]);
        }
      }
    }
  })();
}
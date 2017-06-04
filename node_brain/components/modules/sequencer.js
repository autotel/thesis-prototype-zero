var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
const sequencerFunctions=require("./sequencerGuts");

module.exports=function(environment){
  //singleton return
  return new(function(){
    this.instance=function(props){
      console.log(sequencerFunctions);

      this.patData={};
      var currentStep=0;
      var currentModulus=16;
      this.loopLength=16;

      var noteLenManager=sequencerFunctions.NoteLenManager(this);
      var patchMem=sequencerFunctions.PatchMem(this);
      //import submodule functions to my own;
      //I don't use an iterator to have more clear control of the namespace
      //but in some text tools you can always multiline edit
      this.store=patchMem.store;
      this.storeNoDup=patchMem.storeNoDup;
      this.clearStepNewest=patchMem.clearStepNewest;
      this.clearStepOldest=patchMem.clearStepOldest;
      this.clearStep=patchMem.clearStep;
      this.clearStepByFilter=patchMem.clearStepByFilter;
      this.getBoolean=patchMem.getBoolean;
      this.eachFold=patchMem.eachFold;
      this.getThroughfoldBoolean=patchMem.getThroughfoldBoolean;
      this.clearStepRange=patchMem.clearStepRange;
      this.duplicateSequence=patchMem.duplicateSequence;
      this.getBitmapx16=patchMem.getBitmapx16;
      this.step=patchMem.step;

      var tPattern=this;

      destinationBase.call(this,environment);
      this.receiveEvent=function(evt){
        this.handle('receive',evt)
      }
    }
  })();
}
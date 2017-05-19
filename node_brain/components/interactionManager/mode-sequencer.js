'use strict';
var base=require('./interactionModeBase');
var selectors={};
selectors.dimension=require('./submode-dimensionSelector');

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
  var store=function(place,data){
    patData[place]=data;
  }
  var getBoolean=function(place){
    return patData[place]||false;
  };
  var getBitmapx16=function(filter){
    var ret=0x0000;
    if(filter){
      for(var a=0; a<16;a++)
        if(patData[a])
          if(filter(patData[a])){
            ret|=0x1<<a;
          }
    }else{
      for(var a=0; a<16;a++)
        if(patData[a]){
          ret|=0x1<<a;
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
      if(patData[currentStep].destination=="midi")
      var val=patData[currentStep].value;
      environment.midi.note(val[0],val[1],val[2]);
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
    // console.log("bmatr",evt);
    if(subSelectorEngaged===false){
      if(getBoolean(evt.data[0])){
        store(evt.data[0],false);
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
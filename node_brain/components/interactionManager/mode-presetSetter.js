'use strict';
var base=require('./interactionModeBase');
var controlledDestination=require('../destinations/presetKit.js');

var fingerMap=0x0000;
var noteHighlightMap=0x0000;
var currentlySelectedPreset=0;
var shiftPressed=false;
var subSelectorEngaged=false;
var lastsubSelectorEngaged="dimension";
var engaged=false;
module.exports=function(environment){
  var selectors={};
  selectors.dimension=require('./submode-dimensionSelector');
  return new(function(){

    base.call(this);
    for(var a in selectors){
      selectors[a]=selectors[a](environment);
    }
    controlledDestination=controlledDestination(environment);

    function updateHardware(){
      var programmedMap=0x0000;
      for(var a in controlledDestination.kit){
        programmedMap|=1<<a;
      }
      var presetBitMap=0x1<<currentlySelectedPreset;
      environment.hardware.draw([presetBitMap,programmedMap|presetBitMap|noteHighlightMap,presetBitMap|noteHighlightMap]);
    }
    //when a note is routed to the presetKit that this mode controls
    controlledDestination.on('receive',function(evm){
      if(engaged&& !subSelectorEngaged){
        noteHighlightMap|=1<<evm.value[1];
        updateHardware();
        //pendant: the note should actually go off when there is a note off,
        //but there are no note offs yet
        setTimeout(function(){noteHighlightMap^=1<<evm.value[1]; updateHardware()},200);
      }
    });
    this.engage=function(){
      environment.hardware.sendScreenA("preset set");
      engaged=true;
      // console.log("engage mode selector");
      updateHardware();
    }
    this.disengage=function(){
      engaged=false;
    }
    this.eventResponses.buttonMatrixPressed=function(evt){
      if(!subSelectorEngaged){
        fingerMap=evt.data[2]|(evt.data[3]<<8);
        currentlySelectedPreset=evt.data[0];
        selectors.dimension.setFromSeqEvent(controlledDestination.kit[currentlySelectedPreset]);
        controlledDestination.triggerPad(evt.data[0]);
        updateHardware();
      }else{
        selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
      }
    }
    this.eventResponses.buttonMatrixReleased=function(evt){
      if(!subSelectorEngaged){
        fingerMap=evt.data[2]|(evt.data[3]<<8);
        updateHardware();
      }else{
        selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
      }
    }
    this.eventResponses.encoderScroll=function(evt){
      if(selectors[lastsubSelectorEngaged]){
        selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
        if(lastsubSelectorEngaged=="dimension")
          controlledDestination.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
      }
    }
    this.eventResponses.encoderPressed=function(evt){

    }
    this.eventResponses.encoderReleased=function(evt){

    }
    this.eventResponses.selectorButtonPressed=function(evt){
      if(evt.data[0]==1){
        subSelectorEngaged='dimension';
        lastsubSelectorEngaged='dimension';
        console.log(selectors);
        selectors.dimension.engage();
      }else if(evt.data[0]==3){
        shiftPressed=true;
      }
    }
    this.eventResponses.selectorButtonReleased=function(evt){
      if(evt.data[0]==1){
        subSelectorEngaged=false;
        selectors.dimension.disengage();
      }else if(evt.data[0]==3){
        shiftPressed=false;
      }
      updateHardware();
    }
    return this;
})()};
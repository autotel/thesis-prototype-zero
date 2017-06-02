'use strict';
var base=require('./interactionModeBase');
var fingerMap=0x0000;
var editingOutput=false;
// var selectors={};
module.exports=function(environment){
  this.instance=function(){
    var destNames=environment.patcher.getDestList();
    var midiOutputs=environment.midi.getMidiOutList();
    var midiMap=~(0xffff<<midiOutputs.length);
    base.call(this);

    // selectors.midiRouting=require('./submode-2dConfigurator');


    // for(var a in selectors){
    //
    //   selectors[a]=selectors[a](environment);
    // }
    // selectors.midiRouting.initOptions({
    //   'Header is':{
    //     value:0,
    //     getValueName:function(a){ if(a==0) return "off"; return a+"(0x"+a.toString(16)+")" },
    //     maximumValue:256,
    //     minimumValue:0,
    //   },
    //   'Send to':{
    //     getValueName:function(a){ return destNames[a] },
    //     maximumValue:(256/16),
    //   }
    // });




    function updateHardware(){
      environment.hardware.draw([midiMap|fingerMap,fingerMap,fingerMap]);
    }
    this.engage=function(){
      environment.hardware.sendScreenA("Midi config");
      // console.log("engage mode selector");
      updateHardware();
    }
    this.eventResponses.buttonMatrixPressed=function(evt){
      fingerMap|=0x1<<evt.data[0];
      updateHardware();
    }
    this.eventResponses.buttonMatrixReleased=function(evt){
      fingerMap&=~(0x1<<evt.data[0]);
      updateHardware();
    }
    this.eventResponses.encoderScroll=function(evt){
      //program change is CX PP https://www.midi.org/specifications/item/table-1-summary-of-midi-message

      environment.metronome.interval(evt.data[0]);
      environment.hardware.sendScreenB("interval"+evt.data[0]+"ms");
    }
    this.eventResponses.encoderPressed=function(evt){

    }
    this.eventResponses.encoderReleased=function(evt){

    }
  }
  return this;
}
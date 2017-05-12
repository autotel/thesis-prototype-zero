'use strict';
// var prompt = require('prompt');
const hardware=require('./components/uiHardware');
const midi=require('./components/midi');
// const readline = require('readline');


var currentStep=0;


var updateSequencerLeds=function(){
  // var seqB=pattern.getBitmapx16();
  // hardware.updateLeds([seqB^0x0001<<currentStep,seqB,0x0001<<currentStep]);

}

var testmode="sequencer";

var rEventHandlers={
  buttonMatrixPressed:function(data){
    if(testmode=="sequencer"){
    // console.log("buttonMatric event"+data[0]);
      if(data[1]!=0){
        pattern.store(data[0],!pattern.getBoolean(data[0]));
      }
      updateSequencerLeds();
    }else{
      data[1]=127;
      midi.note(data[0],52,data[1]);
    }
  },
  buttonMatrixReleased:function(data){
    if(testmode=="sequence"){
    // console.log("buttonMatric event"+data[0]);
      if(data[1]!=0){
        pattern.store(data[0],!pattern.getBoolean(data[0]));
      }
      updateSequencerLeds();
    }else{
      midi.note(data[0],52,0);
    }
  },
  selectorButtonPressed:function(data){
    // hardware.sendScreenA("zzz"+data[0]);
    // hardware.sendScreenB("zzz"+data[0]);
  },
  encoderScroll:function(data){
    // hardware.sendScreenA("zzz"+data[0]);
    // hardware.sendScreenB("zzz"+data[0]);
  }
}
hardware.on('serialopened',function(){
  console.log("serial opened");

  hardware.setMode(testmode,pattern);

  setInterval(function(){
    currentStep++;
    currentStep%=16;
    hardware.setCurrentStep(currentStep);
    // updateSequencerLeds();
  },400);

  // hardware.sendScreenB("nande");
});
hardware.on('interaction',function(event){
  console.log(event.type);
  if(event.data){
    // console.log(event.type,event.data[0]);
    if( typeof rEventHandlers[event.type] ==='function' ){
       rEventHandlers[event.type](event.data);
    }
  }else{
      console.log("wrong event: ",event);
  }
});
//pattern should store messages, that were defined in other part of this project.
var pattern=new(function(){
  var tPattern=this;
  var patData={};
  this.store=function(place,data){
    patData[place]=data;
    tPattern.changed();
  };
  this.changed=function(){}
  this.getBoolean=function(place){
    return patData[place]||false;
  };
  this.getBitmapx16=function(){
    // [seqB^0x0001<<currentStep,seqB,0x0001<<currentStep]
    var ret=[0,0,0];
    for(var a=0; a<16;a++){
      if(patData[a]){
        ret[0]|=(0x1<<a)^(0x1<<currentStep);
        ret[1]|=0x1<<a;
        ret[2]=0x1<<currentStep;
      }
    }
    return ret;
  }
  return this;
})();



// q();
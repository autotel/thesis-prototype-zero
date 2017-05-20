'use strict';

const onhandlers=require('onhandlers');

var environment=new(function(){
  onhandlers.call(this);

  this.metronome=new(function(){
    var currentStep=0;
    var tMetro=this;
    onhandlers.call(this);
    setInterval(function(){
      tMetro.handle('step',{step:currentStep});
      currentStep++;
      currentStep%=16;
    },148);
  })();
  return this;
})();

const midi=require('./components/midi')(environment);
environment.midi=midi;
const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
const interaction=require('./components/interactionManager')(environment);

environment.patcher=new(function(){
  var thisPatcher=this;
  this.destinations={
    midi:environment.midi,
  };
  this.receiveEvent=function(evt){
    if(evt.destination){
      thisPatcher.destinations[evt.destination].receive(evt);
    }else{
      console.warn("event didn't have destination", evt);
    }
    console.log("reve",evt);
    if(evt.destination=="midi"){
      var val=evt.value;
      environment.midi.note(val[0],val[1],val[2]);
    }
  }
})();


// const readline = require('readline');
// environment.on('serialopened',function(){
//   environment.metronome.on('step',function(e){
//     var currentStep=e.step;
//     hardware.draw([0x1<<currentStep,0x0,0x1<<currentStep]);
//   });
// });

var currentStep=0;


var testmode="sequence";




// q();
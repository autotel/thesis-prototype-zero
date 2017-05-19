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

const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
const midi=require('./components/midi')(environment);
environment.midi=midi;
const interaction=require('./components/interactionManager')(environment);
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
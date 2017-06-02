'use strict';

const onhandlers=require('onhandlers');

var environment=new(function(){
  onhandlers.call(this);

  this.metronome=new(function(){
    var interval=140;
    var currentStep=0;
    var tMetro=this;
    onhandlers.call(this);
    function stm(){
      tMetro.handle('step',{step:currentStep});
      currentStep++;
      currentStep%=16*15*14*13*12*11*10*9*8*7*6*5*4*3*2;
      setTimeout(stm,interval);
    }
    stm();
    this.interval=function(val){
      interval=val;
    }
  })();




  return this;
})();
const patcher=require('./components/patcher')(environment);
environment.patcher=patcher;
const online=require('./online')(environment);
const midi=require('./components/modules/midi')(environment);
environment.midi=midi;
const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
const interaction=require('./components/modulex16Interfaces')(environment);



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
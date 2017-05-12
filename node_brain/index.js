'use strict';

const onhandlers=require('onhandlers');

var environment=new(function(){
  onhandlers.call(this);

  this.metronome=new(function(){
    var currentStep=0;
    var tMetro=this;
    onhandlers.call(this);
    setInterval(function(){
      currentStep++;
      currentStep%=16;
      tMetro.handle('step',{step:currentStep});
    },100);
  })();
  return this;
})();

const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
const midi=require('./components/midi')(environment);
const interaction=require('./components/interactionManager')(environment);
// const readline = require('readline');



var currentStep=0;
environment.on('serialopened',function(){
  environment.metronome.on('step',function(ev){
      var seqB=0xcaca;
      var step=ev.step%16;
      // console.log(step);
      hardware.draw([seqB^0x0001<<step,seqB,0x0001<<step]);
  });
});

var testmode="seque-nce";




// q();
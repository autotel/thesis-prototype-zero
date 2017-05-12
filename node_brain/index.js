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

var updateSequencerLeds=function(){
  var seqB=pattern.getBitmapx16();
  hardware.updateLeds([seqB^0x0001<<currentStep,seqB,0x0001<<currentStep]);
}

var testmode="seque-nce";




// q();
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

  this.patcher=new(function(){
    onhandlers.call(this);
    var thisPatcher=this;
    var destinationList=[];
    if(!this.modules) this.modules={};
    this.getDestList=function(){
      destinationList=[];
      for(var a in this.modules){
        destinationList.push(a);
      }
      return destinationList;
    }
    this.addModule=function(name,what){
      this.modules[name]=what;
      this.handle("modulecreated",{name:name,module:what});
    }
    this.receiveEvent=function(evt){
      if(evt.destination){
//console.log(evt);
//console.log(thisPatcher.modules);
        if(thisPatcher.modules[evt.destination]){
          thisPatcher.modules[evt.destination].receive(evt);
        }else{
          console.log("invalid "+evt.destination+" destination");
        }
      }else{
        console.warn("event didn't have destination", evt);
      }
//console.log("reve",evt);
      // if(evt.destination=="midi"){
      //   var val=evt.value;
      //   environment.midi.note(val[0],val[1],val[2]);
      // }
    }
  })();


  return this;
})();
const online=require('./online')(environment);
const midi=require('./components/modules/midi')(environment);
environment.midi=midi;
const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
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
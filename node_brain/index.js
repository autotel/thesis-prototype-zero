'use strict';

const onhandlers=require('onhandlers');

var environment=new(function(){
  //following line: neccesary?
  onhandlers.call(this);






  return this;
})();
const patcher=require('./components/patcher')(environment);
environment.patcher=patcher;
const online=require('./online')(environment);
const midi=require('./components/modules/midi')(environment);
environment.midi=midi;
const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
const moduleX16Interfaces=require('./components/moduleX16Interfaces')(environment);
environment.moduleX16Interface=moduleX16Interfaces;

function loadPatch(file){
  var fs = require('fs');
  var obj;
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    console.log("--loading a patch--");
    // console.log(obj);
    for(var a in obj.modules){
      var newModule=environment.patcher.createModule(a,obj.modules[a]);
    }
  });
}
loadPatch('./patches/default.json');

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
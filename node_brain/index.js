'use strict';

const onhandlers=require('onhandlers');

var environment=new(function(){
  //following line: neccesary?
  onhandlers.call(this);
  return this;
})();
const patcher=require('./components/patcher')(environment);
environment.patcher=patcher;
/*
try{
const online=require('./online')(environment);
}catch(e){
  console.log("Online could not be loaded",e);
}*/
const midi=require('./components/modules/midi')(environment);
environment.midi=midi;
const hardware=require('./components/uiHardware')(environment);
environment.hardware=hardware;
const moduleX16Interfaces=require('./components/moduleX16Interfaces')(environment);
environment.moduleX16Interface=moduleX16Interfaces;
// online.start();

function loadPatch(file){
  var fs = require('fs');
  var obj;
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    /**/console.log("--loading a patch--");
    // console.log(obj);
    for(var moduleDefiner of obj.modules){
      console.log("load modile"+moduleDefiner);
      var newModule=environment.patcher.createModule(moduleDefiner.type,moduleDefiner.options);
    }
  });
}
loadPatch(__dirname+ '/patches/default.json');

var currentStep=0;


var testmode="sequence";




// q();
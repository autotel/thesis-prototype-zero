"use strict";
const onhandlers=require('onhandlers');
module.exports=function(environment){return new(function(){
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
});
}
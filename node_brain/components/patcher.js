"use strict";
const onhandlers=require('onhandlers');

//midi modules are auto-instanced
var Modules={
  clock:require('./modules/clock'),
  grade:require('./modules/grade'),
  presetKit:require('./modules/presetKit'),
  sequencer:require('./modules/sequencer'),
  bus:require('./modules/bus'),
}
var uniqueName={
  nameInstances:{}
}
uniqueName.get=function(base){
  if(uniqueName.nameInstances[base]){
    var ret= base+" "+uniqueName.nameInstances[base];
    uniqueName.nameInstances[base]++;
    return ret;
  }else{
    uniqueName.nameInstances[base]=1;
    return base;
  }
}
module.exports=function(environment){return new(function(){
  this.availableModules=[];
  for(var a in Modules){
    this.availableModules.push(a);
    Modules[a]=Modules[a](environment);
  }
  onhandlers.call(this);
  var thisPatcher=this;
  var destinationList=[];
  //some of the elements chan be chosen as "inputs"
  //as opposed to most of them that can only choose outputs.
  var sourcesList=[];
  if(!this.modules) this.modules={};
  this.getDestList=function(){
    destinationList=[];
    for(var a in this.modules){
      destinationList.push(a);
    }
    return destinationList;
  }
  this.getSourcesList=function(){
    sourcesList=[];
    for(var a in this.modules){
      if(typeof this.modules[a].attachAsOutput==="function")
      sourcesList.push(a);
    }
    return sourcesList;
  }

  //creates a module
  this.createModule=function(type,props){
    if(Modules[type]){
      var newModule=new Modules[type].instance(props);
      thisPatcher.registerModule(type,newModule,props);
      return newModule;
    }else{
      /**/console.log("a "+type+ "module was not created because it doesnt exist");
    }
  }
  this.registerModule=function(type,what,props){
    var nameBase=type;
    var name;
    if(props){
      if(props.name) nameBase=props.name
    }
    name=uniqueName.get(nameBase);
    /**/console.log(name+": a new "+type+" module was created");
    this.modules[name]=what;
    this.handle("modulecreated",{name:name,type:type,module:what});
  }

  this.receiveEvent=function(evt){
    if(evt.destination){
      if(thisPatcher.modules[evt.destination]){
        thisPatcher.modules[evt.destination].receiveEvent(evt);
      }else{
        /**/console.log("invalid "+evt.destination+" destination");
      }
    }else{
      console.warn("event didn't have destination", evt);
    }
  }
});
}
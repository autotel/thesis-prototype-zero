'use strict';
module.exports=function(environment){
  if(!environment.destinations) environment.destinations={};
  environment.destinations.grade=this;
  //pendant: these musical events should be instances of an event object, that work like a vector
  this.receiveEvent=function(event){
    console.log("not implemented yet");
  }
}
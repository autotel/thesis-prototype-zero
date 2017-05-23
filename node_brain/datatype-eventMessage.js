'use strict'
module.exports=function(properties){
  this.destination="midi";
  this.isEventMessage=true;
  this.value=[];
  this.set=function(data){
    for(var a in data){
      if(typeof data[a]!=="function")
        this[a]=JSON.parse(JSON.stringify(data[a]));
    }
  }
  this.set(properties);
}
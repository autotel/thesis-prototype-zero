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
  this.compareTo=function(otherEvent,propertyList){
    for(var a of propertyList){
      if(JSON.parse(JSON.stringify(this[a]))!=JSON.parse(JSON.stringify(otherEvent[a])))
      return false;
    }
    return true;
  }
  this.set(properties);
}
'use strict'
module.exports=function(properties){
  var thisEm=this;
  this.destination=false;
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
  //apply all the characteristics of other event message to this one, except the ones that are
  //"transparent" in the other (value==-1)
  this.superImpose=function(otherEvent){
    if(otherEvent.destination!=false&&otherEvent.destination!=-1){
      thisEm.destination=otherEvent.destination;
    }
    for(var a in otherEvent.value){
      if(otherEvent.value[a]!=-1){
        thisEm.value[a]=otherEvent.value[a];
      }
    }
  }
  //apply only the characteristics of other event message if the ones in  this are transparent
  this.underImpose=function(otherEvent){
    if(thisEm.destination==false||thisEm.destination==-1){
      thisEm.destination=otherEvent.destination;
    }
    for(var a in thisEm.value){
      if(thisEm.value[a]==-1){
        thisEm.value[a]=otherEvent.value[a];
      }
    }
  }
  this.set(properties);
}
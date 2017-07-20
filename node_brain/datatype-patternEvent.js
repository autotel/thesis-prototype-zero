'use strict'
var eventMessage=require("./datatype-eventMessage");
module.exports=function(properties){
  var thisPE=this;
  if(properties){
    for(var a in properties){
      this[a]=properties[a];
    }
    if(thisPE.on.isEventMessage!==true) thisPE.on=new eventMessage(thisPE.on);
    if(thisPE.off!==false)
      if(thisPE.off.isEventMessage!==true) thisPE.off=new eventMessage(thisPE.off);
      //untested:
  }
  this.compareTo=function(other,propertyList){
    return this.on.compareTo(other.on)& this.off.compareTo(other.off);
  }
  this.from=function(eventMessage){
    thisPE.on=new eventMessage(eventMessage);
    thisPE.off=new eventMessage(eventMessage);
    thisPE.off.data[2]=0x00;
  };
}
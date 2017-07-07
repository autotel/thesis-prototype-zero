'use strict'
var eventMessage=require("./datatype-eventMessage");
module.exports=function(properties){
  var thisPE=this;
  for(var a in properties){
    this[a]=properties[a];
  }
  if(thisPE.on.isEventMessage!==true) thisPE.on=new eventMessage(thisPE.on);
  if(thisPE.off!==false)
    if(thisPE.off.isEventMessage!==true) thisPE.off=new eventMessage(thisPE.off);
    //untested:
  this.compareTo=function(other,propertyList){
    return this.on.compareTo(other.on)& this.off.compareTo(other.off);
  }
}
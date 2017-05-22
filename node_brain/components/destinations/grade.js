var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
  environment.patcher.destinations.grade=this;
//console.log("..");
//console.log(environment);
  var thisDest=this;
  var myDestination="midi";
  var scaleMap=0x00;
  var scaleArray=[];
  // this.lastUsed=0;
  this.receive=function(event){
    newEvent=new eventMessage(event);
    newEvent.destination=myDestination;
    console.log(scaleArray);
    var noteWraped=scaleArray[event.value[1]%scaleArray.length];
    newEvent.value[1]=noteWraped+(12*Math.floor(event.value[1]/12));
    environment.patcher.receiveEvent(newEvent);
    // thisDest.lastUsed=noteWraped;
    // environment.patcher.destinations[myDestination];
  }
  this.newScaleMap=function(to){
    scaleMap=to;
    scaleArray=[];
    var count=0;
    for(var a =0; a<12; a++){
      if((scaleMap>>a)&1){
        scaleArray.push(a);
      }
    }
    console.log("sa",scaleArray);
  }

})()}
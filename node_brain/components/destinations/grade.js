var destinationBase=require('./destinationBase');
module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
  var myDestination="midi";
  var scaleMap=0x00;
  this.receiveEvent=function(event){
    event.destination=myDestination;
    environment.patcher.receiveEvent(event);
    environment.destinations[myDestination];
  }
  this.newScaleMap=function(to){
    scaleMap=to;
  }

})()}
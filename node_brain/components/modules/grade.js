var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const onhandlers=require('onhandlers');
module.exports=function(environment){
  return new(function(){
    this.instance=function(props){
      destinationBase.call(this,environment);
      onhandlers.call(this);
    //console.log("..");
    //console.log(environment);
      var thisDest=this;
      var baseEventMessage=new eventMessage();
      var scaleMap=0x00;
      // var scaleArray=[];
      this.scaleArray=[];
      // this.lastUsed=0;
      this.receiveEvent=function(event){
        if(!thisDest.mute)
        if(baseEventMessage.destination){
          this.handle('receive',event);
          newEvent=new eventMessage(event);
          newEvent.destination=baseEventMessage.destination;
          // console.log(thisDest.scaleArray);
          var noteWraped=thisDest.scaleArray[event.value[1]%thisDest.scaleArray.length];
          newEvent.value[1]=noteWraped+(12*Math.floor(event.value[1]/12));
          environment.patcher.receiveEvent(newEvent);
          thisDest.handle('messagesend',{origin:thisDest,eventMessage:newEvent});
          // thisDest.lastUsed=noteWraped;
          // environment.patcher.modules[myDestination];
        }
      }
      this.newScaleMap=function(to){
        scaleMap=to;
        thisDest.scaleArray=[];
        var count=0;
        for(var a =0; a<12; a++){
          if((scaleMap>>a)&1){
            thisDest.scaleArray.push(a);
          }
        }
        // console.log("sa",thisDest.scaleArray);
      }
      this.set=function(to){
        baseEventMessage=to;
      }
    }
  })()
}
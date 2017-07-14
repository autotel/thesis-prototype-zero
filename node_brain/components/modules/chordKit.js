var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const onhandlers=require('onhandlers');
module.exports=function(environment){
  return new(function(){
    this.instance=function(props){
      destinationBase.call(this,environment);
      onhandlers.call(this);
      var thisDest=this;
      var baseEventMessage=new eventMessage();
      var scaleMap={};
      this.scaleArray={};
      this.receiveEvent=function(event){
        //TODO: if I don't have that chord or it is empty, I just don't play anything.
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
      this.newScaleMap=function(identifier,to){
        scaleMap[identifier]=to;
        thisDest.scaleArray[identifier]=[];
        var count=0;
        for(var a =0; a<12; a++){
          if((scaleMap[identifier]>>a)&1){
            thisDest.scaleArray[identifier].push(a);
          }
        }
      }
      this.getScaleMap=function(identifier){
        return scaleMap[identifier]||0x00;
      }
      this.set=function(to){
        baseEventMessage=to;
      }
    }
  })()
}
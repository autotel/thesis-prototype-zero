'use strict';
var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
var patternEvent=require('../../datatype-patternEvent');
const onhandlers=require('onhandlers');
module.exports=function(environment){
  return new(function(){
    this.instance=function(props){
      destinationBase.call(this,environment);
      onhandlers.call(this);

      this.currentChord=0;
      var thisDest=this;
      this.baseEventMessage=new eventMessage();
      var scaleMap={};
      //keep track of triggered notes
      var notesOn={};
      this.scaleArray={};
      this.receiveEvent=function(event){
        //TODO: if I don't have that chord or it is empty, I just don't play anything.
        if(!thisDest.mute)
        if(thisDest.baseEventMessage.destination){
          //header 0x80 indicates send note off
          if((event.value[0]|0xf0)==0x80||event.value[2]==0){
            if(notesOn[event.value[1]]){
              for(var a of notesOn[event.value[1]]){
                // console.log("A");
                var newEvent=new eventMessage(a);
                // console.log("-----off:");
                // console.log(newEvent);
                // if(newEvent.value[2]===undefined){
                //   crash();
                // }
                //tweak the registered noteon to be a noteoff of the same
                //TODO: these operations should be built in the eventMessage
                newEvent.value[2]=0;
                newEvent.value[0]=(newEvent.value[0]|0xf0)&0x8F;
                environment.patcher.receiveEvent(newEvent);
                thisDest.handle('messagesend',{eventMessage:newEvent});
              }
              delete notesOn[event.value[1]];
            }
            // notesOn[event.value[1]].push(newEvent);
          }else{
            // console.log("B");
            this.handle('receive',event);
            if((event.value[0]&0xf)==1){
              //header 1 is change chord
              // if(!thisDest.currentChord)thisDest.cu
              thisDest.currentChord=event.value[1];
              thisDest.handle('chordchange');
              // console.log("chordchange",event);
            }else if((event.value[0]&0xf)==0){
              if(thisDest.scaleArray[thisDest.currentChord]){
                //header 0 is play note in scale
                // console.log("note",event);
                var newEvent=new eventMessage(thisDest.baseEventMessage);
                newEvent.underImpose(event);
                // console.log("unimp",newEvent,event);
                // console.log(thisDest.scaleArray);
                var scaleLength=thisDest.scaleArray[thisDest.currentChord].length;
                // console.log(scaleLength);
                // console.log("(thisDest.scaleArray["+thisDest.currentChord+"]["+event.value[1]+"%"+scaleLength+"];");
                var noteWraped=thisDest.scaleArray[thisDest.currentChord][event.value[1]%scaleLength];
                // console.log("NW:"+noteWraped);
                newEvent.value[1]=noteWraped+(12*Math.floor(event.value[1]/scaleLength));
                newEvent.value[1]+=thisDest.baseEventMessage.value[1];

                environment.patcher.receiveEvent(newEvent);
                thisDest.handle('messagesend',{eventMessage:newEvent});
                // console.log("OPT",newEvent);
                if(!notesOn[event.value[1]]) notesOn[event.value[1]]=[];
                notesOn[event.value[1]].push(newEvent);
                thisDest.handle('messagesend',{origin:thisDest,eventMessage:newEvent});
                // thisDest.lastUsed=noteWraped;
                // environment.patcher.modules[myDestination];
              }
            }else{
              console.log("wasted event",event,(event.value[0]|0xf)+"=!"+0);
            }
          }
        }
      }
      this.newScaleMap=function(identifier,to){
        // console.log("scale map update "+identifier);
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
      // this.set=function(to){
      //   baseEventMessage=to;
      // }
    }
  })()
}
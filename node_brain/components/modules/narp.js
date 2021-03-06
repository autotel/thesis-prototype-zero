var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
var patternEvent=require('../../datatype-patternEvent');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){
  //singleton return
  return new(function(){
    //instancing function return;
    this.instance=function(props){
      destinationBase.call(this,environment);

      var thisModule=this;
      var kit=[];
      this.kit=kit;

      this.receiveEvent=function(event){
        if(!thisModule.mute){
        }
      }
      this.getEventDestinations=function(){
        var ret={};
        for(var a in kit)
          // for(var b in this.patData[a])
            if(kit[a].on){
              ret[a]=(kit[a].on.destination)
            }
        return ret;
      }
      this.padOn=function(num){
        if(kit[num]){
          kit[num].isPlaying=true;
          environment.patcher.receiveEvent(kit[num].on);
          thisModule.handle('messagesend',{origin:thisModule,sub:num,eventMessage:kit[num].on});
        }
      }
      this.padOff=function(num){
          if(kit[num]){
            environment.patcher.receiveEvent(kit[num].off);
            thisModule.handle('messagesend',{origin:thisModule,sub:num,eventMessage:kit[num].off});
            kit[num].isPlaying=false;
          }
      }
      this.set=function(number,data){
        // console.log("kit set",data);
        if(data==false){
          kit[number]=false;
          return;
        }
        if(!kit[number]){
          kit[number]=new patternEvent({
            on:new eventMessage(data.on),
            off:new eventMessage(data.off),
          });
        }else{
          if(kit[number].isPlaying){
            // thisModule.padOff(number);
            environment.patcher.receiveEvent(new eventMessage(kit[number].off));
            kit[number].isPlaying=false;
            console.log("isPlaying");
          }
          kit[number].on.set(data.on);
          kit[number].off.set(data.off);
        }
      }
      this.mutePreset=function(number,muteStatus){
        if(kit[number]) kit[number].mute=muteStatus;
      }
      function applyProps(props){
        if(props){
          if(props.kit)
          for(var a in props.kit){
            var ton=new eventMessage(props.kit[a]);
            var toff=new eventMessage(props.kit[a]);
            toff.value[2]=0;
            thisModule.set(a,new patternEvent({on:ton,off:toff}) );
          }
          props.kit=undefined;
          for(var a in props){
            this[a]=props[a];
          }
        }
      }
      applyProps(props);
    }

  })();
}
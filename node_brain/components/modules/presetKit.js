var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){
  //singleton return
  return new(function(){
    //instancing function return;
    this.instance=function(props){
      destinationBase.call(this,environment);

      var thisDest=this;
      var kit=[];
      this.kit=kit;
      this.receive=function(event){
        if(kit[event.value[1]])
        //pendant: I feel that this solution to route note offs is a bit too patchy and too much like midi.
        if(event.value[2]==0){
          var outMsg=kit[event.value[1]].on;
          environment.patcher.receiveEvent(outMsg);
          thisDest.handle('messagesend',{origin:thisDest,sub:event.value[1],eventMessage:outMsg});

        }else{
          var outMsg=kit[event.value[1]].off;
          environment.patcher.receiveEvent(outMsg);
          thisDest.handle('messagesend',{origin:thisDest,eventMessage:outMsg});
        }
        this.handle('receive',moduleEvent(this,event));
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
        if(kit[num])
        environment.patcher.receiveEvent(kit[num].on);
        thisDest.handle('messagesend',{origin:thisDest,sub:num,eventMessage:kit[num]});
      }
      this.padOff=function(num){
          if(kit[num])
          environment.patcher.receiveEvent(kit[num].off)
      }
      this.set=function(number,data){
        if(!kit[number]){
          kit[number]=new eventMessage(data);
        }else{
          kit[number].set(data);
        }
      }
    }
  })();
}
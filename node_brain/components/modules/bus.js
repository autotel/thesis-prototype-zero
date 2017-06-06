'use strict';
var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
module.exports=function(environment){
  //singleton return
  return new(function(){
    //instancing function return;
    //some modules could have many different possible instances
    //some modules even instance themselves, like midi.
    this.instance=function(props){
      var thisBus=this;
      var myOutputs=[];
      destinationBase.call(this,environment);
      this.getDestinations=function(){
        return myOutputs;
      }
      this.sendOutputTo=function(who){
        var handle=undefined;
        for(var a in myOutputs){
          if(!myOutputs[a]) handle=a;
        }
        if(handle===undefined) handle=myOutputs.length;
        myOutputs.push(who);
        // console.log("?",handle);
        return handle;
      };
      this.disableOutputTo=function(whom){
        // console.log("rmIp",handle);
        var handle=myOutputs.indexOf(whom);
        if(!handle) console.error(whom+" asked bus to disable output that didnt have");
        myOutputs[handle]=false;
      };
//       disableOutputTo
// sendOutputTo
      this.receiveEvent=function(evt){
        //console.log("bus: receive",evt);
        for(var a in myOutputs){
          //console.log(" bus: send");
          if(myOutputs[a]){
            myOutputs[a].receiveEvent(evt);
            thisBus.handle('messagesend',{origin:thisBus,eventMessage:evt});
          }
        }
        thisBus.handle('messagereceive',{origin:thisBus,eventMessage:evt});
      }
      // environment.patcher.registerOutput("bus",this);
      // environment.patcher.registerInput("bus",this);
    }
  })();
}
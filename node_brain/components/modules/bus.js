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
      thisBus=this;
      var myOutputs=[];
      destinationBase.call(this,environment);
      this.attachAsOutput=function(who){
        var handle=myOutputs.length;
        myOutputs.push(who);
        return handle;
      };
      this.getDestinations=function(){
        return myOutputs;
      }
      this.receiveEvent=function(evt){
        //console.log("bus: receive",evt);
        for(var a in myOutputs){
          //console.log(" bus: send");
          myOutputs[a].receiveEvent(evt);
          thisBus.handle('messagesend',{origin:thisBus,eventMessage:evt});
        }
        thisBus.handle('messagereceive',{origin:thisBus,eventMessage:evt});
      }
    }
  })();
}
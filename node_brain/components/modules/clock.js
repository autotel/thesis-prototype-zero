var destinationBase=require('./destinationBase');
var eventMessage=require('../../datatype-eventMessage');
const moduleEvent=require("./moduleEvent");
const onhandlers=require('onhandlers');

function MetronomePrototype(props) {
  var props=props||{};
  var interval=140||props.interval;
  var currentStep=0||props.currentStep;
  var tMetro=this;
  var myIndex=0;
  onhandlers.call(this);
  this.onTick=function(evt){
    tMetro.handle('tick',evt);
  };
  function stm(){
    currentStep++;
    currentStep%=16*15*14*13*12*11*10*9*8*7*6*5*4*3*2;
    tMetro.onTick({step:currentStep,indexNumber:myIndex});
    setTimeout(stm,interval);
  }
  this.setIndex=function(index){
    myIndex=index;
  }
  stm();
  this.interval=function(val){
    if(val) interval=val;
    return interval;
  }
}
module.exports=function(environment){
  //singleton return
  return new(function(){
    //instancing function return;
    //some modules could have many different possible instances
    //some modules even instance themselves, like midi.
    this.instance=function(props){
      var clocks=[];
      destinationBase.call(this,environment);
      this.addClock=function(){
        var newMetro=new MetronomePrototype();
        newMetro.setIndex(clocks.length);
        clocks.push(newMetro);
        return newMetro;
      }
      this.getClocks=function(){
        return clocks;
      }
    }

  })();
}
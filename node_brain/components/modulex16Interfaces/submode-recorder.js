module.exports=function(environment){
  return new(function(environment){
    //TODO: recConfig needs not to be a 2d configurator, only 1d
    var selector=require('./submode-2dConfigurator')(environment);
    selector.initOptions({
      'rec':{
        value:-1,
        subValue:120,
        multiplier:4,
        getValueName:function(a){ return "off" },
        maximumValue:0,
        minimumValue:-1,
      }
    });
    this.recording=false;
    var recTarget=false;
    var recTargetSelector=selector.options[0];
    this.recordOn=function(identifier,newEventMessage){
      if(recTarget){
        recTarget
        .recordNoteStart(evt.data[0], newEventMessage );
      }
    }
    this.recordOff=function(identifier){
      recTarget.recordNoteEnd(identifier);
    }
    this.engage=selector.engage;
    this.disengage=selector.disengage;
    this.eventResponses=selector.eventResponses;
  }
});
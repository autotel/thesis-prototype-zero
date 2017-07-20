module.exports=function(environment){
  return new(function(){
    var thisSubmod=this;
    //TODO: recConfig needs not to be a 2d configurator, only 1d
    var selector=require('./submode-2dConfigurator')(environment);
    var patcherModulesList=[];
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
    recTargetSelector.candidates=[];
    recTargetSelector.getValueName=function(value){
      if(value==-1)
      return "disabled";
      else{
        var str=recTargetSelector.candidates[value].name;
        return (str.substr(-12));
      }
    }

    recTargetSelector.valueChangeFunction=function(selection,delta){

      //check if our list of modules is updated
      if(patcherModulesList.length!==environment.patcher.modules.length){
        recTargetSelector.candidates=[];
        patcherModulesList=environment.patcher.getDestList();
        //we actually get a list of interfaces. recording is interface sided, not modular sided
        for(var a in environment.moduleX16Interface.all){
          if(typeof environment.moduleX16Interface.all[a].recordNoteStart==="function"){
            recTargetSelector.candidates.push({name:a,interface:environment.moduleX16Interface.all[a]});
            console.log("add rec "+a);
          }
        }
        console.log("reclen "+(recTargetSelector.candidates.length-1));
        recTargetSelector.maximumValue=recTargetSelector.candidates.length-1;
      }

      if(!selection) selection=recTargetSelector.value+delta;
      if(selection>=recTargetSelector.minimumValue||delta>0)
      if(selection<=recTargetSelector.maximumValue||delta<0){
        recTargetSelector.value=selection;
        if(selection>-1){
          recTarget=recTargetSelector.candidates[selection].interface;
        }else{
          recTarget=false;
        }
      }
    }
    this.recordOn=function(identifier,newEventMessage){
      // console.log("record");
      if(recTarget){
        // console.log(recTarget);
        recTarget
        .recordNoteStart(identifier, newEventMessage );
      }
    }
    this.recordOff=function(identifier){
      recTarget.recordNoteEnd(identifier);
    }
    this.toggleRec=function(){
      thisSubmod.recording=!thisSubmod.recording;
    }
    this.engage=selector.engage;
    this.disengage=selector.disengage;
    this.eventResponses=selector.eventResponses;
  })();
};
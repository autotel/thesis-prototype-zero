module.exports=function(environment){
  return new(function(){
    // -it can be multiinstanced in which case options are added in the 2dConfigurator
    // -the interface will call each sub-recorder according to events
    var thisSubmod=this;
    //TODO: recConfig needs not to be a 2d configurator, only 1d
    var selector=require('./submode-2dConfigurator')(environment);
    var patcherModulesList=[];

    selector.initOptions({
      'rec':{
        value:-1,
        getValueName:function(a){ return "off" },
        maximumValue:0,
        minimumValue:-1,
      },
      'src':{
        value:0,
        getValueName:function(a){
          return (["ui","output"])[a];
        },
        maximumValue:1,
        minimumValue:0,
      },
      'recording':{
        value:0,
        getValueName:function(a){
          return thisSubmod.recording?"REC":"no";
        },
        maximumValue:1,
        minimumValue:0,
      }
    });
    this.recording=false;
    // var uiRecTarget=false;
    var recTargetSelector=selector.options[0];
    var recSrcSelector=selector.options[1];
    var recStateToggler=selector.options[2];
    selector.valueChangeFunction=function(newValue){
      // console.log("vcf",newValue);
      if(newValue==2){
        thisSubmod.recording=true;
      }else{
        thisSubmod.recording=false;
      }
    }
    recTargetSelector.candidates=[];
    recTargetSelector.destination=false;
    recTargetSelector.getValueName=function(value){
      if(!recTargetSelector.candidates[value]){
        return "disabled";
      }else{
        var str=recTargetSelector.candidates[value].name;
        return (str.substr(-12));
      }
    }

    //when value changes, it needs to update the recording destinations list
    recTargetSelector.valueChangeFunction=function(selection,delta){
      //check if our list of modules is updated
      var subj=recTargetSelector;
      if(patcherModulesList.length!==environment.patcher.modules.length){
        subj.candidates=[];
        patcherModulesList=environment.patcher.getDestList();
        //we actually get a list of interfaces. recording is interface sided, not modular sided
        for(var a in environment.moduleX16Interface.all){
          if(typeof environment.moduleX16Interface.all[a].recordNoteStart==="function"){
            subj.candidates.push({name:a,interface:environment.moduleX16Interface.all[a]});
            // console.log("add rec "+a);
          }
        }
        // console.log("reclen "+(subj.candidates.length-1));
        subj.maximumValue=subj.candidates.length-1;
      }

      if(!selection) selection=subj.value+delta;
      if(selection>=subj.minimumValue||delta>0)
      if(selection<=subj.maximumValue||delta<0){
        subj.value=selection;
        if(selection>-1){
          subj.selected=subj.candidates[selection].interface;
          subj.destination=subj.candidates[selection].interface;
        }else{
          subj.selected=false;
        }
      }
    }

    this.recordOptEvent=function(evt){
      if(recSrcSelector.value==1)
      // console.log((evt.value[0]|0xf0)==0x80,evt.value[2]==0);
      if((evt.value[0]|0xf0)==0x80|| evt.value[2]==0){
        // console.log("optrecoff",evt);
        thisSubmod.recordOptOff(evt.value[1]);
      }else{
        // console.log("optrecon",evt);
        thisSubmod.recordOptOn(evt.value[1],evt);
      }
    }
    this.recordOptOn=function(identifier,newEventMessage){
      // console.log("record",newEventMessage);
      if(recSrcSelector.value==1)
      if(recTargetSelector.destination){
        // console.log(recTargetSelector.destination);
        console.log("recordOptOn");
        recTargetSelector.destination.recordNoteStart(identifier, newEventMessage );
      }
    }
    this.recordOptOff=function(identifier){
      if(recSrcSelector.value==1)
      if(recTargetSelector.destination){
        // console.log("recorder recordUiOff",identifier);
        console.log("recordOptOff");
        recTargetSelector.destination.recordNoteEnd(identifier);
      }
    }
    this.recordUiOn=function(identifier,newEventMessage){
      // console.log("record",newEventMessage);
      if(recSrcSelector.value==0)
      if(recTargetSelector.destination){
        console.log("recordUiOn");
        // console.log(recTargetSelector.destination);
        recTargetSelector.destination.recordNoteStart(identifier, newEventMessage );
      }
    }
    this.recordUiOff=function(identifier){
      if(recSrcSelector.value==0)
      if(recTargetSelector.destination){
        // console.log("recorder recordUiOff",identifier);
        console.log("recordUiOff");
        recTargetSelector.destination.recordNoteEnd(identifier);
      }
    }
    this.toggleRec=function(){
      thisSubmod.recording=!thisSubmod.recording;
    }
    this.engage=function(){
      // toggleRecordOnRelease=true;
      selector.engage();
    }
    this.disengage=function(){
      selector.disengage();
      // if(toggleRecordOnRelease){
      //   thisSubmod.toggleRec();
      // }
    }
    this.eventResponses=selector.eventResponses;
  })();
};
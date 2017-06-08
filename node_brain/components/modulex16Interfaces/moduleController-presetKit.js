'use strict';
var base=require('./interactionModeBase');
var eventMessage=require('../../datatype-eventMessage');

// var controlledModule=require('../modules/presetKit.js');
//pendant: there should be a really easy way to mute presets.
//pendant: preset editor should have many channels allowing 16*16 presets
module.exports=function(environment){
  return new(function(){
    //pendant: this.create should be turned into a "instance" prototype
    //to make it more concordant with how the modules are created
    this.instance=function(controlledModule){
      var fingerMap=0x0000;
      var noteHighlightMap=0x0000;
      var currentlySelectedPreset=0;
      var shiftPressed=false;
      var subSelectorEngaged=false;
      var lastsubSelectorEngaged="dimension";
      var engaged=false;
      var recording=false;
      var mutedPadsMap=0x0000;

      //submodes or selectors
      // this.testname="presetKit control";
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
      selectors.recConfig=require('./submode-2dConfigurator');
      // console.log("new controlledModule",controlledModule);
      base.call(this);
      for(var a in selectors){
        selectors[a]=selectors[a](environment);
      }
      var destNames=[];
      selectors.recConfig.initOptions({
        'rec dest':{
          value:-1,
          subValue:120,
          multiplier:4,
          getValueName:function(a){ return (Math.round(bpm.subValue*100)/100)+"*"+bpm.multiplier+"bpm" },
          maximumValue:0,
          minimumValue:-1,
        }
      });
      var recTarget=false;
      var recTargetSelector=selectors.recConfig.options[0];
      var patcherModulesList=[];
      recTargetSelector.candidates=[];
      recTargetSelector.getValueName=function(value){
        if(value==-1)
        return "disabled";
        else
        return recTargetSelector.candidates[value].name;
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


      //ui feedback

      function updateHardware(){
        var programmedMap=0x0000;
        for(var a in controlledModule.kit){
          programmedMap|=1<<a;
        }
        var selectedPresetBitmap=0x1<<currentlySelectedPreset;
        if(recording){
          environment.hardware.draw([(selectedPresetBitmap|programmedMap)&(~mutedPadsMap),programmedMap|selectedPresetBitmap|noteHighlightMap^mutedPadsMap,0xffff]);
        }else{
          environment.hardware.draw([(selectedPresetBitmap|programmedMap)&(~mutedPadsMap),programmedMap|selectedPresetBitmap|noteHighlightMap^mutedPadsMap,selectedPresetBitmap|noteHighlightMap]);
        }
      }
      //when a note is routed to the presetKit that this mode controls
      controlledModule.on('receive',function(evm){
        if(engaged&& !subSelectorEngaged){
          noteHighlightMap|=1<<evm.value[1];
          updateHardware();
          //pendant: the note should actually go off when there is a note off,
          //but there are no note offs yet
          setTimeout(function(){noteHighlightMap^=1<<evm.value[1]; if(engaged&&(!subSelectorEngaged)) updateHardware()},200);
        }
      });
      this.engage=function(){
        environment.hardware.sendScreenA("preset set");
        engaged=true;
        // console.log("engage mode selector");
        updateHardware();
      }
      this.disengage=function(){
        engaged=false;
      }

      this.eventResponses.buttonMatrixPressed=function(evt){
        if(!subSelectorEngaged){
          fingerMap=evt.data[2]|(evt.data[3]<<8);
          currentlySelectedPreset=evt.data[0];
          selectors.dimension.setFromSeqEvent(controlledModule.kit[currentlySelectedPreset]);
          if(shiftPressed){
            mutedPadsMap^=1<<evt.data[0];
          }else{
            if(!(mutedPadsMap>>evt.data[0])&0x1)
            controlledModule.padOn(evt.data[0]);
          }
          if(recording)
          if(recTarget){
            recTarget
            .recordNoteStart(evt.data[0],
              new eventMessage({
                destination:controlledModule.name,
                value:[
                  0,
                  evt.data[0],
                  controlledModule.kit[evt.data[0]]?controlledModule.kit[evt.data[0]].value[3]:100
                ],
              }));
          }
          updateHardware();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        if(!subSelectorEngaged){
          fingerMap=evt.data[2]|(evt.data[3]<<8);
          controlledModule.padOff(evt.data[0]);
          if(recording)
          if(recTarget)
          recTarget.recordNoteEnd(evt.data[0]);
          updateHardware();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.encoderScroll=function(evt){
        if(selectors[lastsubSelectorEngaged]){
          selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
          if(lastsubSelectorEngaged=="dimension")
            controlledModule.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
        }
      }
      this.eventResponses.encoderPressed=function(evt){

      }
      this.eventResponses.encoderReleased=function(evt){

      }
      this.eventResponses.selectorButtonPressed=function(evt){
        if(evt.data[0]==1){
          subSelectorEngaged='dimension';
          lastsubSelectorEngaged='dimension';
          selectors.dimension.engage();
        }else if(evt.data[0]==2){
          recording=!recording;
          subSelectorEngaged='recConfig';
          lastsubSelectorEngaged='recConfig';
          selectors.recConfig.engage();
        }else if(evt.data[0]==3){
          shiftPressed=true;
        }
      }
      this.eventResponses.selectorButtonReleased=function(evt){
        if(evt.data[0]==1){
          subSelectorEngaged=false;
          selectors.dimension.disengage();
        }else if(evt.data[0]==2){
          subSelectorEngaged=false;
          selectors.recConfig.disengage();
        }else if(evt.data[0]==3){
          shiftPressed=false;
        }
        updateHardware();
      }
    }
  })();
};
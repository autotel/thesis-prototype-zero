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
      var pasting=false;

      //submodes or selectors
      // this.testname="presetKit control";
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
      //TODO: recConfig needs not to be a 2d configurator, only 1d
      selectors.recConfig=require('./submode-2dConfigurator');
      selectors.utilMode=require('./submode-1dConfigurator');
      // console.log("new controlledModule",controlledModule);
      base.call(this);
      for(var a in selectors){
        selectors[a]=selectors[a](environment);
      }
      selectors.dimension.dangerName(controlledModule.name);
      var destNames=[];
      selectors.recConfig.initOptions({
        'rec':{
          value:-1,
          subValue:120,
          multiplier:4,
          getValueName:function(a){ return "off" },
          maximumValue:0,
          minimumValue:-1,
        }
      });
      selectors.utilMode.valueNames=["mute","copy","clear","set","set+increment a","set+increment head"];
      selectors.utilMode.initOption({
        name:'util',
        value:0,
        getValueName:function(a){ return selectors.utilMode.valueNames[a] },
        maximumValue:selectors.utilMode.valueNames.length-1,
        minimumValue:0,
      });
      var utilMode=selectors.utilMode.option;
      console.log("utilmode",utilMode);
      var recTarget=false;
      var recTargetSelector=selectors.recConfig.options[0];
      var patcherModulesList=[];
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


      //ui feedback

      var programmedMap=0x0000;
      function updateHardware(){
        for(var a in controlledModule.kit){
          programmedMap|=1<<a;
        }
        var selectedPresetBitmap=0x1<<currentlySelectedPreset;
        if(recording){
          environment.hardware.draw([
            (programmedMap^mutedPadsMap)|noteHighlightMap,
            programmedMap|noteHighlightMap^mutedPadsMap,
            0xffff]);
        }else{
          environment.hardware.draw([
            (selectedPresetBitmap^programmedMap)&(~mutedPadsMap),
            programmedMap|selectedPresetBitmap|noteHighlightMap^mutedPadsMap,
            noteHighlightMap^selectedPresetBitmap]);
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
          if(pasting!==false){
            //TODO: you can copy an empty pad, and when pasting, it suddenly makes a new pad with defaults
            controlledModule.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
            pasting=false;
          }else{

            if(shiftPressed){
              if(utilMode.value==0){//mute
                mutedPadsMap^=1<<evt.data[0];
                mutedPadsMap&=programmedMap;
                controlledModule.mutePreset(evt.data[0],((mutedPadsMap>>evt.data[0])&0x1)==0x01);
              }else if(utilMode.value==1){//copy
                if(!pasting){
                  pasting=evt.data[0];
                  environment.hardware.sendScreenB("Paste from "+evt.data[0]);
                }
              }else if(utilMode.value==2){//clear
                controlledModule.set(currentlySelectedPreset,false);
                environment.hardware.sendScreenB("Cleared");
                programmedMap&=~(0x1<<evt.data[0]);
              }else if(utilMode.value==3){//set
                controlledModule.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
              }else if(utilMode.value==4){//set+increment a
                controlledModule.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
                selectors.dimension.options[2].currentValue++;
                environment.hardware.sendScreenB("set inc a:"+selectors.dimension.options[2].currentValue);
              }else if(utilMode.value==5){//set+increment h
                controlledModule.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
                selectors.dimension.options[1].currentValue++;
                selectors.dimension.options[1].currentValue%=16;

                environment.hardware.sendScreenB("set inc C:"+selectors.dimension.options[1].currentValue);
              }
            }else{
              // if(!(mutedPadsMap>>evt.data[0])&0x1)
              controlledModule.padOn(evt.data[0]);
              selectors.dimension.setFromSeqEvent(controlledModule.kit[currentlySelectedPreset]);
            }
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
        // TODO: this is a good example of shift mode tweaking in a configurator
        //should apply this to all modes and as standard part of the configurators
        if(subSelectorEngaged){
          selectors[lastsubSelectorEngaged].eventResponses.selectorButtonPressed(evt);
        }else{
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
            // subSelectorEngaged='utilMode';
            lastsubSelectorEngaged='utilMode';
            // selectors.utilMode.engage();
            selectors.utilMode.updateLcd();
            shiftPressed=true;
          }
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
            subSelectorEngaged=false;
            selectors.utilMode.disengage();
            shiftPressed=false;
          }

          selectors[lastsubSelectorEngaged].eventResponses.selectorButtonReleased(evt);

          updateHardware();
      }
    }
  })();
};
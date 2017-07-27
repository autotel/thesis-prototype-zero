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
      // var recording=false;
      var mutedPadsMap=0x0000;
      var pasting=false;

      //submodes or selectors
      // this.testname="presetKit control";
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
      selectors.recorder=require('./submode-recorder');
      selectors.utilMode=require('./submode-1dConfigurator');
      // console.log("new controlledModule",controlledModule);
      base.call(this);
      for(var a in selectors){
        selectors[a]=selectors[a](environment);
      }
      selectors.dimension.dangerName(controlledModule.name);
      var destNames=[];
      selectors.utilMode.valueNames=["mute","copy","clear","set","set+inc a","set+inc head"];
      selectors.utilMode.initOption({
        name:'util',
        value:0,
        getValueName:function(a){ return selectors.utilMode.valueNames[a] },
        maximumValue:selectors.utilMode.valueNames.length-1,
        minimumValue:0,
      });
      var utilMode=selectors.utilMode.option;




      //ui feedback

      var programmedMap=0x0000;
      function updateHardware(){
        for(var a in controlledModule.kit){
          programmedMap|=1<<a;
        }
        var selectedPresetBitmap=0x1<<currentlySelectedPreset;
        if(selectors.recorder.recording){
          environment.hardware.draw([
            (programmedMap^mutedPadsMap)|noteHighlightMap,
            programmedMap|noteHighlightMap^mutedPadsMap,
            0xffff]);
        }else{
          environment.hardware.draw([
            (programmedMap^mutedPadsMap)|selectedPresetBitmap,
            (programmedMap|selectedPresetBitmap|noteHighlightMap)&(~mutedPadsMap),
            (noteHighlightMap^selectedPresetBitmap)|mutedPadsMap]);
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

      controlledModule.on('messagesend',function(ev){
        //hmm... that check sould be inside, right?
        if(selectors.recorder.recording)
        selectors.recorder.recordOptEvent(ev.eventMessage);
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
                selectors.dimension.options[2].value++;
                environment.hardware.sendScreenB("set inc a:"+selectors.dimension.options[2].value);
              }else if(utilMode.value==5){//set+increment h
                controlledModule.set(currentlySelectedPreset,selectors.dimension.getSeqEvent());
                selectors.dimension.options[1].value++;
                selectors.dimension.options[1].value%=16;

                environment.hardware.sendScreenB("set inc C:"+selectors.dimension.options[1].value);
              }
            }else{
              // if(!(mutedPadsMap>>evt.data[0])&0x1)
              controlledModule.padOn(evt.data[0]);
              selectors.dimension.setFromSeqEvent(controlledModule.kit[currentlySelectedPreset]);
            }
          }
          if(selectors.recorder.recording)
          selectors.recorder.recordUiOn(evt.data[0],
            new eventMessage({
              destination:controlledModule.name,
              value:[
                0,
                evt.data[0],
                controlledModule.kit[evt.data[0]]?controlledModule.kit[evt.data[0]].on.value[2]:-1
              ],
            })
          );
          updateHardware();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        if(!subSelectorEngaged){
          fingerMap=evt.data[2]|(evt.data[3]<<8);
          controlledModule.padOff(evt.data[0]);
          if(selectors.recorder.recording)
          selectors.recorder.recordUiOff(evt.data[0]);
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
            subSelectorEngaged='recorder';
            lastsubSelectorEngaged='recorder';
            // selectors.recorder.toggleRec();
            selectors.recorder.engage();
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
            selectors.recorder.disengage();
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
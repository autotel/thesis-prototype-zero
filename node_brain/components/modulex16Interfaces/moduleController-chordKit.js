'use strict';
var base=require('./interactionModeBase');
var eventMessage=require('../../datatype-eventMessage');

module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledModule){
      var fingerMap=0x0000;
      var scaleMap=0xAB5;//major
      var performMode=false;
      var currentChord=0;
      var engaged=false;
      base.call(this);
      //selectors
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');

      selectors.recorder=require('./submode-recorder');



      var subSelectorEngaged=false;
      var lastsubSelectorEngaged="dimension";

      for(var a in selectors){
        selectors[a]=selectors[a](environment);
      }

      selectors.dimension.options[2].name="base note";
      selectors.dimension.options[2].valueNames=function(value){
        if(value==-1) return "transp?"
        return "d"+(value.toString(10));
      }

      controlledModule.on('chordchange',function(){
        console.log("chc");
        if(performMode){
          currentChord=controlledModule.currentChord;
          scaleMap=controlledModule.getScaleMap(currentChord);
          if(engaged)
            updateHardware(true,false);
        }else{
          if(engaged)
            environment.hardware.sendScreenB("chord "+controlledModule.currentChord);
        }
      });

      function selectScaleMap(num){
        if((currentChord==1&&num==1)||(currentChord==4&&num==4)||(currentChord==2&&num==2)||(currentChord==8&&num==8)){
          currentChord=0;
        }else{
          currentChord=num;
        };
        scaleMap=controlledModule.getScaleMap(currentChord);
      }
      function updateScaleMap(newScaleMap){
        scaleMap=newScaleMap;
        controlledModule.newScaleMap(currentChord,newScaleMap);
      }

      updateScaleMap(scaleMap);


      function updateHardware(upleds,upscreen){
        var currentChordMap=0;
        var displayScaleMap=scaleMap<<4;
        var displayFingerMap=fingerMap;
        var displayChordSelectorMap=0xF;
        var screenAString="";
        var screenBString="";
        if(performMode){
          currentChordMap=controlledModule.currentChord&0xf;
          if(selectors.recorder.recording){
            if(upleds)
            environment.hardware.draw([
              displayChordSelectorMap|displayFingerMap|displayScaleMap,
              displayChordSelectorMap|displayFingerMap^displayScaleMap,
              0xAB5F|currentChordMap|displayScaleMap
            ]);
            if(!subSelectorEngaged) screenAString+="REC ";
          }else{
            if(upleds)
            environment.hardware.draw([
              displayChordSelectorMap|displayFingerMap|displayScaleMap,
              displayChordSelectorMap|displayFingerMap^displayScaleMap,
              0xAB50|currentChordMap|displayScaleMap
            ]);
            if(!subSelectorEngaged) screenAString+="Perf "
          }
        }else{
          currentChordMap=currentChord&0xf;
          var displayScaleMap=scaleMap<<4;
          var displayFingerMap=fingerMap;
          var displayChordSelectorMap=0xF;
          //green,blue,red
          if(upleds)
          environment.hardware.draw([
            displayChordSelectorMap|displayFingerMap|displayScaleMap,
            displayChordSelectorMap|displayFingerMap^displayScaleMap,
            0xAB50|currentChordMap|displayScaleMap
          ]);

          if(!subSelectorEngaged) screenAString+=("Edit ");
        }
        if(controlledModule.scaleArray[currentChord]){
          screenAString+="chord "+currentChord+": "+controlledModule.scaleArray[currentChord].length;
        }else{
          screenAString+="chord "+currentChord+": empty";
        }
        if(upscreen)
        environment.hardware.sendScreenA(screenAString);
        // environment.hardware.sendScreenB(screenBString);
      }

      this.engage=function(){
        engaged=true;
        // environment.hardware.sendScreenA("set scale");
        // console.log("engage mode selector");
        updateHardware(true,true);
      }
      this.disengage=function(){
        engaged=false;
      }

      var noteOnTracker=new (function(destination){
        var notesOn={};
        this.press=function(identifier, eMes){
          if(!notesOn[identifier])notesOn[identifier]=[];
          notesOn[identifier].push(eMes);
        }
        this.release=function(identifier,releaseCallback){
          if(notesOn[identifier]){
            for(var a of notesOn[identifier]){
              var newEvent=new eventMessage(a);
              newEvent.value[2]=0;
              newEvent.value[0]=(newEvent.value[0]|0xf0)&0x8F;
              destination.receiveEvent(newEvent);
              if(typeof releaseCallback=="function"){
                releaseCallback(a);
              }
            }
            delete notesOn[identifier];
          }
        }
      })(controlledModule);

      this.eventResponses.buttonMatrixPressed=function(evt){
        var evtFingerMap=(evt.data[2]|(evt.data[3]<<8));
        if(!subSelectorEngaged){
          if(performMode){
            // if(!currentSeqEvent){
            //   currentSeqEvent=selectors.dimension.getSeqEvent();
            // }
            if(evt.data[0]>3){
              //scale section pressed

              var onEventMessage=new eventMessage({
                destination:controlledModule.name,
                value:[0,evt.data[0]-3,97]
              });
              noteOnTracker.press(evt.data[0],onEventMessage);
              controlledModule.receiveEvent(onEventMessage);
              if(selectors.recorder.recording){
                selectors.recorder.recordUiOn(evt.data[0],onEventMessage);
                //a recorded flag is attached to the eventMessage to trigger a record note off when released, regardless of the state of recording. The flag will be pulled from the noteOnTracker
                onEventMessage.recorded=true;
              }
            }else{
              //chordSelector section pressed
              fingerMap=evtFingerMap;
              selectScaleMap(evtFingerMap);
              // controlledModule.currentChord=currentChord;
              updateHardware(true,true);
              var onEventMessage=new eventMessage({
                destination:controlledModule.name,
                value:[1,currentChord,125]
              });
              controlledModule.receiveEvent(onEventMessage);
              if(selectors.recorder.recording){
                selectors.recorder.recordUiOn(evt.data[0],onEventMessage);
                //otherwise the note never gets to the seq memory...
                selectors.recorder.recordUiOff(evt.data[0]);
              }
            }
          }else{
            if(evt.data[0]>3){
              //scale section pressed
              updateScaleMap(scaleMap^(1<<evt.data[0]-4));
              updateScaleMap(scaleMap);
              updateHardware(true,true);
            }else{
              fingerMap=evtFingerMap;
              //chordSelector section pressed
              selectScaleMap(evtFingerMap);
              //TODO: tis doesnt go here, only for testing
              // controlledModule.currentChord=currentChord;
              updateHardware(true,true);
            }
          }
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        //if the event being released was involved in a recording, then record the note off for it
        var released=noteOnTracker.release(evt.data[0],function(onEvt){
          if(onEvt.recorded){
            selectors.recorder.recordUiOff(evt.data[0]);
          }else{
            // console.log("not recorded",onEvt);
          }
        });
        if(!subSelectorEngaged){
          // fingerMap=evt.data[2]|(evt.data[3]<<8);
          updateHardware(true,true);
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixReleased(evt);
        }
      }
      this.eventResponses.encoderScroll=function(evt){
        if(selectors[lastsubSelectorEngaged]){
          selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
          if(lastsubSelectorEngaged=="dimension"){
          var currentSeqEvent=selectors.dimension.getSeqEvent();
            controlledModule.baseEventMessage=currentSeqEvent.on;
            // console.log(controlledModule.baseEventMessage);
          }
        }
      }
      this.eventResponses.encoderPressed=function(evt){

      }
      this.eventResponses.encoderReleased=function(evt){

      }

      this.eventResponses.selectorButtonPressed=function(evt){
        if(subSelectorEngaged){
          selectors[lastsubSelectorEngaged].eventResponses.selectorButtonPressed(evt);
        }else{
          if(evt.data[0]==1){
            subSelectorEngaged='dimension';
            lastsubSelectorEngaged='dimension';
            // TODO: this is hacky. only good enough for my own use
            selectors.dimension.engage();
          }else if(evt.data[0]==2){
            subSelectorEngaged='recorder';
            lastsubSelectorEngaged='recorder';
            selectors.recorder.toggleRec();
            selectors.recorder.engage();
          }else if(evt.data[0]==3){
            performMode=!performMode;
            updateHardware(true,true);
          }
        }
      }
      this.eventResponses.selectorButtonReleased=function(evt){
          if(evt.data[0]==1){
            selectors.dimension.disengage();
            updateHardware(true,true);
            subSelectorEngaged=false;
            // selectors.dimension.disengage();
          }else if(evt.data[0]==2){
            subSelectorEngaged=false;
            selectors.recorder.disengage();
          }else if(evt.data[0]==3){
          }

          selectors[lastsubSelectorEngaged].eventResponses.selectorButtonReleased(evt);

          updateHardware(true,true);
      }
    }
  })();
}
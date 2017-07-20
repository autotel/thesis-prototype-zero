'use strict';
var base=require('./interactionModeBase');
// var controlledModule=require('../modules/grade.js');
module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledModule){
      var fingerMap=0x0000;
      var scaleMap=0xAB5;//major
      var performMode=false;
      var currentChord=0;
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

      function updateHardware(){

        var currentChordMap=currentChord&0xf;
        var displayScaleMap=scaleMap<<4;
        var displayFingerMap=fingerMap;
        var displayChordSelectorMap=0xF;

        if(performMode){
          if(selectors.recorder.recording){
            environment.hardware.draw([
              displayChordSelectorMap|displayFingerMap|displayScaleMap,
              displayChordSelectorMap|displayFingerMap^displayScaleMap,
              0xAB5F|currentChordMap|displayScaleMap
            ]);
            environment.hardware.sendScreenB("REC!");
          }else{
            environment.hardware.draw([
              displayChordSelectorMap|displayFingerMap|displayScaleMap,
              displayChordSelectorMap|displayFingerMap^displayScaleMap,
              0xAB50|currentChordMap|displayScaleMap
            ]);
            environment.hardware.sendScreenB("Perform");
          }
        }else{
          var displayScaleMap=scaleMap<<4;
          var displayFingerMap=fingerMap;
          var displayChordSelectorMap=0xF;
          //green,blue,red
          environment.hardware.draw([
            displayChordSelectorMap|displayFingerMap|displayScaleMap,
            displayChordSelectorMap|displayFingerMap^displayScaleMap,
            0xAB50|currentChordMap|displayScaleMap
          ]);
          if(controlledModule.scaleArray[currentChord]){
            environment.hardware.sendScreenA("chord "+currentChord+": "+controlledModule.scaleArray[currentChord].length);
          }
        }
      }

      this.engage=function(){
        environment.hardware.sendScreenA("set scale");
        // console.log("engage mode selector");
        updateHardware();
      }

      this.eventResponses.buttonMatrixPressed=function(evt){
        if(!subSelectorEngaged){
          if(performMode){
            if(evt.data[0]>3){
              //scale section pressed
              if(selectors.recorder.recording)
              selectors.recorder.recordOn(evt.data[0],
                new eventMessage({
                  destination:controlledModule.name,
                  value:[
                    0,
                    evt.data[0],
                    controlledModule.kit[evt.data[0]]?controlledModule.kit[evt.data[0]].on.value[3]:100
                  ],
                })
              );
              environment.hardware.sendScreenA("pling!");
            }else{
              //chordSelector section pressed
              fingerMap=(evt.data[2]|(evt.data[3]<<8));
              selectScaleMap(fingerMap);
              controlledModule.currentChord=currentChord;
              updateHardware();
              if(selectors.recorder.recording)
              selectors.recorder.recordOn(evt.data[0],
                new eventMessage({
                  destination:controlledModule.name,
                  value:[
                    1,
                    evt.data[0],
                    controlledModule.kit[evt.data[0]]?controlledModule.kit[evt.data[0]].on.value[3]:100
                  ],
                })
              );
              environment.hardware.sendScreenA("plong!");
            }

          }else{
            if(evt.data[0]>3){
              //scale section pressed
              updateScaleMap(scaleMap^(1<<evt.data[0]-4));
              updateScaleMap(scaleMap);
              updateHardware();
            }else{
              fingerMap=(evt.data[2]|(evt.data[3]<<8));
              //chordSelector section pressed
              selectScaleMap(fingerMap);
              //TODO: tis doesnt go here, only for testing
              // controlledModule.currentChord=currentChord;
              updateHardware();
            }
          }
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        if(!subSelectorEngaged){
          fingerMap=evt.data[2]|(evt.data[3]<<8);
          updateHardware();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixReleased(evt);
        }
      }
      this.eventResponses.encoderScroll=function(evt){
        if(selectors[lastsubSelectorEngaged]){
          selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
          if(lastsubSelectorEngaged=="dimension")
            controlledModule.set(selectors.dimension.getSeqEvent().on);
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
          }
        }
      }
      this.eventResponses.selectorButtonReleased=function(evt){
          if(evt.data[0]==1){
            selectors.dimension.disengage();
            updateHardware();
            subSelectorEngaged=false;
            // selectors.dimension.disengage();
          }else if(evt.data[0]==2){
            subSelectorEngaged=false;
            selectors.recorder.disengage();
          }else if(evt.data[0]==3){
          }

          selectors[lastsubSelectorEngaged].eventResponses.selectorButtonReleased(evt);

          updateHardware();
      }
    }
  })();
}
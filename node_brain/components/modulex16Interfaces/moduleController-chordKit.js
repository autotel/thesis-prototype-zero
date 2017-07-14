'use strict';
var base=require('./interactionModeBase');
// var controlledModule=require('../modules/grade.js');
var fingerMap=0x0000;
var scaleMap=0xAB5;//major
module.exports=function(environment){
  return new(function(){
    var performMode=false;
    var currentChord=0;
    this.instance=function(controlledModule){
      //selectors
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
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
        scaleMap=controlledModule.getScaleMap(num);
      }
      function updateScaleMap(newScaleMap){
        scaleMap=newScaleMap;
        controlledModule.newScaleMap(currentChord,newScaleMap);
      }

      updateScaleMap(scaleMap);

      base.call(this);
      function updateHardware(){
        var currentSelectedChordMap=currentChord&0xf;
        if(performMode){

        }else{
          var displayScaleMap=scaleMap<<4;
          var displayFingerMap=fingerMap;
          var displayChordSelectorMap=0xF;
          //green,blue,red
          environment.hardware.draw([
            displayChordSelectorMap|displayFingerMap|displayScaleMap,
            displayChordSelectorMap|displayFingerMap^displayScaleMap,
            0xAB50|currentSelectedChordMap|displayScaleMap
          ]);
          if(controlledModule.scaleArray[currentChord]){
            environment.hardware.sendScreenA("chord "+currentChord+": "+controlledModule.scaleArray[currentChord].length);
          }else{
            environment.hardware.sendScreenA("empty chord");
          }
        }
      }

      this.engage=function(){
        environment.hardware.sendScreenA("set scale");
        // console.log("engage mode selector");
        updateHardware();
      }

      this.eventResponses.buttonMatrixPressed=function(evt){
        fingerMap=(evt.data[2]|(evt.data[3]<<8));
        if(evt.data[0]>3){
          //scale section pressed
          if(!subSelectorEngaged){
            updateScaleMap(scaleMap^(1<<evt.data[0]-4));
            controlledModule.newScaleMap(scaleMap);
            updateHardware();
          }else{
            selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
          }
        }else{
          //chordSelector section pressed
          selectScaleMap(fingerMap);
          updateHardware();
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

          }/*else if(evt.data[0]==2){
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
          }*/
        }
      }
      this.eventResponses.selectorButtonReleased=function(evt){
          if(evt.data[0]==1){
            selectors.dimension.disengage();
            updateHardware();
            subSelectorEngaged=false;
            // selectors.dimension.disengage();
          }/*else if(evt.data[0]==2){
            subSelectorEngaged=false;
            selectors.recConfig.disengage();
          }else if(evt.data[0]==3){
            subSelectorEngaged=false;
            selectors.utilMode.disengage();
            shiftPressed=false;
          }*/

          selectors[lastsubSelectorEngaged].eventResponses.selectorButtonReleased(evt);

          updateHardware();
      }
    }
  })();
}
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
      selectors.recConfig=require('./submode-2dConfigurator');
      var subSelectorEngaged=false;
      var lastsubSelectorEngaged="dimension";

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
      var recTarget=false;
      var recTargetSelector=selectors.recConfig.options[0];

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
        var currentcurrentChordMap=currentChord&0xf;
        if(performMode){

        }else{
          var displayScaleMap=scaleMap<<4;
          var displayFingerMap=fingerMap;
          var displayChordSelectorMap=0xF;
          //green,blue,red
          environment.hardware.draw([
            displayChordSelectorMap|displayFingerMap|displayScaleMap,
            displayChordSelectorMap|displayFingerMap^displayScaleMap,
            0xAB50|currentcurrentChordMap|displayScaleMap
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
        if(performMode){
          controlledModule.currentChord=0;
        }else{

          fingerMap=(evt.data[2]|(evt.data[3]<<8));
          if(!subSelectorEngaged){
            if(evt.data[0]>3){
              //scale section pressed
                updateScaleMap(scaleMap^(1<<evt.data[0]-4));
                updateScaleMap(scaleMap);
                updateHardware();
            }else{
              //chordSelector section pressed
              selectScaleMap(fingerMap);
              //TODO: tis doesnt go here, only for testing
              controlledModule.currentChord=currentChord;
              updateHardware();
            }
          }else{
            selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
          }
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
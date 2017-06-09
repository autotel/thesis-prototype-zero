'use strict';
var base=require('./interactionModeBase');
// var controlledModule=require('../modules/grade.js');
var fingerMap=0x0000;
var scaleMap=0xAB5;//major
module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledModule){
      //selectors
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
      var subSelectorEngaged=false;
      var lastsubSelectorEngaged="dimension";

      for(var a in selectors){
        selectors[a]=selectors[a](environment);
      }

      controlledModule.newScaleMap(scaleMap);
      base.call(this);
      function updateHardware(){
        var displayScaleMap=scaleMap|scaleMap<<12;
        var displayFingerMap=fingerMap|fingerMap<<12;
        environment.hardware.draw([displayFingerMap|displayScaleMap,displayFingerMap^displayScaleMap,displayScaleMap]);
        environment.hardware.sendScreenA("grades: "+controlledModule.scaleArray.length);
      }

      this.engage=function(){
        environment.hardware.sendScreenA("set scale");
        // console.log("engage mode selector");
        updateHardware();
      }
      this.eventResponses.buttonMatrixPressed=function(evt){
        fingerMap=evt.data[2]|(evt.data[3]<<8);
        //wrap around chromatic 12, as we are using our occidental logic
        fingerMap|=fingerMap>>12;
        scaleMap^=1<<evt.data[0];
        // scaleMap|=fingerMap;
        controlledModule.newScaleMap(scaleMap);
        updateHardware();
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        fingerMap=evt.data[2]|(evt.data[3]<<8);
        updateHardware();
      }
      this.eventResponses.encoderScroll=function(evt){
        if(selectors[lastsubSelectorEngaged]){
          selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
          if(lastsubSelectorEngaged=="dimension")
            controlledModule.set(selectors.dimension.getSeqEvent());
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
            // subSelectorEngaged='dimension';
            lastsubSelectorEngaged='dimension';
            // TODO: this is hacky. only good enough for my own use
            selectors.dimension.engage();
            selectors.dimension.disengage();
            updateHardware();
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
            // subSelectorEngaged=false;
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
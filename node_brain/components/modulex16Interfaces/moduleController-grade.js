'use strict';
var base=require('./interactionModeBase');
// var controlledDestination=require('../modules/grade.js');
var fingerMap=0x0000;
var scaleMap=0xAB5;//major
module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledDestination){
      // this.testname="grade control";
      //controlledDestination=controlledDestination(environment);
      controlledDestination.newScaleMap(scaleMap);
      base.call(this);
      function updateHardware(){
        var displayScaleMap=scaleMap|scaleMap<<12;
        var displayFingerMap=fingerMap|fingerMap<<12;
        environment.hardware.draw([displayFingerMap|displayScaleMap,displayFingerMap^displayScaleMap,displayScaleMap]);
        environment.hardware.sendScreenA("grades: "+controlledDestination.scaleArray.length);
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
        controlledDestination.newScaleMap(scaleMap);
        updateHardware();
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        fingerMap=evt.data[2]|(evt.data[3]<<8);
        updateHardware();
      }
      this.eventResponses.encoderScroll=function(evt){

      }
      this.eventResponses.encoderPressed=function(evt){

      }
      this.eventResponses.encoderReleased=function(evt){

      }
    }
  })();
}
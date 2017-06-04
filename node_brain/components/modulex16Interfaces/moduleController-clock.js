'use strict';
var base=require('./interactionModeBase');
module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledDestination){
      var engaged=false;
      var shiftPressed=false;
      var lastsubSelectorEngaged=0;
      var subSelectorEngaged=false;
      var currentSelector=0;
      //clock number that is selected. can't be higher than clocks.length
      var currentlySelectedClock=false;
      //the last matrix button pressed
      var lastMatrixButtonPressed=false;
      var tickMap=0x00;
      function clockTicked(index){
        tickMap^=1<<index;
        if(engaged) updateHardware();
      }
      var selectors={};
      //pendant: the requires should be in the heads, but this requires
      //some general reestructuring
      //controlledDestination=controlledDestination(environment);
      var clocks=controlledDestination.getClocks();
      for(var a in clocks){
        clocks[a].on('tick',function(){
          clockTicked(a);
        });
      }
      var destNames=[];

      selectors.timeConfig=require('./submode-2dConfigurator');
      for(var a in selectors){
        selectors[a]=selectors[a](environment);
      }
      selectors.timeConfig.initOptions({
        'interval':{
          value:40,
          getValueName:function(a){ return a+"ms" },
          maximumValue:10000,
          minimumValue:10,
        },
        'dest':{
          value:0,
          getValueName:function(value){
            return value;
          },
          maximumValue:destNames.length-1,
          minimumValue:0,
        },
      });
      var interval=selectors.timeConfig.options[0];
      var destination=selectors.timeConfig.options[1];
      interval.valueChangeFunction=function(absolute,delta){
        if(currentlySelectedClock!==false){
          //an absolute may not be provided whilst is what we are using
          // console.log(absolute," ",delta);
          var absolute=absolute||interval.value+delta;
          interval.value=clocks[currentlySelectedClock].interval(absolute);
          // updateModifierValuesToSelectedClock();
          if(shiftPressed){
          }else{
          }
        }
      }
      destination.getValueName=function(value){
          if(destNames.length!==environment.patcher.modules.length){
            destNames=environment.patcher.getDestList();
            destination.maximumValue=destNames.length-1;
          }
          return destNames[value];
      }

      destination.valueChangeFunction=function(absolute,delta){
        if(!absolute) absolute=destination.value+delta;
        if(absolute>=destination.minimumValue)
        if(absolute<=destination.maximumValue){
          destination.value=absolute;
          if(absolute>-1){
            clocks[currentlySelectedClock].setDestination(destNames[destination.value]);
          }else{
            clocks[currentlySelectedClock].setDestination(false);
          }
        }
      }

      base.call(this);
      function updateModifierValuesToSelectedClock(){
        if(clocks[currentlySelectedClock]){
          interval.value=clocks[currentlySelectedClock].interval();
        }
      }
      function updateHardware(){
        if(subSelectorEngaged==false){
          var clocksMap=~(0xffff<<clocks.length)
          var selectMap=currentlySelectedClock!==false?1<<currentlySelectedClock:0;
          environment.hardware.draw([selectMap|clocksMap,selectMap,selectMap^tickMap]);
        }
      }
      function updateLcd(){
        if(lastsubSelectorEngaged){
          var displayValue=selectors[lastsubSelectorEngaged].updateLcd();
        }
      }
      this.engage=function(){
        engaged=true;
        environment.hardware.sendScreenA("clock");
        // console.log("engage mode selector");
        updateHardware();
        environment.hardware.sendScreenA("clock");
      }
      this.disengage=function(){
        engaged=false;
      }
      this.eventResponses.buttonMatrixPressed=function(evt){
        if(subSelectorEngaged===false){
          if(clocks[evt.data[0]]){
            currentlySelectedClock=evt.data[0];
            lastMatrixButtonPressed=evt.data[0];
            updateModifierValuesToSelectedClock();
          }else{
            if(lastMatrixButtonPressed===evt.data[0]){
              // clocks.push(
                var newClock=controlledDestination.addClock()//);
                newClock.on('tick',function(evt){
                  clockTicked(evt.indexNumber);
                });
            }else{
              environment.hardware.sendScreenA("Create new?");
              environment.hardware.sendScreenB("then tap again");
            }
            lastMatrixButtonPressed=evt.data[0];
          }
          updateHardware();
          updateLcd();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        updateHardware();
      }
      this.eventResponses.encoderScroll=function(evt){
        if(selectors[lastsubSelectorEngaged])
          selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
      }
      this.eventResponses.encoderPressed=function(evt){

      }
      this.eventResponses.encoderReleased=function(evt){

      }
      this.eventResponses.selectorButtonPressed=function(evt){
        if(evt.data[0]==1){
          subSelectorEngaged='timeConfig';
          lastsubSelectorEngaged='timeConfig';
          selectors.timeConfig.engage();
        }else if(evt.data[0]==3){
          shiftPressed=true;
        }
      }
      this.eventResponses.selectorButtonReleased=function(evt){
        if(evt.data[0]==1){
          subSelectorEngaged=false;
          selectors.timeConfig.disengage();
        }else if(evt.data[0]==3){
          shiftPressed=false;
        }

      }
    }
  })();
}
'use strict';
var base=require('./interactionModeBase');
module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledModule){
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
      // TODO: : the requires should be in the heads, but this requires
      //some general reestructuring
      //controlledModule=controlledModule(environment);
      var clocks=controlledModule.getClocks();
      for(var a in clocks){
        console.log(a);
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
        'BPM':{
          value:0,
          subValue:120,
          multiplier:8,
          getValueName:function(a){ return (Math.round(bpm.subValue*100)/100)+"*"+bpm.multiplier+"bpm" },
          maximumValue:10000,
          minimumValue:10,
        },
        'interval':{
          value:40,
          getValueName:function(a){ return (Math.round(a*100)/100)+"ms" },
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
        'head':{
          value:0,
          getValueName:function(value){
            switch (value) {
              case 0:
                return "absolute 0";
                break;
              case 1:
                return "increment 1";
                break;
              default:
                return "C"+value;
            }
          },
          maximumValue:15,
          minimumValue:0,
        },
      });
      var bpm=selectors.timeConfig.options[0];
      var interval=selectors.timeConfig.options[1];
      var destination=selectors.timeConfig.options[2];
      var messageHeader=selectors.timeConfig.options[3];

      // messageHeader.bindValueWith(,0);
      messageHeader.valueChangeFunction=function(absolute,delta){
        if(clocks[currentlySelectedClock]){
          var absolute=absolute||messageHeader.value+delta;
          messageHeader.value=clocks[currentlySelectedClock].event.value[0]=absolute;
          if(shiftPressed){
          }else{
          }
        }else{
          environment.hardware.sendScreenB("select a clock");
        }
      }
      interval.valueChangeFunction=function(absolute,delta){
        if(clocks[currentlySelectedClock]){
          //an absolute may not be provided whilst is what we are using
          // console.log(absolute," ",delta);
          var absolute=absolute||interval.value+delta;
          interval.value=clocks[currentlySelectedClock].interval(absolute);
          // updateModifierValuesToSelectedClock();
          if(shiftPressed){
          }else{
          }
        }else{
          environment.hardware.sendScreenB("select a clock");
        }
      }
      bpm.valueChangeFunction=function(absolute,delta){
        if(clocks[currentlySelectedClock]){
          if(!delta) delta=absolute-loopFold.value;
          if(shiftPressed){
            if((delta<0&&bpm.multiplier>1)||delta>0){
              bpm.multiplier+=delta;
              bpm.subValue=clocks[currentlySelectedClock].bpm()/bpm.multiplier;
            }
          }else{
            if((delta<0&&bpm.subValue>1)||delta>0){
              bpm.subValue+=delta;
              bpm.value=clocks[currentlySelectedClock].bpm(bpm.subValue*bpm.multiplier);
            }
            // updateModifierValuesToSelectedClock();
          }
        }else{
          environment.hardware.sendScreenB("select a clock");
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
          messageHeader.value=clocks[currentlySelectedClock].event.value[0];
          interval.value=clocks[currentlySelectedClock].interval();
          bpm.value=clocks[currentlySelectedClock].bpm();
          bpm.subValue=clocks[currentlySelectedClock].bpm()/bpm.multiplier;
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
        updateHardware();
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
                var newClock=controlledModule.addClock()//);
                newClock.on('tick',function(){
                  clockTicked(evt.indexNumber);
                });
                currentlySelectedClock=evt.data[0];
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
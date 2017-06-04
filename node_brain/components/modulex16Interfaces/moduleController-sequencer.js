'use strict';
var base=require('./interactionModeBase');
var eventMessage=require('../../datatype-eventMessage');

/*
pendant: There should be a way to select many events and change a param to all
at once. perhaps by pressing shift one starts selecting, and if dimension parameter
changes while shift held, all selected or all events get the new value...

*/

/*
pendant: perhaps all modules should have a single destination?
*/
module.exports=function(environment){
  return new(function(){
    this.instance=function(controlledModule){
      // this.testname="sequencerController";
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
      selectors.timeConfig=require('./submode-2dConfigurator');

      base.call(this);

      var engaged=false;
      var shiftPressed=false;



    //console.log(selectors);
      for(var a in selectors){
    //console.log("init subs "+a);
        selectors[a]=selectors[a](environment);
      }

      selectors.timeConfig.initOptions({
        'look loop':{
          value:0,
          getValueName:function(a){ if(a==0) return "off"; return "%"+a },
          maximumValue:256,
          minimumValue:0,
        },
        'look page':{
          getValueName:function(a){ return a },
          maximumValue:(256/16),
        },
        'loop length':{
          value:16,
          getValueName:function(a){ return a },
          maximumValue:256,
          minimumValue:1,
        },
        'fold!':{//duplicate/ divide length
          value:4,
          getValueName:function(a){ return a },
          maximumValue:9,
          minimumValue:0,
        },
        'fold ':{
          value:4,
          getValueName:function(a){ return a },
          maximumValue:9,
          minimumValue:0,
        },
        'loop displace':{
          value:0,
          getValueName:function(a){ if(a>0){ return "+"+a }else{ return a } },
          maximumValue:4,
          minimumValue:-4,
        },
        'step length':{
          value:12,
          getValueName:function(a){ return a },
          maximumValue:16*12,
          minimumValue:1,
        },
        'master clock':{
          value:1,
          getValueName:function(a){ if(a){ return "synced" }else{ return "independent" } },
          maximumValue:16*12,
          minimumValue:1,
        }
      });

      var lookLoop=selectors.timeConfig.options[0];
      var selectedPage=selectors.timeConfig.options[1];
      var loopLength=selectors.timeConfig.options[2];
      var loopFold=selectors.timeConfig.options[3];
      var loopUndestructiveFold=selectors.timeConfig.options[4];
      var loopDisplace=selectors.timeConfig.options[5];
      var stepLength=selectors.timeConfig.options[6];
      var masterClockSync=selectors.timeConfig.options[7];
      loopLength.bindValueWith(controlledModule,"loopLength");
      loopFold.base=2;
      loopFold.getValueName=loopUndestructiveFold.getValueName=function(a){
        return loopFold.base+"^"+loopFold.value+"="+loopLength.value;
      }
      loopFold.valueChangeFunction=function(absolute,delta){
        if(!delta) delta=absolute-loopFold.value;
        //if(!absolute) absolute=loopFold.value+delta;
        var oldLength=loopLength.value;
        if(shiftPressed){
          loopFold.base+=delta;
          loopLength.value=Math.pow(loopFold.base,loopFold.value);
        }else{
          loopFold.value+=delta;
          loopLength.value=Math.pow(loopFold.base,loopFold.value);
        }
        duplicateSequence(0,oldLength,loopLength.value/oldLength);
      }
      loopUndestructiveFold.valueChangeFunction=function(absolute,delta){
        if(!delta) delta=absolute-loopFold.value;
        //if(!absolute) absolute=loopFold.value+delta;
        var oldLength=loopLength.value;
        if(shiftPressed){
          loopFold.base+=delta;
          loopLength.value=Math.pow(loopFold.base,loopFold.value);
        }else{
          loopFold.value+=delta;
          loopLength.value=Math.pow(loopFold.base,loopFold.value);
        }
      }
      var noteLengthner=new(function(){
        var notesInCreation=[];
        var stepCounter=0;
        this.startAdding=function(button,newStepEv){
          if(!newStepEv.stepLength){
            newStepEv.stepLength=1;
          }
          eachFold(button,function(step){
            var added=controlledModule.storeNoDup(step,newStepEv);
            if(added) notesInCreation[button]={sequencerEvent:added,started:stepCounter};
          });
        }
        this.finishAdding=function(button){
          if(notesInCreation[button])
            notesInCreation[button].sequencerEvent.stepLength=stepCounter-notesInCreation[button].started;
        }
      })();

      var lastsubSelectorEngaged=0;
      var subSelectorEngaged=false;

      var currentSelector=0;

        controlledModule.on('receiveEvent',updateLeds);

      //some events run regardless of engagement. in these cases, the screen refresh is conditional

      var focusedFilter=new selectors.dimension.Filter({destination:true,header:true,value_a:true});
      var bluredFilter=new selectors.dimension.Filter({destination:true,header:true});
      var moreBluredFilter=new selectors.dimension.Filter({destination:true});
      function updateLeds(){
        //actually should display also according to the currently being tweaked

        var mostImportant=getBitmapx16(shiftPressed?moreBluredFilter:focusedFilter,lastsubSelectorEngaged=="timeConfig");
        var mediumImportant=getBitmapx16(moreBluredFilter,lastsubSelectorEngaged=="timeConfig");
        var leastImportant=getBitmapx16(bluredFilter);//red, apparently




        var drawStep=0;
        var playHeadBmp=0;
        //"render" play header:
        //if we are in modulus view, it renders many playheads
        if(lastsubSelectorEngaged=="timeConfig"){
          drawStep=controlledModule.currentStep%(lookLoop.value||loopLength.value);
          var stepFolds=Math.ceil(loopLength.value/(lookLoop.value||loopLength.value));
          for(var a=0; a<stepFolds;a++){
            playHeadBmp|=0x1<<drawStep+a*(lookLoop.value||loopLength.value);
          }
          playHeadBmp&=0xFFFF;
        }else{
          //otherwise, normal one header
          drawStep=controlledModule.currentStep%loopLength.value;
          var playHeadBmp=0x1<<drawStep;
        }

        environment.hardware.draw([
            playHeadBmp^  mostImportant,
            playHeadBmp|  mostImportant|  mediumImportant,
          (               mostImportant)| mediumImportant|  leastImportant,
        ]);
      }

      this.engage=function(){
        environment.hardware.sendScreenA("Sequencer mode");
        engaged=true;
        updateLeds();
      }
      this.disengage=function(){
        engaged=false;
      }
      this.eventResponses.buttonMatrixPressed=function(evt){
        if(subSelectorEngaged===false){
          var button=evt.data[0];
          var currentFilter=shiftPressed?moreBluredFilter:focusedFilter;
          var throughfold=getThroughfoldBoolean(button,currentFilter);

          //if shift is pressed, there is only one repetition throughfold required, making the edition more prone to delete.
          if(shiftPressed){ if(throughfold!==true) throughfold=throughfold>0; }else{ throughfold=throughfold===true; }
          // console.log(throughfold);
          if(throughfold){
            //there is an event on every fold of the lookloop
            eachFold(button,function(step){
              controlledModule.clearStepByFilter(step,currentFilter)
            });
          }/*else if(trhoughFold>0){
            //there is an event on some folds of the lookloop
            var newStepEv=selectors.dimension.getSeqEvent();
            eachFold(button,function(step){
              store(step,newStepEv);
            });
          }*/else{
            //on every repetition is empty
            noteLengthner.startAdding(button,selectors.dimension.getSeqEvent());
          }
          updateLeds();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.buttonMatrixReleased=function(evt){
        noteLengthner.finishAdding(evt.data[0],selectors.dimension.getSeqEvent());
        if(subSelectorEngaged===false){
          updateLeds();
        }else{
          selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
        }
      }
      this.eventResponses.encoderScroll=function(evt){
        if(selectors[lastsubSelectorEngaged])
        selectors[lastsubSelectorEngaged].eventResponses.encoderScroll(evt);
        // if(subSelectorEngaged===false){
        //   environment.hardware.sendScreenB(String.fromCharCode(evt.data[0])+"-"+evt.data[0]);
        // }else{
        // }
      }
      this.eventResponses.encoderPressed=function(evt){
        /*/
        while held, the matrix becomes a pad, in each pad it is assigned one of the
        options within the current parameter being tweaked, and on pressed it previews it
        and also it selects it.

        if shift+encoder+one matrix button is pressed it lists all the events in that step
        or perhaps explodes that single step in the whole matrix, allowing detailed change
        to a step

        */
      }
      this.eventResponses.selectorButtonPressed=function(evt){
        if(evt.data[0]==1){
          subSelectorEngaged='dimension';
          lastsubSelectorEngaged='dimension';
          selectors.dimension.engage();
        }else if(evt.data[0]==2){
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
          selectors.dimension.disengage();
        }else if(evt.data[0]==2){
          subSelectorEngaged=false;
          selectors.timeConfig.disengage();
        }else if(evt.data[0]==3){
          shiftPressed=false;
        }

      }

      //modular pattern editing functions

      function eachFold(button,callback){
        var len=loopLength.value;
        var look=lookLoop.value||len;
        button%=look;
        //how many repetitions of the lookloop are represented under this button?
        var stepFolds;
        if(len%look>button){
          stepFolds=Math.ceil(len/look);
        }else{
          stepFolds=Math.floor(len/look);
        }
        // console.log("start check folds:"+stepFolds+" len:"+len+" look:"+look);
        for(var foldNumber=0; foldNumber<stepFolds; foldNumber++){
          callback((look*foldNumber)+button);
        }
        return {stepFolds:stepFolds}
      }

      //does the event under the button repeat througout all the repetitions of lookLoop?
      var getThroughfoldBoolean=function(button,filterFunction){
        var ret=0;
        var stepFolds=eachFold(button,function(step){
          if(controlledModule.patData[step])
            if(typeof filterFunction==="function"){
              //yes, every step is an array
              for(var stepData of controlledModule.patData[step]){
                if(filterFunction(stepData)) ret ++;
              }
            }else{
              // console.log("   check bt"+step);
              for(var stepData of controlledModule.patData[step]){
                if(controlledModule.patData[step]||false) ret ++;
              }
            }
        }).stepFolds;
        //if the step was repeated throughout all the folds, the return is true.
        if(ret>=stepFolds) ret=true; //ret can be higher than twofold because each step can hold any n of events
        // console.log("ret is "+ret);
        return ret;
      };

      var getBitmapx16=function(filter, requireAllFold){
        var ret=0x0000;
        if(requireAllFold){
          for(var button=0; button<16;button++)
            if(getThroughfoldBoolean(button,filter)===requireAllFold) ret|=0x1<<button;
        }else{
          if(filter){
            for(var button=0; button<16;button++)
              if(controlledModule.patData[button])
                for(var stepData of controlledModule.patData[button])
                  if(filter(stepData)){
                    ret|=0x1<<button;
                  }
          }else{
            for(var button=0; button<16;button++)
              if(controlledModule.patData[button])
                for(var stepData of controlledModule.patData[button])
                  if(stepData){
                    ret|=0x1<<button;
                  }
          }
        }
        // console.log(">"+ret.toString(16));
        return ret;
      }

    }
  })();
};
'use strict';
var base=require('./interactionModeBase');
var eventMessage=require('../../datatype-eventMessage');
var patternEvent=require('../../datatype-patternEvent');
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
      var currentStep=controlledModule.currentStep;
      // this.testname="sequencerController";
      var selectors={};
      selectors.dimension=require('./submode-dimensionSelector');
      selectors.timeConfig=require('./submode-2dConfigurator');

      base.call(this);
      //when skipMode is true, the sequencer jumps into any step that is pressed int he matrix
      var skipMode=false;

      var engaged=false;
      var shiftPressed=false;

//TODO: sequencer should have a recorder
//TODO: warp seuquencer events+compensate with displacement

    //console.log(selectors);
      for(var a in selectors){
    //console.log("init subs "+a);
        selectors[a]=selectors[a](environment);
      }
      selectors.dimension.dangerName(controlledModule.name);
      var receiveSourcesNames=environment.patcher.getSourcesList();



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
          value:controlledModule.loopLength.value,
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
          maximumValue:32,
          minimumValue:-32,
        },
        'restart':{
          value:0,
          getValueName:function(a){ return "press" },
          maximumValue:1,
          minimumValue:0,
        },
        'step div':{
          value:controlledModule.stepDivide.value,
          getValueName:function(a){ return a },
          maximumValue:16*12,
          minimumValue:1,
        },
        'clock':{
          value:0,
          getValueName:function(value){
          },
          maximumValue:1,
          minimumValue:-1,
        }
      });

      var cc=0;
      var lookLoop=selectors.timeConfig.options[cc];
      cc++;
      var selectedPage=selectors.timeConfig.options[cc];
      cc++;
      var loopLength=selectors.timeConfig.options[cc];
      cc++;
      var loopFold=selectors.timeConfig.options[cc];
      cc++;
      var loopUndestructiveFold=selectors.timeConfig.options[cc];
      cc++;
      var loopDisplace=selectors.timeConfig.options[cc];
      cc++;
      // var loopRestart=selectors.timeConfig.option[cc6]
      // cc++;
      var stepDivide=selectors.timeConfig.options[cc];
      cc++;
      var clockSourceSelection=selectors.timeConfig.options[cc];
      cc++;



      //get initial value of the clock source from my controlled sequencer, it could have been loaded from json

      if(controlledModule.getClockSource()){
        /**/console.log("sequencer: controller: set clock source");
        clockSourceSelection.value=receiveSourcesNames.indexOf(controlledModule.getClockSource());
      }else {
        /**/console.log("sequencer: controller: sequencer has no clock source");
        clockSourceSelection.value=-1;
      }
      clockSourceSelection.getValueName=function(value){
        if(value==-1) return "no";
        // TODO: measureing receivesources length versus all patches length is not the intended
        if(receiveSourcesNames.length!==environment.patcher.modules.length){
          receiveSourcesNames=environment.patcher.getSourcesList();
          clockSourceSelection.maximumValue=receiveSourcesNames.length-1;
        }
        return receiveSourcesNames[value];
      }
      clockSourceSelection.valueChangeFunction=function(absolute,delta){
        if(!absolute) absolute=clockSourceSelection.value+delta;
        if(absolute>=clockSourceSelection.minimumValue)
        if(absolute<=clockSourceSelection.maximumValue){
          clockSourceSelection.value=absolute;
          if(absolute>-1){
            controlledModule.updateClockSource(receiveSourcesNames[clockSourceSelection.value]);
          }else{
            controlledModule.disableClockSource();
          }
        }
      }
      loopLength.bindValueWith(controlledModule.loopLength,"value");
      loopDisplace.bindValueWith(controlledModule.loopDisplace,"value");
      stepDivide.bindValueWith(controlledModule.stepDivide,"value");
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
        controlledModule.duplicateSequence(0,oldLength,loopLength.value/oldLength);
        controlledModule.loopLength.value=loopLength.value;
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
        controlledModule.loopLength.value=loopLength.value;
      }


      // TODO: differenciating events in process of add was enough for the sequencer
      //interface, but no longer enough for recording (two recorded events may have started
      //at the same time
      var noteLengthner=new(function(){
        var thisNoteLengthner=this;
        this.startPointsBitmap=0x0;
        this.lengthsBitmap=0x0;
        var notesInCreation=[];
        //count of notes in creation
        var nicCount=0;
        var stepCounter=0;
        this.startAdding=function(differenciator,newStepEv){
          // console.log("startadding("+differenciator+"...");
          if(!newStepEv.stepLength){
            newStepEv.stepLength=1;
          }
          notesInCreation[differenciator]={sequencerEvent:newStepEv,started:stepCounter};
          thisNoteLengthner.startPointsBitmap|=0x1<<differenciator;
          thisNoteLengthner.lengthsBitmap=thisNoteLengthner.startPointsBitmap;
          nicCount++;
          // console.log(notesInCreation[differenciator]);
        }
        this.finishAdding=function(differenciator){
          if(notesInCreation[differenciator]){
            notesInCreation[differenciator].sequencerEvent.stepLength=stepCounter-notesInCreation[differenciator].started;
            eachFold(differenciator,function(step){
              /*var added=*/controlledModule.storeNoDup(step,notesInCreation[differenciator].sequencerEvent);
            });
            // console.log(notesInCreation[differenciator]);
            delete notesInCreation[differenciator];
            nicCount--;
            if(nicCount==0){
              thisNoteLengthner.startPointsBitmap=0;
              thisNoteLengthner.lengthsBitmap=0;
            }
          }
        }
        this.stepCount=function(){
          stepCounter++;
          if(nicCount>0){
            thisNoteLengthner.lengthsBitmap|=thisNoteLengthner.lengthsBitmap<<1;
            thisNoteLengthner.lengthsBitmap|=thisNoteLengthner.lengthsBitmap>>16;
          }
        }
      })();

      var lastRecordedNote=false;
      //recording into the sequencer
      var recorderDifferenciatorList={};
      this.recordNoteStart=function(differenciator,stepOn){
        // console.log("recordNoteStart",differenciator,stepOn);
        if(stepOn){
          // console.log("rec rec");
          var newStepEvent=new patternEvent({
            on:stepOn,
            off:new eventMessage(stepOn)
          });
          lastRecordedNote=newStepEvent;
          newStepEvent.off.value[2]=0;
          recorderDifferenciatorList[differenciator]=currentStep.value;
          //recording is destructively quantized. here we apply a filter that forgives early notes
          if(controlledModule.microStep.value<6)recorderDifferenciatorList[differenciator]--;
          noteLengthner.startAdding(recorderDifferenciatorList[differenciator],newStepEvent);
        }
      }
      this.recordNoteEnd=function(differenciator){
        console.log("noteEnd",differenciator);
        noteLengthner.finishAdding(recorderDifferenciatorList[differenciator]);
      }

      //ui feedback
      var lastsubSelectorEngaged=0;
      var subSelectorEngaged=false;

      var currentSelector=0;

        // controlledModule.on('receiveEvent',updateLeds);

      //some events run regardless of engagement. in these cases, the screen refresh is conditional

      var focusedFilter=new selectors.dimension.Filter({destination:true,header:true,value_a:true});
      var bluredFilter=new selectors.dimension.Filter({destination:true,header:true});
      var moreBluredFilter=new selectors.dimension.Filter({destination:true});
      function updateLeds(){
        //actually should display also according to the currently being tweaked
        var showThroughfold=lastsubSelectorEngaged=="timeConfig";
        var mostImportant=getBitmapx16(shiftPressed?moreBluredFilter:focusedFilter,showThroughfold);
        var mediumImportant=getBitmapx16(moreBluredFilter,showThroughfold);
        mediumImportant|=noteLengthner.startPointsBitmap;
        var leastImportant=getBitmapx16(bluredFilter,false,!shiftPressed);//red, apparently
        leastImportant|=noteLengthner.lengthsBitmap;
        var drawStep=0;
        var playHeadBmp=0;
        //"render" play header:
        //if we are in modulus view, it renders many playheads
        if(lastsubSelectorEngaged=="timeConfig"){
          drawStep=currentStep.value%(lookLoop.value||loopLength.value);
          var stepFolds=Math.ceil(loopLength.value/(lookLoop.value||loopLength.value));
          for(var a=0; a<stepFolds;a++){
            playHeadBmp|=0x1<<drawStep+a*(lookLoop.value||loopLength.value);
          }
          playHeadBmp&=0xFFFF;
        }else{
          //otherwise, normal one header
          drawStep=currentStep.value%loopLength.value;
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
        //when you record from a preset kit, and then search the Sequencer
        //it can get really hard to find the sequencer if they don't show the
        //recording by defaut
        if(lastRecordedNote){
          // console.log("lastRecordedNote",lastRecordedNote);
          //this will update the output list in the sequencer, otherwise it may have a value out of array
          selectors.dimension.options[0].valueNames(0);
          selectors.dimension.setFromSeqEvent(lastRecordedNote);
          lastRecordedNote=false;
        }
        engaged=true;
        updateLeds();
      }
      this.disengage=function(){
        engaged=false;
      }
      this.eventResponses.buttonMatrixPressed=function(evt){
        // console.log(evt.data);
        if(skipMode){
          controlledModule.restart(evt.data[0]);
        }else if(subSelectorEngaged===false){
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
      var selectorsPressed={};
      this.eventResponses.selectorButtonPressed=function(evt){
        // console.log(evt);
        //keep trak of pressed buttons for button combinations
        selectorsPressed[evt.data[0]]=true;
        if(selectorsPressed[2]&&selectorsPressed[3]){
          if(lastsubSelectorEngaged)
          selectors[lastsubSelectorEngaged].disengage();
          lastsubSelectorEngaged=false;
          skipMode=true;
          environment.hardware.sendScreenA("skip to step");
          updateLeds();
        }else if(evt.data[0]==1){
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
        if(subSelectorEngaged)
        selectors[subSelectorEngaged].eventResponses.selectorButtonPressed(evt);
      }
      this.eventResponses.selectorButtonReleased=function(evt){
        selectorsPressed[evt.data[0]]=false;
        skipMode=false;
        if(subSelectorEngaged)
        selectors[subSelectorEngaged].eventResponses.selectorButtonReleased(evt);
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
      //sequencer events handler
      controlledModule.on('step',function(evt){
        if(engaged){
          if(subSelectorEngaged===false)
          updateLeds();//, console.log("step"+currentStep);
          if(lastsubSelectorEngaged==="timeConfig"){
            selectors.timeConfig.updateLcd();
          }
        }
        noteLengthner.stepCount();
        loopDisplace.value=controlledModule.loopDisplace.value;
      });

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

      var getBitmapx16=function(filter, requireAllFold,representLength){
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
                  /*  if(representLength){
                      ret|=~(0xffff<<stepData.stepLength)<<button;
                      // console.log("*-l",stepData.stepLength);
                    }else{*/
                      ret|=0x1<<button;
                  /*  }*/
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
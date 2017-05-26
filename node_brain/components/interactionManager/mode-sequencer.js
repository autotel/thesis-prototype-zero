'use strict';
var base=require('./interactionModeBase');

/*
pendant: it gets quite hard to understand what are the roles of
the color hierarchy should be based on the lastsubSelectorEngaged,
if it was the timeConfig, the main color is given to the modularly repeated
if it was the dimension, the main color is given to the ones of the same option*/

module.exports=function(environment){
  var selectors={};
  selectors.dimension=require('./submode-dimensionSelector');
  selectors.timeConfig=require('./submode-2dConfigurator');
  //pendant: the sequencer functionality should be in the destinations folder,
  //as to separate the functionality (which can receive events) from the interaction
  var sequencer=require('../destinations/sequencer');

  return new(function(){

    base.call(this);
    var tPattern=this;
    var patData={};
    var currentStep=0;
    var engaged=false;
    var shiftPressed=false;
    var currentModulus=16;


    var Notes=new(function(){
      this.noteBuffer=[];
      this.startAdding=function(button,newStepEv){
        if(!note.stepLength){
          note.stepLength=1;
        }
        eachFold(button,function(step){
          storeNoDup(step,newStepEv);
        });
      }
      this.finishAdding=function(button){}
      this.step=function(){
        // for(var a in noteBuffer){
        //   noteBuffer[a].stepLength++;
        // }
      }
    })();

  //console.log(selectors);
    for(var a in selectors){
  //console.log("init subs "+a);
      selectors[a]=selectors[a](environment);
    }

    selectors.timeConfig.initOptions({
      'look loop':{
        value:4,
        getValueName:function(a){ return "%"+a },
        maximumValue:256,
        minimumValue:1,
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
      'loop fold':{//duplicate/ divide length
        value:16,
        getValueName:function(a){ return a },
        maximumValue:16,
        minimumValue:1,
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
    });

    var lookLoop=selectors.timeConfig.options[0];
    var selectedPage=selectors.timeConfig.options[1];
    var loopLength=selectors.timeConfig.options[2];
    var loopDisplace=selectors.timeConfig.options[3];
    var stepLength=selectors.timeConfig.options[4];
    // console.log(":)",loopLength);
    var lastsubSelectorEngaged=0;
    var subSelectorEngaged=false;

    // var currentDimension=0;

    // var selectors=['dimension','value','modulus'];
    var currentSelector=0;

    this.init=function(){
      environment.metronome.on('step',step);
    }
    // environment.patcher.destinations.sequencer=this;

  //   this.receiveEvent=function(event){
  // //console.log("not implemented yet");
  //   }
    var store=function(step,data){
      if(!patData[step]) patData[step]=[];
      if(data){
        patData[step].push(data);
      }
    }
    var storeNoDup=function(step,data){
      if(!patData[step]) patData[step]=[];
      if(data){
        var cancel=false;
        for(var a in patData[step]){
          if(patData[step][a].compareTo(data,['destination','value'])){
            cancel=true;
            break;
          }
        }
        if(!cancel)
          patData[step].push(data);
      }
    }
    var clearStepNewest=function(step){
      patData[step].pop();
    }
    var clearStepOldest=function(step){
      patData[step].shift();
    }
    var clearStep=function(step){
      delete patData[step];
    }
    var clearStepByFilter=function(step,filterFunction){
      if(patData[step])
        if(typeof filterFunction==="function"){
          for(var sEvt in patData[step]){
            if(filterFunction(patData[step][sEvt])){
              patData[step].splice(sEvt,1);
              return true;
            }
          }
          return false;
        }
      return false;
    }
    var getBoolean=function(step,filterFunction){
      if(patData[step])
        if(typeof filterFunction==="function"){
          //yes, every step is an array
          for(var stepData of patData[step]){
            if(filterFunction(stepData))
              return true;
            return false;
          }
        }else{
          for(var stepData of patData[step]){
            if(patData[step]||false)
              return true;
            return false;
          }
        }
      return false;
    };

    function eachFold(button,callback){
      var len=loopLength.value;
      var look=lookLoop.value;
      button%=lookLoop.value;
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
        if(patData[step])
          if(typeof filterFunction==="function"){
            // console.log("   check bt"+step);
            //yes, every step is an array
            for(var stepData of patData[step]){
              if(filterFunction(stepData)) ret ++;
            }
          }else{
            // console.log("   check bt"+step);
            for(var stepData of patData[step]){
              if(patData[step]||false) ret ++;
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
            if(patData[button])
              for(var stepData of patData[button])
                if(filter(stepData)){
                  ret|=0x1<<button;
                }
        }else{
          for(var button=0; button<16;button++)
            if(patData[button])
              for(var stepData of patData[button])
                if(stepData){
                  ret|=0x1<<button;
                }
        }
      }
      // console.log(">"+ret.toString(16));
      return ret;
    }

    //some events run regardless of engagement. in these cases, the screen refresh is conditional
    function step(evt){

      currentStep++;
      currentStep+=loopDisplace.value;
      loopDisplace.value=0;
      if(currentStep>=loopLength.value) currentStep%=loopLength.value;
      if(currentStep<0) currentStep%=loopLength.value;


      if(getBoolean(currentStep)){
        for(var stepData of patData[currentStep]){
          // if(stepData.destination=="midi"){
          // }else if(stepData.destination=="midi"){
            // var val=stepData.value;
            environment.patcher.receiveEvent(stepData);
            noteOffr.append(stepData);
          // }else
        }
      }

      if(engaged){
        if(subSelectorEngaged===false)
        updateLeds();//, console.log("step"+currentStep);
        if(lastsubSelectorEngaged==="timeConfig"){
          selectors.timeConfig.updateLcd();
        }
      }
    }
    var focusedFilter=new selectors.dimension.Filter({destination:true,header:true,value_a:true});
    var bluredFilter=new selectors.dimension.Filter({destination:true,header:true});
    var moreBluredFilter=new selectors.dimension.Filter({destination:true});
    function updateLeds(){
      //actually should display also according to the currently being tweaked

      var mostImportant=getBitmapx16(shiftPressed?moreBluredFilter:focusedFilter,lastsubSelectorEngaged=="timeConfig");
      var mediumImportant=getBitmapx16(moreBluredFilter,lastsubSelectorEngaged=="timeConfig");
      var leastImportant=getBitmapx16(bluredFilter);//red, apparently




      var playHeadBmp=0;
      //draw multi playheads to represent the lookLoop
      var drawStep=currentStep%lookLoop.value;
      var stepFolds=Math.ceil(loopLength.value/lookLoop.value);

      for(var a=0; a<stepFolds;a++){
        playHeadBmp|=0x1<<drawStep+a*lookLoop.value;
      }
      playHeadBmp&=0xFFFF;

      environment.hardware.draw([
                        mostImportant,
          playHeadBmp|  mostImportant|  mediumImportant,
        ( playHeadBmp^  mostImportant)| mediumImportant|  leastImportant,
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
        console.log(throughfold);
        if(throughfold){
          //there is an event on every fold of the lookloop
          eachFold(button,function(step){
            clearStepByFilter(step,currentFilter)
          });
        }/*else if(trhoughFold>0){
          //there is an event on some folds of the lookloop
          var newStepEv=selectors.dimension.getSeqEvent();
          eachFold(button,function(step){
            store(step,newStepEv);
          });
        }*/else{
          //on every repetition is empty
          Notes.startAdding(button,selectors.dimension.getSeqEvent());
        }
        updateLeds();
      }else{
        selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
      }
    }
    this.eventResponses.buttonMatrixReleased=function(evt){
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
    return this;
})()};
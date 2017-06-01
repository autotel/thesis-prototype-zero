'use strict';
var base=require('./interactionModeBase');
var eventMessage=require('../../datatype-eventMessage');

/*
pendant: There should be a way to select many events and change a param to all
at once. perhaps by pressing shift one starts selecting, and if dimension parameter
changes while shift held, all selected or all events get the new value...

*/



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


    var NoteLenManager=new(function(){
      var notesInCreation=[];
      var notesInPlay=[];
      var stepCounter=0;
      this.startAdding=function(button,newStepEv){
        if(!newStepEv.stepLength){
          newStepEv.stepLength=1;
        }
        eachFold(button,function(step){
          var added=storeNoDup(step,newStepEv);
          if(added) notesInCreation[button]={sequencerEvent:added,started:stepCounter};
        });
      }
      this.finishAdding=function(button){
        if(notesInCreation[button])
          notesInCreation[button].sequencerEvent.stepLength=stepCounter-notesInCreation[button].started;
      }
      this.noteStarted=function(stepEvent){
        if(!stepEvent.stepLength)stepEvent.stepLength=1;
        notesInPlay.push({sequencerEvent:stepEvent,offInStep:stepCounter+stepEvent.stepLength});
      }
      this.step=function(){
        for(var a in notesInPlay){
          if(notesInPlay[a].offInStep==stepCounter){
            // console.log("a:"+a);
            // console.log(notesInPlay[a]);
            environment.patcher.receiveEvent(notesInPlay[a].sequencerEvent.off);
            notesInPlay[a]=false;
          }
        }
        //splicing requires backward iteration
        var a=notesInPlay.length;
        while(a>0){
          if(notesInPlay[a]===false)
            notesInPlay.splice(a,1);
          a--;
        }
        stepCounter++;
      }
    })();

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
      }
    });

    var lookLoop=selectors.timeConfig.options[0];
    var selectedPage=selectors.timeConfig.options[1];
    var loopLength=selectors.timeConfig.options[2];
    var loopFold=selectors.timeConfig.options[3];
    var loopUndestructiveFold=selectors.timeConfig.options[4];
    var loopDisplace=selectors.timeConfig.options[5];
    var stepLength=selectors.timeConfig.options[6];

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
        return data;
      }
    }
    var storeNoDup=function(step,data){
      var ret=false;
      if(!patData[step]) patData[step]=[];
      if(data){
        var cancel=false;
        for(var a in patData[step]){
          if(patData[step][a].on.compareTo(data.on,['destination','value'])){
            cancel=true;
            break;
          }
        }
        if(!cancel){
          patData[step].push(data); return data;
        }
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
        if(patData[step])
          if(typeof filterFunction==="function"){
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
    var clearStepRange=function(from,to){
      for(var step=to; step>from; step--){
        //maybe this iteration is unnecesary?
        for(var a in patData[step]){
          delete patData[step][a];
        }
        delete patData[step];
      }
    }
    var duplicateSequence=function(startingStep,originalEndingStep,multiplyFactor){
      var initialStepSize=originalEndingStep-startingStep;
      if(multiplyFactor>1){
        clearStepRange(originalEndingStep+1,initialStepSize*(multiplyFactor-1));
        //starts in 1 because the 0 is the currently existing one
        for(var duplicationNumber=1; duplicationNumber<multiplyFactor; duplicationNumber++){
          for(var step=startingStep; step<originalEndingStep; step++){
            // var testc=0;
            if(patData[step])
            for(var a=0; a<patData[step].length; a++){
              // testc++;
              var targetStep=(initialStepSize*duplicationNumber)+step;
              // console.log(duplicationNumber,step,testc,targetStep);
              if(!patData[targetStep]) patData[targetStep]=[];
              patData[targetStep].push(new eventMessage(patData[step][a]));
            }
          }
        }
      }else{
        clearStepRange(startingStep,originalEndingStep*multiplyFactor);
      }
    }

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

      NoteLenManager.step();

      if(getBoolean(currentStep)){
        for(var stepData of patData[currentStep]){
          // if(stepData.destination=="midi"){
          // }else if(stepData.destination=="midi"){
            // var val=stepData.value;
            environment.patcher.receiveEvent(stepData.on);
            NoteLenManager.noteStarted(stepData);
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




      var drawStep=0;
      var playHeadBmp=0;
      //"render" play header:
      //if we are in modulus view, it renders many playheads
      if(lastsubSelectorEngaged=="timeConfig"){
        drawStep=currentStep%(lookLoop.value||loopLength.value);
        var stepFolds=Math.ceil(loopLength.value/(lookLoop.value||loopLength.value));
        for(var a=0; a<stepFolds;a++){
          playHeadBmp|=0x1<<drawStep+a*(lookLoop.value||loopLength.value);
        }
        playHeadBmp&=0xFFFF;
      }else{
        //otherwise, normal one header
        drawStep=currentStep%loopLength.value;
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
          NoteLenManager.startAdding(button,selectors.dimension.getSeqEvent());
        }
        updateLeds();
      }else{
        selectors[subSelectorEngaged].eventResponses.buttonMatrixPressed(evt);
      }
    }
    this.eventResponses.buttonMatrixReleased=function(evt){
      NoteLenManager.finishAdding(evt.data[0]);
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
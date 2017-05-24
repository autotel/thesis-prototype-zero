'use strict';
var base=require('./interactionModeBase');


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
    environment.patcher.destinations.sequencer=this;
    this.receiveEvent=function(){
  //console.log("not implemented yet");
    }
    var store=function(step,data){
      if(!patData[step]) patData[step]=[];
      if(data){
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
    var getBitmapx16=function(filter){
      var ret=0x0000;
      if(filter){
        for(var step=0; step<16;step++)
          if(patData[step])
            for(var stepData of patData[step])
              if(filter(stepData)){
                ret|=0x1<<step;
              }
      }else{
        for(var step=0; step<16;step++)
          if(patData[step])
            for(var stepData of patData[step])
              if(stepData){
                ret|=0x1<<step;
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

      if(engaged)
      if(subSelectorEngaged===false)
      updateLeds();

      if(getBoolean(currentStep)){
        for(var stepData of patData[currentStep]){
          // if(stepData.destination=="midi"){
          // }else if(stepData.destination=="midi"){
            // var val=stepData.value;
            environment.patcher.receiveEvent(stepData);
          // }else
        }
      }

      if(lastsubSelectorEngaged==="timeConfig"){
        selectors.timeConfig.updateLcd();
      }
    }
    var focusedFilter=new selectors.dimension.Filter({destination:true,header:true,value_a:true});
    var bluredFilter=new selectors.dimension.Filter({destination:true,header:true});
    var moreBluredFilter=new selectors.dimension.Filter({destination:true});
    function updateLeds(){
      //actually should display also according to the currently being tweaked

      var mostImportant=getBitmapx16(shiftPressed?moreBluredFilter:focusedFilter);

      // var mediumImportant=getBitmapx16(bluredFilter);
      var leastImportant=getBitmapx16(moreBluredFilter)
      var playHeadBmp=0x1<<currentStep;
      environment.hardware.draw([playHeadBmp,leastImportant|(playHeadBmp^mostImportant),playHeadBmp|mostImportant]);
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
        if(clearStepByFilter(evt.data[0],shiftPressed?moreBluredFilter:focusedFilter)){
        }else{
          // console.log(selectors.dimension);
          // console.log(selectors.dimension.getSeqEvent());
          store(evt.data[0],/*currentModulus,*/selectors.dimension.getSeqEvent());
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
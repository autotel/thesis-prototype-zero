module.exports=function(sequencerModule){ return new(function(){
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
  this.step=function(evt){
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
})();};
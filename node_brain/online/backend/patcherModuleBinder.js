'use strict';
var uniques=require('./idToObject.js');
var bindedModules=uniques.whoIs;

//utilities to make data tracking shorter and more standardized
//delta will be tweaked attaching only the data that changed, not all the data that already is
var bindprop=function(trackedData,node,from,trackedDataDelta){
  // console.log(node,"will be",from);
  var changed=from!=trackedData[node];
  // console.log(from+"!="+trackedData[node]);
  if(changed){ trackedData[node]=from; trackedDataDelta[node]=from }
  return changed;
}
var bindGetter=function(trackedData,node,getter,param,trackedDataDelta){
  var changed=got!=trackedData[node];
  var got=getter(param);
  if(changed) {trackedData[node]=got; trackedDataDelta[node]=got };
  return changed;
}

var bindArray=function(trackedData,node,array,subprop,trackedDataDelta){
  var changed=false;
  if(trackedData[node]===undefined) trackedData[node]=[];
  if(subprop){
    //get the created or changed data in the array
    for(var a in array){
      if(""+trackedData[node][a]!=""+array[a][subprop]){
        trackedData[node][a]=array[a][subprop];
        if(!trackedDataDelta[node]){  trackedDataDelta[node]={}; }
        trackedDataDelta[node][a]=array[a][subprop];
      }
    }
    //also get the data that is not anymore in the array
    for(var a in trackedData[node]){
      if(!array[a][subprop]){
        delete trackedData[node][a];
        if(!trackedDataDelta[node]){  trackedDataDelta[node]={}; }
        trackedDataDelta[node][a]=null;
      }
    }
  }else{
    //get the created or changed data in the array
    for(var a in array){
      if(""+trackedData[node][a]!=""+array[a]){
        // console.log(trackedData[node][a]+"!="+array[a]);
        trackedData[node][a]=array[a];
        if(!trackedDataDelta[node]){  trackedDataDelta[node]={}; }
        trackedDataDelta[node][a]=array[a];
      }
    }
    //also get the data that is not anymore in the array
    for(var a in trackedData[node]){
      if(!array[a]){
        delete trackedData[node][a];
        if(!trackedDataDelta[node]){  trackedDataDelta[node]={}; }
        trackedDataDelta[node][a]=null;
      }
    }
    //i'm sure there is a more efficient way to this
  }
}
//functions that gather data from the monitored module specifically by type
//pendant: perhaps we only need multinodal and monoNodal functions
var dataTracker=function(type){
  switch (type) {
    case 'presetKit': return function(uniqueElement){
      var who=uniqueElement.original;
      var trackedData=uniqueElement.trackedData;
      var trackedDataDelta={};
      bindprop(trackedData,"name",who.name,trackedDataDelta);
      bindprop(trackedData,"subnodes",who.kit.length,trackedDataDelta);
      // console.log(who.kit);
      bindArray(trackedData,"subnodeDestinations",who.getEventDestinations(),false,trackedDataDelta);
      bindprop(uniqueElement,"type",uniqueElement.type,trackedDataDelta);
      for(var a in trackedDataDelta)
      if(trackedDataDelta[a]!==undefined)
        return trackedDataDelta;
      return false;
    }
    case 'sequencer': return function(uniqueElement){
      var who=uniqueElement.original;
      var trackedData=uniqueElement.trackedData;
      var trackedDataDelta={};
      bindprop(trackedData,"name",who.name,trackedDataDelta);
      bindprop(trackedData,"subnodes",who.loopLength.value,trackedDataDelta);
      // console.log(who.loopLength.value);
      bindArray(trackedData,"subnodeDestinations",who.getStepEventDestinations(),false,trackedDataDelta);
      // console.log(who.getStepEventDestinations());
      bindprop(uniqueElement,"type",uniqueElement.type,trackedDataDelta);
      for(var a in trackedDataDelta)
      if(trackedDataDelta[a]!==undefined)
        return trackedDataDelta;
      return false;
    }
    case 'clock': return function(uniqueElement){
      var who=uniqueElement.original;
      var trackedData=uniqueElement.trackedData;
      var trackedDataDelta={};
      bindprop(trackedData,"name",who.name,trackedDataDelta);
      bindprop(trackedData,"subnodes",who.clocks.length,trackedDataDelta);
      // console.log(who.loopLength.value);
      bindArray(trackedData,"subnodeDestinations",who.getClocksDestinations(),false,trackedDataDelta);
      // console.log(who.getClocksDestinations());
      bindprop(uniqueElement,"type",uniqueElement.type,trackedDataDelta);
      for(var a in trackedDataDelta)
      if(trackedDataDelta[a]!==undefined)
        return trackedDataDelta;
      return false;
    }
    break;
    default:
    return function(uniqueElement){
      return false;
    }
  }

}

module.exports=function(environment){
  //rename some intricate variables to locals
  var header=environment.server.messageIndexes;
  var myBroadcaster=environment.server.httpSocket;
  environment.patcher.on('modulecreated',function(ev){
    /**/console.log(ev);
    var newUnique=uniques.add(new(function(){
      this.original=ev.module;
      this.type=ev.type;
      var myDatatracker=dataTracker(ev.type);
      var thisUniqueElement=this;
      this.dataUpdate=function(){
        return myDatatracker(thisUniqueElement);
      }
      this.trackedData={
        type:ev.type,
        name:ev.name,
      };
    })());
    bindedModules[newUnique].trackedData.unique=newUnique;

    ev.module.on('messagesend',function(evtb){
      var pl={unique:newUnique};
      if(evtb.sub){
        pl.sub=evtb.sub;
      }else if(evtb.step){
        pl.sub=evtb.step;
      }
      myBroadcaster.broadcast(header.EVENT,pl);
    });

    var newUniqueElement=bindedModules[newUnique];
    newUniqueElement.dataUpdate();
    myBroadcaster.broadcast(header.CREATE,newUniqueElement.trackedData);
  });
  var checkInterval=setInterval(function(){
    for(var a in bindedModules){
      var emitData=bindedModules[a].dataUpdate();
      // console.log(emitData);
      if(emitData){
        emitData.unique=bindedModules[a].trackedData.unique;
        myBroadcaster.broadcast(header.CHANGE,emitData);
      }
    }
  },30);
  return new (function(){
    this.eachBindedUnique=function(callback){
      for(var a in bindedModules){
        if(bindedModules[a])
        callback(bindedModules[a].trackedData,a);
      }
    }
  })();
}
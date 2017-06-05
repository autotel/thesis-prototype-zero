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
    for(var a in array){
      if(trackedData[node][a]!=array[a][subprop]){
        trackedData[node][a]=array[a][subprop];
        if(!trackedDataDelta[node]){  trackedDataDelta[node]=[]; }
        trackedDataDelta[node][a]=array[a][subprop];
      }
    }
  }else{
    for(var a in array){
      if(""+trackedData[node][a]!=""+array[a]){
        console.log(trackedData[node][a]+"!="+array[a]);
        trackedData[node][a]=array[a];
        if(!trackedDataDelta[node]){  trackedDataDelta[node]=[]; }
        trackedDataDelta[node][a]=array[a];
      }
    }
  }
}
//functions that gather data from the monitored module specifically by type
var dataTracker=function(type){
  switch (type) {
    case 'presetKit': return function(uniqueElement){
      var who=uniqueElement.original;
      var trackedData=uniqueElement.trackedData;
      var trackedDataDelta={};
      bindprop(trackedData,"name",who.name,trackedDataDelta);
      bindprop(trackedData,"subnodes",who.kit.length,trackedDataDelta);
      bindArray(trackedData,"subnodeDestinations",who.kit,"destination",trackedDataDelta);
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
      bindprop(trackedData,"subnodes",who.loopLength,trackedDataDelta);
      bindArray(trackedData,"subnodeDestinations",who.getStepEventDestinations(),false,trackedDataDelta);
      // console.log(who.getStepEventDestinations());
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
  },700);
  return new (function(){
    this.eachBindedUnique=function(callback){
      for(var a in bindedModules){
        if(bindedModules[a])
        callback(bindedModules[a].trackedData,a);
      }
    }
  })();
}
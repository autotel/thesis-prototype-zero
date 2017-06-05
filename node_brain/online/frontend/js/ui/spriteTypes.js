var getMultiNodeSpriteBase=function(forceDirectedGrapher,spriteBase){
  return function(props){
    console.log("new Seq");
    var nodeList=[];
    spriteBase.call(this,props);
    nodeList.push(forceDirectedGrapher.addNode());
    var centerNode=nodeList[0];

    this.remove=function(){
      for(var a in this.nodeList){
        forceDirectedGrapher.removeNode(a);
      }
      forceDirectedGrapher.rebuild();
    }
    this.getNodeHandle=function(){
      return centerNode;
    }
    this.representEvent=function(event){}
    this.applyProperties=function(props){
      /*
      CHANGE Object {
      subnodes: 11,
      subnodeDestinations: Array[11],
      unique: 5 }
      */
      if(props.subnodes){
        //minus 1 because the center node is also in the list
        var noDelta=props.subnodes-nodeList.length+1;
        console.log(props.subnodes+"-"+(nodeList.length+1)+"="+noDelta);
        if(noDelta>0){
          for(var a=0; a<noDelta; a++){
            var nNodeHandle=forceDirectedGrapher.addNode();
            nodeList.push(nNodeHandle);
            forceDirectedGrapher.addLink(nNodeHandle,centerNode);
          }
          forceDirectedGrapher.rebuild();
        }else if(noDelta<0){
          for(var a=0; a>noDelta; a--){
            forceDirectedGrapher.removeNode(nodeList.pop(nNodeHandle));
          }
          forceDirectedGrapher.rebuild();
        }
      }
      if(props.subnodeDestinations){
        var snD=props.subnodeDestinations;
        for(var a in snD){
          var nNodeHandle=nodeList[a];
          var nodeHandleDestinations=[];
          //get the link handles for the node destinations that come in names
          //sequencers throw 2d arrays whilst kits 1d arrays. perhaps different in the future
          if(snD[a])
          if(snD[a].constructor === Array){
            for(var b in snD[a]){
              var targetSprite=Ui.spriteFromNames[snD[a][b]];
              console.log(targetSprite);
              nodeHandleDestinations.push(targetSprite.getNodeHandle());
            }
            forceDirectedGrapher.setLinksTo(nNodeHandle,nodeHandleDestinations);
          }else{
            var targetSprite=Ui.spriteFromNames[snD[a][b]];
            if(targetSprite)
              forceDirectedGrapher.addLink(nNodeHandle,targetSprite.getNodeHandle());
          }
        }
      }
    }
    this.applyProperties(props);
  }
}

Ui.addSpriteType("presetKit",function(forceDirectedGrapher,spriteBase){
  return getMultiNodeSpriteBase(forceDirectedGrapher,spriteBase);
});

Ui.addSpriteType("sequencer",function(forceDirectedGrapher,spriteBase){
  return getMultiNodeSpriteBase(forceDirectedGrapher,spriteBase);
});
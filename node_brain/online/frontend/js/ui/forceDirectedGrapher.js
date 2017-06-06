
//pendant: node returns array index as handle reference,
//but deletion does a splice, thus these indexes become
//outdated. Node hanlding should be differnet
var forceDirectedGrapher=new(function(){
  var thisGrapher=this;
  var width = window.innerWidth,
      height = window.innerHeight;

  var fill = d3.scale.category20();

  var force = d3.layout.force()
      .size([width, height])
      .nodes([{}]) // initialize with a single node
      .linkDistance(30)
      .charge(-60)
      .on("tick", tick);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", mousemove)
      .on("mousedown", mousedownCanvas);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  var nodes = force.nodes(),
      links = force.links(),
      node = svg.selectAll(".node"),
      link = svg.selectAll(".link");

  var cursor = svg.append("circle")
      .attr("r", 30)
      .attr("transform", "translate(-100,-100)")
      .attr("class", "cursor");

  restart();

  function mousemove() {
    cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
  }

  function mousedownCanvas() {
    // var point = d3.mouse(this),
    //     node = {x: point[0], y: point[1]},
    //     n = nodes.push(node);
    //
    // // add links to any nearby nodes
    // nodes.forEach(function(target) {
    //   var x = target.x - node.x,
    //       y = target.y - node.y;
    //   if (Math.sqrt(x * x + y * y) < 30) {
    //     links.push({source: node, target: target});
    //   }
    // });
    //
    // restart();
  }
  this.addLink=function(from,to){
    links.push({
      source: nodes[from],
      target: nodes[to]
    });
    restart();
  }
  this.setLinksTo=function(startNode,destList){
    //copy destlist to avoid changing original
    var dl=[];
    for(var a in destList){
      dl[a]=destList[a];
    }
    //check all the links that are already from startNode to any of destList,
    //remove the rest
    links = links.filter(function(l) {
      if(l.source == nodes[startNode]){
        var iof = dl.indexOf(l.target);
        if(iof == -1){
          return false;
        }else{
          dl.splice(iof,1);
        }
      }
      return true;
    });
    //add all the links that were not there
    for(var a in dl){
      thisGrapher.addLink(startNode,dl[a]);
    }
  }
  this.addNode=function(props){
    var n = nodes.push({});
    restart();
    var nodeReference=n-1;
    return nodeReference;
  }
  this.removeNode=function(nodeReference){
    var i=nodeReference;
    var d=nodes[nodeReference];
    nodes.splice(i, 1);
    links = links.filter(function(l) {
      return l.source !== d && l.target !== d;
    });
  }
  this.nodeHighlight=function(handler){
    if(nodes[handler].grasa<20)
    nodes[handler].grasa+=4;
    // console.log(nodes[handler]);
  }
  this.rebuild=restart;
  function mousedownNode(d, i) {
    d.grasa=33;
    console.log(i,d);
    // nodes.splice(i, 1);
    // links = links.filter(function(l) {
    //   return l.source !== d && l.target !== d;
    // });
    // d3.event.stopPropagation();
    //
    // restart();
    // //console.log(nodes,links);
  }

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        // .attr("r", function(d) {
        //   if(!d.grasa) d.grasa=5;
        //   if(d.grasa>5)d.grasa--;
        //   return d.grasa;
        // });
  }
  function animate(){
    node.attr("r", function(d) {
          if(!d.grasa) d.grasa=5;
          if(d.grasa>5)d.grasa--;
          return d.grasa;
        });
    requestAnimationFrame(animate);
  }
  animate();
  function restart() {


    node = node.data(nodes);

    node.enter().insert("circle", ".cursor")
        .attr("class", "node")
        .attr("r", 5)
        .on("mousedown", mousedownNode);

    node.exit()
        .remove();

    link = link.data(links);

    force.nodes(nodes)
    .links(links)
    .linkDistance(30)
    .charge(-60)
    .on("tick", tick);

    link.enter().insert("line", ".node")
        .attr("class", "link");
    link.exit()
        .remove();

    force.start();
  }
  return this;
})();
var destinationBase=require('./destinationBase');

module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
  var exit=false;
  var n=0;
  var name=function(a){
    return ["a","b","c","d","e","f"][a]||a;
  }
  while(environment.patcher.modules[name(n)]){
    n++;
  }
  environment.patcher.addModule(name(n),this);
})()}
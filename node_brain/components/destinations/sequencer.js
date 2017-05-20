var destinationBase=require('./destinationBase');
module.exports=function(environment){return new(function(){
  destinationBase.call(this,environment);
})()}
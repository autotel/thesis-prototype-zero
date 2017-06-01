var bindedModules=[];
module.exports=function(environment){
  return new (function(){
    environment.patcher.on('modulecreated',function(ev){
      
    });

  })();
}
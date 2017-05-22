'use strict'
module.exports=function(data){
  this.destination="midi";
  this.value=[]
  for(var a in data){
    if(typeof data[a]!=="function")
      this[a]=JSON.parse(JSON.stringify(data[a]));
  }
}
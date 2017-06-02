'use strict';
var base=require('./interactionModeBase');
var shell = require('shelljs');

var fingerMap=0x0000;
var functions=["shutdown","exit process","restart process","restart w. UCA"];
var lastFunctionPressed=false;
var confirm=0;
module.exports=function(environment){
  return new(function(){
    base.call(this);
    function updateHardware(){
      environment.hardware.draw([fingerMap,fingerMap|0x000C,0x0003]);
    }
    this.engage=function(){
      environment.hardware.sendScreenA("Performer");
      // console.log("engage mode selector");
      updateHardware();
    }
    this.eventResponses.buttonMatrixPressed=function(evt){
      fingerMap=0x1<<evt.data[0];
      var selectedFunction=functions[evt.data[0]];
      if(selectedFunction!=lastFunctionPressed) confirm=0;

      if(selectedFunction=="shutdown"){
        lastFunctionPressed=selectedFunction;
        environment.hardware.sendScreenA("confirm shutdown");
        environment.hardware.sendScreenB("press again");
        if(confirm>0){
          environment.hardware.sendScreenA("K. Bye");
          setTimeout(function(){
            environment.hardware.sendScreenA("- -");
            environment.hardware.sendScreenB(" X ");
          },900);
          setTimeout(function(){
            shell.exec('sudo shutdown -h now');
          },1000);
        }
        confirm++;
      }else if(selectedFunction=="exit process"){
        lastFunctionPressed=selectedFunction;
        environment.hardware.sendScreenA("confirm close app");
        environment.hardware.sendScreenB("press again");
        if(confirm>0){
          environment.hardware.sendScreenA("K. Bye");
          setTimeout(function(){
            environment.hardware.sendScreenA("- -");
            environment.hardware.sendScreenB(" X ");
          },900);
          setTimeout(function(){
            process.exit();
          },1000);
        }
        confirm++;
      }else if(selectedFunction=="restart process"){
        lastFunctionPressed=selectedFunction;
        environment.hardware.sendScreenA("confirm restart app");
        environment.hardware.sendScreenB("press again");
        if(confirm>0){
          environment.hardware.sendScreenA("restarting...");
          shell.exec('node restartApp.js');

          setTimeout(function(){
            process.exit();
          },500);
        }
        confirm++;
      }else if(selectedFunction=="restart w. UCA"){
        lastFunctionPressed=selectedFunction;
        environment.hardware.sendScreenA("confirm restart app");
        environment.hardware.sendScreenB("press again");
        if(confirm>0){
          environment.hardware.sendScreenA("restarting...");
          shell.exec('node useUCA222.js');
          setTimeout(function(){
            process.exit();
          },500);
        }
        confirm++;
      }
      updateHardware();

    }
    this.eventResponses.buttonMatrixReleased=function(evt){
      // fingerMap&=~(0x1<<evt.data[0]);
      // updateHardware();
    }
    this.eventResponses.encoderScroll=function(evt){

    }
    this.eventResponses.encoderPressed=function(evt){

    }
    this.eventResponses.encoderReleased=function(evt){

    }
  })();
  return this;
}
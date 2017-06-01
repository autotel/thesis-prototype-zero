var jazz = require('jazz-midi');
var midi = new jazz.MIDI();

var name = midi.MidiOutOpen(0);
if(name){
  console.log('Default MIDI-Out port:', name);
  midi.MidiOut(0x90,60,100); midi.MidiOut(0x90,64,100); midi.MidiOut(0x90,67,100);
  setTimeout(function(){
    midi.MidiOut(0x80,60,0); midi.MidiOut(0x80,64,0); midi.MidiOut(0x80,67,0);
    midi.MidiOutClose();
    console.log('Thank you for using Jazz-MIDI!');
  }, 3000);
} else {
  console.log('Cannot open default MIDI-Out port!');
}
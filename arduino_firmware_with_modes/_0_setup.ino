//find midi communication at the bottom


#include <LiquidCrystal.h>
#include <TimerOne.h>
#include <SoftwareSerial.h>

//analog inputs that are connected to the multiplexor commons
int analogA;
int analogB;

//pins that are connected to the encoder A and B
#define encoder0PinA  A4
#define encoder0PinB  A5
volatile unsigned int encoder0Pos = 0;

//pins that are connected to the midi plugs as software serial
int midiIn = A3;
int midiOut = A2;
SoftwareSerial mySerial(midiIn, midiOut); // RX, TX


//current mode
int m_mode = 0;
//wether it is recording the midi stream
bool m_recording = false;
//names for the m_mode possible values
String  m_list [] = {
  "performer", "sequencer", "jumper 1", "jumper 2",
  "scaleset", "chordset", "patternset 1", "patternset 2",
  "Arpeggiator", "Tesseractor F", "Tesseractor G", "Tesseractor H",
  "Tesseractor A", "Tesseractor B", "Tesseractor C", "Tesseractor D",

};
//submodes of the modes
//pm_ player modes
byte pm_current = 2;
String pm_layerList [] = {
  "chords", "grades", "notes", "channels", "cc's", "custom"
};
byte pm_selectedChannel = 0;
byte pm_selectedNote = 36;
byte pm_selectedVelocity = 120;
byte pm_selectedScale = 0;

//se_ scale editor related vars
byte se_selectedScale = 0;


//graphics
int graph_pointer = 0x00;
int graph_fingers = 0x00;
int graph_sequence = 0x00;
String lastScreenA = "";
String lastScreenB = "";


//structure_
//scales are binary. The 1's are the white keys and the 0's are the black keys, starting from the lsb
int structure_scales[16][3] = {
  //major c
  {
    7, 0, //amount of selected notes in this scale, base note
    0b101010110101
  },
  //chromatic c
  {
    12,0,
    0b111111111111//all 12 notes are used in chromatic
  },
  //major c
  {
    7, 0, //amount of selected notes in this scale, base note
    0b101010110101
  },
  //aeolian (not sure)
  {
    7, 0, //amount of selected notes in this scale, base note
    0b010110101101
  },
  //whatever
  {
    7, 0, //amount of selected notes in this scale, base note
    0b10100110101
  }
};
/*  byte structure_chords[16][16];
  byte structure_chords[0] = {0, 2, 4};
  byte structure_chords[1] = {1, 3, 5};
  byte structure_chords[2] = {2, 4, 8};
  byte structure_chords[3] = {3, 5, 7};*/

String noteNameArray[] = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};
//modifier states
//example boolean shift=false;
bool selector_mode = false;
bool selector_a = false;
bool selector_b = false;
bool selector_c = false;
//midi tracking
//[0,0]=wether last thing sent was a note on (off is due)
//[0,1]=channel...
byte MIDI_NoteOns [16][4];
//text to print in screens
String screenA = "CALCUTRATOR";
String screenB = "0";
//flag that indicates that the screen should be redrawn when possible
bool screenChanged = true;

//the last button that has been pressed on the matrix buttons
byte lastMatrixButtonPressed = 0;
//buttons that were pressed on last evaluation;
unsigned int pressedMatrixButtonsBitmap = 0x0000;
byte pressedSelectorButtonsBitmap = 0x00;
//the buttons that are active while engaged in binary number input (ex. note selector)
unsigned int binaryInputActiveBitmap = 0x0000;

LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

long lastchange;

//contains the midi sequence to play
byte sequence [96][3];

unsigned int layers [] = {0xfff0, 0x0, 0x0};



void setup() {
  //the perfect pulldown is 2.5K ohms
  //the analog port that will be connected to each mux A and B
  analogA = A1;
  analogB = A0;
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;
  //Timer1.initialize(9000);//200
  //Timer1.attachInterrupt(timedLoop);
  //sequence[2][0] = 0x90;

  mySerial.begin(31250);


  //lcd screen initial write
  lcd.begin(16, 2);
  lcd.print("hello, world!");

  //encoder set up
  pinMode(encoder0PinA, INPUT);
  digitalWrite(encoder0PinA, HIGH);       // turn on pull-up resistor
  pinMode(encoder0PinB, INPUT);
  digitalWrite(encoder0PinB, HIGH);       // turn on pull-up resistor

  //attachInterrupt(0, doEncoder, CHANGE);  // encoder pin on interrupt 0 - pin 2
  //Timer1.initialize(200);//200
  //Timer1.attachInterrupt(doEncoder);
}



//send a midi event to the midi output
void sendMidi(byte a, byte b, byte c) {
  mySerial.write(a);
  mySerial.write(b);
  mySerial.write(c);
}
void sendMidi(byte a, byte b, byte c, bool debug) {
  sendMidi(a, b, c);
  if (debug)
    lcdPrintB(String( a, HEX) + "," + String( b, HEX) + "(" + noteNameArray[b % 12] + ")," + String( c, HEX) + "");
}
void noteOn(byte channel, byte b, byte c, byte button, bool debug) {
  byte a = (0x0f & channel) | 0x90;
  MIDI_NoteOns[button][0] = 0xFF;
  MIDI_NoteOns[button][1] = channel;
  MIDI_NoteOns[button][2] = b;
  MIDI_NoteOns[button][3] = c;
  sendMidi(a, b, c, debug);
}

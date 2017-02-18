//find midi communication at the bottom


#include <LiquidCrystal.h>
//#include <TimerOne.h>
#include <SoftwareSerial.h>

//analog inputs that are connected to the multiplexor commons
int analogA;
int analogB;

//pins that are connected to the encoder A and B
//pc4 & pc5
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
/*instead of making usual arrays, to save space for local vars, I'm writing constant strings to progmem.*/

/*const String  m_list [] = {
  "PERF", "SEQ", "JMP1", "JMP2",
  "SCALE", "CHRD", "MIX1", "MIX2",
  "ARP", "TSX1", "TSX2", "TSX3",
  "TSX4", "TSX5", "TSX6", "ERR!",
  };*/
const char string_0[] PROGMEM = "PADS";
const char string_1[] PROGMEM = "SEQ";
const char string_2[] PROGMEM = "JUMP1";
const char string_3[] PROGMEM = "JUMP2";
const char string_4[] PROGMEM = "SCALE";
const char string_5[] PROGMEM = "CHORD";
const char string_6[] PROGMEM = "MIX1";
const char string_7[] PROGMEM = "MIX2";
const char string_8[] PROGMEM = "ARP";
const char string_9[] PROGMEM = "DEATH";



char stringBuffer[8];


//submodes of the modes
//pm_ player modes
byte pm_current = 2;
/*const String pm_POVList [] = {
  "grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
  };*/
const char string_10[] PROGMEM = "grade";
const char string_11[] PROGMEM = "note";
const char string_12[] PROGMEM = "channel";
const char string_13[] PROGMEM = "CC/no";
const char string_14[] PROGMEM = "CC/ch";
const char string_15[] PROGMEM = "Note+A";
const char string_16[] PROGMEM = "Note+B";

//build array with all strings for lookup
const char* const string_table[] PROGMEM = {
  string_0, string_1, string_2, string_3, string_4, string_5, string_6, string_7, string_8,
  string_9, string_10, string_11, string_12, string_13, string_14, string_15, string_16
};

//get string of mode name
String getString_mode(byte n) {
  strcpy_P(stringBuffer, (char*)pgm_read_word(&(string_table[n]))); // Necessary casts
  return stringBuffer;
}
//get string of submode name
String getString_POV(byte n) {
  n += 10;
  strcpy_P(stringBuffer, (char*)pgm_read_word(&(string_table[n]))); // Necessary casts
  return stringBuffer;
}



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


//structure_
//scales are binary. The 1's are the white keys and the 0's are the black keys, starting from the lsb
int structure_scales[4][3] = {
  //major c
  {
    7, 0, //amount of selected notes in this scale, base note
    0b101010110101
  },
  //chromatic c
  {
    12, 0,
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
  }
};
/*  byte structure_chords[16][16];
  byte structure_chords[0] = {0, 2, 4};
  byte structure_chords[1] = {1, 3, 5};
  byte structure_chords[2] = {2, 4, 8};
  byte structure_chords[3] = {3, 5, 7};*/
const String noteNameArray[] = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};

//modifier states
//example boolean shift=false;
bool selector_mode = false;
bool selector_a = false;
bool selector_b = false;
bool selector_c = false;
//midi tracking
//[0,0]=wether last thing sent was a note on (off is due)
//[0,1]=channel...

byte MIDI_NoteOns [16][2];

//text to print in screens
String screenA = "";
String screenB = "";
String lastScreenA = "";
String lastScreenB = "";

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

//64 event memory
// (active+time),(type+channel),(number),(velocity or value)
// step 17, cc in channel 4, number 74, to 140, --
// step 32, noteon in channel 1, number 60 (c3), velocity 97, length of 1
// step 0, grade in channel 2, numbeer 60 (c3), velocity 90, length of 2
// step 0, grade in channel 2, numbeer 64, velocity 90, length of 2
// step 0, grade in channel 2, numbeer 67, velocity 90, length of 2

#define SQLN 128
byte seq_ence [SQLN][5];
byte seq_enceLength=SQLN;
#undef SQLN

//at what time to loop each sequence.
byte seq_lengths [8];

//all other currentStep's are modulus of the following one:
unsigned int seq_currentStep128x12 = 0;
unsigned int seq_currentStep128 = 0;
byte seq_currentStep16 = 0;

byte seq_currentSequences [16];
byte seq_current = 0;


unsigned int layers [] = {0xfff0, 0x0, 0x0};

unsigned int graph_debug = 0x00;


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

  //encoder set up


  pinMode(encoder0PinA, INPUT);
  digitalWrite(encoder0PinA, HIGH);       // turn on pull-up resistor
  pinMode(encoder0PinB, INPUT);
  digitalWrite(encoder0PinB, HIGH);       // turn on pull-up resistor


  //attachInterrupt(0, doEncoder, CHANGE);  // encoder pin on interrupt 0 - pin 2
  //Timer1.initialize(1000);//200
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
  MIDI_NoteOns[button][0] = channel;
  MIDI_NoteOns[button][1] = b;//note
  //  MIDI_NoteOns[button][3] = c;
  sendMidi(a, b, c, debug);
}

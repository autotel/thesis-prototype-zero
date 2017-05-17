//find midi communication at the bottom


#include <LiquidCrystal.h>
#include <TimerOne.h>
#include <SoftwareSerial.h>


//analog inputs that are connected to the multiplexor commons

#define analogA A1
#define analogB A0

//pins that are connected to the encoder A and B
//pc4 & pc5
#define encoder0PinA  A4
#define encoder0PinB  A5
volatile unsigned int encoder0Pos = 0;

//serial is separated by pauses, sadly.
//perhaps I should define a better protocol than this somehow.
#define serialSeparationTime 200
long lastSerial=0;
//pins that are connected to the midi plugs as software serial
#define sIn 0
#define sOut 1
SoftwareSerial mySerial(sIn, sOut); // RX, TX

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
//pov_ player modes
byte pov_current = 2;
/*const String pov_POVList [] = {
  "grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
  };*/
const char string_10[] PROGMEM = "grade";
const char string_11[] PROGMEM = "note";
const char string_12[] PROGMEM = "channel";
const char string_13[] PROGMEM = "CC/no";
const char string_14[] PROGMEM = "CC/ch";
const char string_15[] PROGMEM = "Note+A";
const char string_16[] PROGMEM = "Note+B";

//selectors names
const char string_17[] PROGMEM = "None";
const char string_18[] PROGMEM = "Mode";
const char string_19[] PROGMEM = "POV";
const char string_20[] PROGMEM = "Channel";
const char string_21[] PROGMEM = "Note";
const char string_22[] PROGMEM = "Number";
const char string_23[] PROGMEM = "Grade";
const char string_24[] PROGMEM = "Record";
const char string_25[] PROGMEM = "Modulus";

//build array with all strings for lookup
const char* const string_table[] PROGMEM = {
  string_0, string_1, string_2, string_3, string_4, string_5, string_6, string_7, string_8,
  string_9, string_10, string_11, string_12, string_13, string_14, string_15, string_16,
  string_17, string_18, string_19, string_20, string_21, string_22, string_23, string_24, string_25
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
//get string of selector
String getString_SELECTOR(byte n) {
  n += 17;
  strcpy_P(stringBuffer, (char*)pgm_read_word(&(string_table[n]))); // Necessary casts
  return stringBuffer;
}
const String noteNameArray[] = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};

//selector that is currently running
byte selector_current=SELECTOR_NONE;
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
unsigned int activePadInput = 0x0000;

LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

long lastchange;

unsigned int layers [] = {0xffff, 0xffff, 0xffff};


void setup() {
  //the perfect pulldown is 2.5K ohms
  //the analog port that will be connected to each mux A and B

  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;

  /*Timer1.initialize(500);//200
  Timer1.attachInterrupt(timedLoop);*/

  //sequence[2][0] = 0x90;

//pendant: probably can be faster
  mySerial.begin(SOFT_BAUDRATE);
  mySerial.write(TH_hello);

  //lcd screen initial write
  lcd.begin(16, 2);

  //encoder set up


  pinMode(encoder0PinA, INPUT);
  digitalWrite(encoder0PinA, HIGH);       // turn on pull-up resistor
  pinMode(encoder0PinB, INPUT);
  digitalWrite(encoder0PinB, HIGH);       // turn on pull-up resistor

  lcdPrintA("init");
  lcdPrintB("init");

}


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
  "modeselector",
  "performer", "sequencer", "jumper 1", "jumper 2",
  "scale", "chordset", "patternset 1", "patternset 2",
  "Tesseractor A", "Tesseractor B", "Tesseractor C", "Tesseractor D"
  "undefined", "undefined", "undefined", "undefined"
};

//text to print in screens
String screenA = "KALKULAITOR";
String screenB = "0";
//flag that indicates that the screen should be redrawn when possible
bool screenChanged = true;

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

}


unsigned int graph_debug = 0x00;
int currentStep16 = 0;
int currentStep16x12 = 0;
void loop() {
  if (mySerial.available()) {
    byte midiHeader = mySerial.read();
    if (m_recording) {
      if ((midiHeader & 0xF0) == 0x90) {
        sequence[currentStep16][0] = midiHeader;//pendant: this is not right implementation of midi in
        sequence[currentStep16][1] =  mySerial.read();
        sequence[currentStep16][2] =  mySerial.read();
      }
    }
    //clock
    if (midiHeader == 0xF8) {
      currentStep16x12 = (currentStep16x12 + 1) % (16 * 12);
      if (currentStep16x12 % 12 == 0) {
        currentStep16 = currentStep16x12 / 12;

      }
    }
    //start
    if (midiHeader == 0xFA) {
      currentStep16x12 = 0;
      currentStep16 = 0;
    }
  }


  evaluateSequence();

  //for (int a = 0; a < 64; a++) {
  timedLoop();
  delayMicroseconds(1);
  //}
}

bool frameHasNote(byte frame) {
  return (sequence[frame][0] & 0xF0) == 0x90;
}

int graph_pointer = 0x00;
int graph_fingers = 0x00;
int graph_sequence = 0x00;
String lastScreenA = "";
String lastScreenB = "";

void draw() {

  layers[2] = graph_sequence;
  layers[1] = graph_fingers;

  layers[1] |= graph_pointer;
  layers[2] |= graph_fingers;

  layers[0] = graph_debug;
  // layers[1]|=graph_debug;
  layers[2] |= graph_debug;

  if (screenChanged) {
    screenChanged = false;
    if (lastScreenA != screenA) {
      lastScreenA = screenA;
      lcd.setCursor(0, 0);
      lcd.print(screenA);
    }
    if (lastScreenB != screenB) {
      lastScreenB = screenB;
      lcd.setCursor(0, 1);
      lcd.print(screenB);
    }
  }
}

void lcdPrintA(String what) {
  screenChanged = true;
  screenA = what;
}
void lcdPrintB(String what) {
  screenChanged = true;
  screenB = what;
}

long lastMillis = 0;
unsigned int stepInterval = 200;
void evaluateSequence() {
  graph_pointer = 1 << currentStep16;

  /*
    long thisMillis = millis();
    //evaluate wether to step
    if (thisMillis - lastMillis >= stepInterval) {
    lastMillis = thisMillis;
    //currentStep16=(currentStep16+1)%16;
    graph_pointer = 1 << currentStep16;
    }*/
  //create the graphic layer to display the sequence

  graph_sequence = 0;
  for (byte a = 0; a < 16; a++) {
    if (frameHasNote(a)) {
      graph_sequence |= 0x1 << a;
    }
  }
}

byte cp64 = 0;
//buttons that were pressed on last evaluation;
int pressedMatrixButtonsBitmap = 0x0000;

void timedLoop() {
  if (cp64 == 0) {
    draw();
  }
  //evaluate matrix buttons
  byte cp16 = cp64 % 16;
  int buttonPressure = readMatrixButton(cp16);
  int evaluator = 0x1 << cp16;
  if (buttonPressure > 1) {
    //if last lap this button was not pressed, trigger on  button pressed
    if ((evaluator & pressedMatrixButtonsBitmap) == 0) {
      onMatrixButtonPressed(cp16, buttonPressure);
      pressedMatrixButtonsBitmap |= evaluator;
    } else {
      onMatrixButtonHold(cp16, buttonPressure);
    }
  } else {
    if ((evaluator & pressedMatrixButtonsBitmap) != 0) {
      onMatrixButtonReleased(cp16);
      pressedMatrixButtonsBitmap &= ~(0x1 << cp16);
    }
  }
  /*layers[0]=readMatrixButton(3);
    layers[1]=readMatrixButton(1);
    layers[2]=readMatrixButton(2);*/
  updatePixel(cp64 % 32 + 16); //originally no operation should be performed over cp64, but it helps to have brighter leds at cost of no red

  //evaluate tact buttons on top of the matrix
  //less frequently than matrix, because these are not performance buttons
  if (cp16 == 0) {
    //cp64/16 will be 0,1,2,3 alernatingly each time cp16 is 0
    int cb_4 = cp64 / 16;
    if (readMuxB(cb_4 + 4)) {
      lcdPrintB("N" + String(cb_4) + "-");
    }
  }

  cp64++;
  cp64 = cp64 % 64;
}
//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, int buttonPressure) {}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
  onMatrixButtonPressed(button, 127);
}
//actions to take once a button is pressed
void onMatrixButtonPressed(byte button, int buttonPressure) {
  graph_fingers |= 0x1 << button;
  //for debug
  switch (m_mode) {
    case 0:
      sendMidi(0x90, 36 + button, 127);
      break;
    case 1:
      int evaluator = 0x1 << button;
      if (frameHasNote(button)) {
        sequence[button][0] = 0x00;
      } else {
        sequence[button][0] = 0x90;
      }
      break;
  }
}
//
//actions to take once a button is released
void onMatrixButtonReleased(byte button) {
  graph_fingers &= ~(0x1 << button);
  //for debug
  switch (m_mode) {
    case 0:
      sendMidi(0x80, 36 + button, 127);
      break;
    case 1:
      break;
  }
}
//send a midi event to the midi output
void sendMidi(byte a, byte b, byte c) {
  mySerial.write(a);
  mySerial.write(b);
  mySerial.write(c);
}
//update one pixel on one of the color channels behind the mux
void updatePixel(byte currentPixel) {

  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;
  if ((layers[currentLayer] >> currentPixel % 16) & 0x0001) {
    //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
    nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
    nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

    nibbleB += 8;
    //ground & power the led
    //PORTC |= 0b1;
    //PORTC &= ~0b10;
    PORTD = (nibbleB << 4) | (nibbleA);
  }
}

//read one button behind the multiplexor to check whether is pressed or not.
int readMatrixButton(byte currentButton) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  //byte currentLayer = currentButton >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentButton % 4);
  nibbleB &= (currentButton / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  pinMode(analogB, INPUT);
  digitalWrite(analogA, HIGH);
  //PORTC |= 0b10;
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}

bool readMuxB(byte address) {
  //nibbleA in this case is only to avoid writing to muxA
  byte nibbleA = PORTD & 0xF;
  //nibbleB will contain the address for the mux B
  byte nibbleB = address & 0xF;
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  //now that we are connected to the mux, read the input
  pinMode(analogB, INPUT);
  bool ret = digitalRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}

//untested
int analogReadMuxB(byte address) {
  //nibbleA in this case is only to avoid writing to muxA
  byte nibbleA = PORTD & 0xF;
  //nibbleB will contain the address for the mux B
  byte nibbleB = address & 0xF;
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  //now that we are connected to the mux, read the input
  pinMode(analogB, INPUT);
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}
//read encoder. sourced from http://playground.arduino.cc/Main/RotaryEncoders#Example2
void doEncoder() {
  /* If pinA and pinB are both high or both low, it is spinning
     forward. If they're different, it's going backward.

     For more information on speeding up this process, see
     [Reference/PortManipulation], specifically the PIND register.
  */
  if (digitalRead(encoder0PinA) == digitalRead(encoder0PinB)) {
    encoder0Pos++;
  } else {
    encoder0Pos--;
  }
  lcdPrintB(String(encoder0Pos));

  Serial.println (encoder0Pos, DEC);
}



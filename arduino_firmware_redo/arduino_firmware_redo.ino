
#include <LiquidCrystal.h>
#include <TimerOne.h>
#include <SoftwareSerial.h>

int analogA;
int analogB;

int midiIn = 11;
int midiOut = 10;


SoftwareSerial mySerial(midiIn, midiOut); // RX, TX


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
  sequence[2][0] = 0x90;

  mySerial.begin(31250);
}


unsigned int graph_debug = 0x00;
int currentStep16 = 0;
int currentStep16x24 = 0;
void loop() {

  if (mySerial.available()) {
    byte midiHeader = mySerial.read();

    if ((midiHeader & 0xF0) == 0x90) {
      sequence[currentStep16][0] = midiHeader;//pendant: this is not right implementation of midi in
      sequence[currentStep16][1] =  mySerial.read();
      sequence[currentStep16][2] =  mySerial.read();
    }
    //clock
    if (midiHeader == 0xF8) {


      currentStep16x24 = (currentStep16x24 + 1) % (16 * 24);
      if (currentStep16x24 % 24 == 0) {
        currentStep16 = currentStep16x24 / 24;

      }
    }
    //start
    if (midiHeader == 0xFA) {
      currentStep16x24 = 0;
      currentStep16 = 0;
    }
  }


  evaluateSequence();

  for (int a = 0; a < 64; a++) {
    timedLoop();
  }
}

bool frameHasNote(byte frame) {
  return (sequence[frame][0] & 0xF0) == 0x90;
}

int graph_pointer = 0x00;
int graph_fingers = 0x00;
int graph_sequence = 0x00;
void draw() {

  layers[2] = graph_sequence;
  layers[1] = graph_fingers;

  layers[1] |= graph_pointer;
  layers[2] |= graph_fingers;

  layers[0] = graph_debug;
  // layers[1]|=graph_debug;
  layers[2] |= graph_debug;
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
int pressedButtonsBitmap = 0x0000;

void timedLoop() {
  draw();

  byte cp16 = cp64 % 16;
  int buttonPressure = readMatrixButton(cp16);
  int evaluator = 0x1 << cp16;
  if (buttonPressure > 1) {
    //if last lap this button was not pressed, trigger on  button pressed
    if ((evaluator & pressedButtonsBitmap) == 0) {
      onButtonPressed(cp16);
      pressedButtonsBitmap |= evaluator;
    } else {
      onButtonHold(cp16, buttonPressure);
    }
  } else {
    if ((evaluator & pressedButtonsBitmap) != 0) {
      onButtonReleased(cp16);
      pressedButtonsBitmap &= ~(0x1 << cp16);
    }

  }
  /*layers[0]=readMatrixButton(3);
    layers[1]=readMatrixButton(1);
    layers[2]=readMatrixButton(2);*/
  updatePixel(cp64);
  //readMatrixButton(cp%16);
  cp64++;
  cp64 = cp64 % 64;
}
void onButtonHold(byte button, int buttonPressure) {}
void onButtonPressed(byte button) {
  int evaluator = 0x1 << button;
  if (frameHasNote(button)) {
    sequence[button][0] = 0x00;
  } else {
    sequence[button][0] = 0x90;
  }
  graph_fingers |= 0x1 << button;
}
void onButtonReleased(byte button) {
  graph_fingers &= ~(0x1 << button);
}

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
int readMatrixButton(byte currentButton) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  //byte currentLayer = currentButton >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentButton % 4);
  nibbleB &= (currentButton / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop
  PORTD = (nibbleB << 4) | (nibbleA);
  pinMode(analogB, INPUT);
  digitalWrite(analogA, HIGH);
  //PORTC |= 0b10;
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;

}



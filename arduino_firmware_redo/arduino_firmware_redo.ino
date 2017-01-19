
#include <LiquidCrystal.h>
#include <TimerOne.h>
#include <SoftwareSerial.h>

int analogA;
int analogB;
int _pin;
long lastchange;

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
  Timer1.initialize(200);
  Timer1.attachInterrupt(timedLoop);
}

void loop() {

}

byte cp64 = 0;
//buttons that were pressed on last evaluation;
int pressedButtonsBitmap = 0x0000;

void timedLoop() {
  byte cp16 = cp64 % 16;
  int buttonPressure = readMatrixButton(cp16);
  if (buttonPressure > 1) {
    int evaluator = 0x1 << cp16;
    //if last lap this button was not pressed, trigger on  button pressed
    if ((evaluator & pressedButtonsBitmap) == 0) {
      onButtonPressed(cp16, buttonPressure);
      pressedButtonsBitmap |= evaluator;
    }
  } else {
    pressedButtonsBitmap &= ~(0x1 << cp16);
  }
  /*layers[0]=readMatrixButton(3);
    layers[1]=readMatrixButton(1);
    layers[2]=readMatrixButton(2);*/
  updatePixel(cp64);
  //readMatrixButton(cp%16);


  cp64++;
  cp64 = cp64 % 64;
}

void onButtonPressed(byte button, int buttonPressure) {

  int evaluator = 0x1 << button;
  if ((evaluator & layers[2]) == 0) {
    layers[2] |= evaluator;
  }else{
    layers[2] &= ~ evaluator;
  }

  layers[1] = 0x1 << button;
}
void onButtonReleased(byte button) {}

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



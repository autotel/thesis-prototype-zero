/*library for writing to a led screen through two 4051 multiplexors */
#include "Arduino.h"
#include "ledMatrix.h"

//LedMatrix lm;
LedMatrix::LedMatrix()
{

}
void instantiate() {
  //pendant: in order to use interrupts for screen drawing, I need ledmatrix to be static
  //initialize interrupt timer to redraw the leds
  //Timer1.initialize(100);
  //Timer1.attachInterrupt(LedMatrix::refreshNextPixel);
}
void LedMatrix::setup() {
  //the perfect pulldown is 2.5K ohms
  //the analog port that will be connected to each mux A and B
  analogA = A1;
  analogB = A0;
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  //so far we need the mux A to be high all the time
  digitalWrite(analogA, HIGH);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;
  //empty byteMaps.. I guess this is useless anyways
  byteMaps[0] = 0;
  byteMaps[1] = 0;
  byteMaps[2] = 0;
  byteMaps[3] = 0;

}
void LedMatrix::sum(int red, int green, int blue) {
  byteMaps[1] |= red;
  byteMaps[2] |= green;
  byteMaps[3] |= blue;
}
void LedMatrix::diff(int red, int green, int blue) {
  byteMaps[1] ^= red;
  byteMaps[2] ^= green;
  byteMaps[3] ^= blue;
}
void LedMatrix::sett(int red, int green, int blue) {
  byteMaps[1] = red;
  byteMaps[2] = green;
  byteMaps[3] = blue;
}
//read a pin on the mux b
/*int LedMatrix::readMuxB(byte number){
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = number;
  //clean the mux, set the mux, then read it
  PORTD &= 0x0F;
  //PORTD =  0x0F&nibbleB;
  PORTD |= (nibbleB << 4);
  pinMode(analogB, INPUT);
  //delayMicroseconds(100);
  return analogRead(analogB);
}*/
int LedMatrix::refresh(byte currentPixel) {
  int buttonRead = 0;
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;

  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
  nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop


  if (currentLayer == 0) {
    //if we are scanning the buttons
    nibbleB += 4; //~0x10 << ((currentPixel / 4) % 4);
    pinMode(analogB, INPUT);
    PORTC |= 0b1;
    PORTD = (nibbleB << 4) | (nibbleA);
    //delayMicroseconds(10);
    return analogRead(analogB);
  } else if (currentLayer > 4) {
    //if we are scanning the general purpose mux addresses
    nibbleB += 8; //~0x10 << ((currentPixel / 4) % 4);
    pinMode(analogB, INPUT);
    PORTC |= 0b1;
    PORTD = (nibbleB << 4) | (nibbleA);
    //delayMicroseconds(10);
    return analogRead(analogB);
  }else{
    //if we are displaying a layer of pixels,
    if ((byteMaps[currentLayer] >> currentPixel % 16) & 0x0001) {
      pinMode(analogB, OUTPUT);
      analogWrite(analogB,LOW);
      //ground & power the led
      PORTC |= 0b10;
      PORTC &= ~0b1;
      PORTD = (nibbleB << 4) | (nibbleA);
    } else {
      //de-ground & de-power the led
      PORTC &= ~0b10;
      PORTC |= 0b1;
    }
    return ~0;
  }
}

void LedMatrix::refresh()
{

  //if (millis() - lastchange > 300) {
  //bitmapred

  for (byte currentPixel = 0; currentPixel < 16; currentPixel++) {
    refresh(currentPixel);
  }

}



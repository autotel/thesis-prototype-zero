
/*library for writing to a led screen through two 4051 multiplexors */
#include <Arduino.h>
#include "ledMatrix.h"

LedMatrix::LedMatrix()
{

}
void LedMatrix::setup() {
  t = 0;
  lastchange = 0;
  _pin = 0;
  //PORTD
  DDRD |= 0xFF;
  pinMode(A0,OUTPUT);
  //test
  byteMapBlue = 0xa5a5;
  byteMapRed = 0xa5a5;
  // offset for the pin register
  registerOffset = 0;
}
void LedMatrix::sum(int blue, int red) {
  byteMapBlue |= blue;
  byteMapRed |= red;
}
void LedMatrix::diff(int blue, int red) {
  byteMapBlue ^= blue;
  byteMapRed ^= red;
}
void LedMatrix::sett(int blue, int red) {
  byteMapBlue = blue;
  byteMapRed = red;
}
void LedMatrix::refresh(byte currentPixel)
{
  byte nibbleA = 0x0F;
  byte nibbleB = 0xF0;
  if ((byteMapRed >> currentPixel) & 0x0001) {
    nibbleA &= currentPixel % 4 + 4;
    nibbleB &= ~0x10 << ((currentPixel / 4) % 4);
    //with a bit more of work, we can set alpha for each
    analogWrite(A0,255);
  }
  if ((byteMapBlue >> currentPixel) & 0x0001) {
    nibbleA &= currentPixel % 4;
    nibbleB &= ~0x10 << ((currentPixel / 4) % 4);
    analogWrite(A0,255);
  }
  PORTD = nibbleA | nibbleB;
  //delay(100);
}
void LedMatrix::refresh()
{
  

  //if (millis() - lastchange > 300) {
  //bitmapred
  /*
     int sized
     1111 -> F
     0000 -> 0
     0000 -> 0
     0000 -> 0
  */
  for (byte currentPixel = 0; currentPixel < 16; currentPixel++) {
    refresh(currentPixel);
  }
  delayMicroseconds(10);
}

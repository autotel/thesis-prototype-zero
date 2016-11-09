/*library for writing to a led screen through two 4051 multiplexors */
#include "WProgram.h"
#include "ledMatrix.h"

LedMatrix::LedMatrix()
{

}
void LedMatrix::setup() {
  lastchange = 0;
  _pin = 0;
  //GPIOD_<<4
  pinMode(6, OUTPUT);
  pinMode(20, OUTPUT);
  pinMode(21, OUTPUT);
  pinMode(5, OUTPUT);
  //GPIOB_<<4
  pinMode(0, OUTPUT);
  pinMode(1, OUTPUT);
  pinMode(32, OUTPUT);
  pinMode(25, OUTPUT);
  //test
  byteMapBlue = 0x0000;
  byteMapRed = 0x0000;
  // offset for the pin register
  registerOffset = 5;
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
    //analogWrite(A0,255);
  }
  if ((byteMapBlue >> currentPixel) & 0x0001) {
    nibbleA &= currentPixel % 4;
    nibbleB &= ~0x10 << ((currentPixel / 4) % 4);
    //analogWrite(A0,255);
  }
  //apply pixels to led
  GPIOD_PDOR = nibbleA<<5;
  //clear gnd columns, they are inverse logic
  GPIOB_PDOR &= ~(0xF0<<12);
  //fill colums without affecting other pisn
  GPIOB_PDOR |= (0xF0&nibbleB)<<12;
  //delay(10);
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

/*library for writing to a led screen through two 4051 multiplexors */
#include "WProgram.h"
#include "ledMatrix.h"

LedMatrix::LedMatrix()
{

}
void LedMatrix::setup() {
  t = 0;
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
  byteMapBlue = 0xA5A5;
  byteMapRed = 0x5A5A;
  // offset for the pin register
  registerOffset = 4;
}
void LedMatrix::sum(int blue, int red){
  byteMapBlue|=blue;
  byteMapRed|=red;  
}
void LedMatrix::diff(int blue, int red){
  byteMapBlue^=blue;
  byteMapRed^=red;  
}
void LedMatrix::sett(int blue, int red){
  byteMapBlue=blue;
  byteMapRed=red;
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
  t = 0;
  while (t < 16) {
    int currentBitMask =  (0x0001 << t);
    int currentRedBit = byteMapRed & currentBitMask;
    int currentBlueBit = byteMapBlue & currentBitMask;
    //GPIOD contains the address to shift registers.
    //first 4 address four rows one color, and the last four, the other color.
    //check if current bitmap red pixel must be on
    if (currentRedBit) {
      //write red
      GPIOD_PDOR = (0x00 | ((t) % (4) << registerOffset));
    }
    //same for blue
    if (currentBlueBit) {
      //write blue
      GPIOD_PDOR = (0x00 | (((t % 4) + 4) << registerOffset));
    }
    //GPIOB is addressing columns directly.
    if (currentRedBit || currentBlueBit)
      GPIOB_PDOR = ~0x010000 << (t / 4) % 4; //((t/4)%16)+4;
    t++;
    //for some reason it doesn't work without delay
    delayMicroseconds(200);
  }
}

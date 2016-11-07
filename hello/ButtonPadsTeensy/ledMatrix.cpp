/*library for writing to a led screen through two 4051 multiplexors */
#include "WProgram.h"
#include "ledMatrix.h"

LedMatrix::LedMatrix()
{

}
void LedMatrix::setup() {
  lastchange = 0;
  _pin = 0;

  //to change pin output numbers you also have to go to the refresh function
  serialpin = 2;
  clockpin = 14;
  latchpin = 8;

  pinMode(serialpin, OUTPUT);
  pinMode(clockpin, OUTPUT);
  pinMode(latchpin, OUTPUT);
  //GPIOB_<<4
  pinMode(0, OUTPUT);
  pinMode(1, OUTPUT);
  pinMode(32, OUTPUT);
  pinMode(25, OUTPUT);
  //test
  byteMapBlue = 0xA5A5;
  byteMapRed = 0x5A5A;
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
void LedMatrix::sett(int red, int blue) {
  byteMapBlue = blue;
  byteMapRed = red;
}
void LedMatrix::refresh()
{
  /*
    //turn serial data pin on
    GPIOD_PDOR|=0x1//;<<0;
    //turn clock pin on
    GPIOD_PDOR|=0x1<<1;
    //turn latch pin on
    GPIOD_PDOR|=0x1<<3;
  */


  unsigned long int pixels [] = {
    0x00FF0000, 0x00FF0000, 0x00FF0000, 0x00FF0000,
    0x00FF0000, 0x00FF0000, 0x00FF0000, 0x00FF0000,
    0x00FFFF00, 0x00FF0000, 0x00FF0000, 0x00FFFF00,
    0x00FF0000, 0x00FF0000, 0x00FF0000, 0x00FF0000
  };

  //latch pin lo

  int cathode = 0;
  while (cathode < 4) {
    digitalWrite(latchpin, LOW);
    for (int anode = 0; anode < 4; anode++) {
      int pixelnum = anode * 4 + cathode;
      //the color number 4 is gnd and should always be low
      for (int colorn = 0; colorn < 4; colorn++) {
        //clear sreial pin
        GPIOD_PDOR &= 0xFE;
        //data to something
        //digitalWrite(serialpin,(0xFC<<byten)&0x80);
        GPIOD_PDOR |= (pixels[pixelnum] >> colorn) & 0x1;
        //GPIOD_PDOR |=(0x0D0F<<anode)&0x1;

        //clock HI
        digitalWrite(clockpin, HIGH);
        //GPIOD_PDOR |= 0x1 << 1;
        //delay(3);

        //clock LO
        //GPIOD_PDOR &=  ~0x01 << 1;
        digitalWrite(clockpin, LOW);
        //delay(10);
      }
    }
    digitalWrite(latchpin, HIGH);
    
    cathode++;
  }
  //delay(10);
}

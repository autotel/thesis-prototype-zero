/*library for writing to a led screen through two 4051 multiplexors */
#include "WProgram.h"
#include "ledMatrix.h"

LedMatrix::LedMatrix()
{

}
void LedMatrix::setup() {
  lastchange = 0;
  _pin = 0;
  //analog reader
  pinMode(A2,INPUT);
  //GPIOC_<<8
  pinMode(28, OUTPUT);
  pinMode(27, OUTPUT);
  pinMode(29, OUTPUT);
  pinMode(30, OUTPUT);
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
int LedMatrix::buttonPressed(byte currentPixel){
  //the multiplexor is shared between the led matrix and the buttons readout.
  //buttonsAtMux contains the mux address where the first button row is.
  //as I don't have a 16 output mux at hand, I am sharing the very same paths as the red channel that starts at mux addr 0
  int buttonsAtMux=0;
  
  //create the nibble to address mux
  //nibbleA will contain the mux address for the buttons cols (green cables currently)
  byte nibbleA = currentPixel % 4 + buttonsAtMux;
  //nibbleB will contain the mux address for the button ouputs, or rows (black cables currently).
  //the mux for the butttons output has enough space to detect the four tact buttons aswell,
  //but here we are only reaching the matrix buttons, as the tacts need less precision.
  byte nibbleB = (currentPixel / 4)% 4;

  //make sure button check doesnt light any led up. only needed if sharing mux channels with a led channel
  GPIOB_PDOR |= (0xF0);
  
  
  //rDisplace variable is in order to access the correct set of pins and to be able to change these fairly easy
  byte rDisplace=5;
  //clear space for nibble A without affecting other pinstates
  GPIOD_PDOR &= ~(0xF<<rDisplace);
  //write nibble A to the buttons input mux
  GPIOD_PDOR |= nibbleA<<rDisplace;


  

  rDisplace=8;
  //clear space for nibbleB without affecting other pinstates
  GPIOC_PDOR &= ~(0xF<<rDisplace);
  //write nibbleB to the buttons output mux
  GPIOC_PDOR |= nibbleB<<rDisplace;
  //delay(500);

  //once we created the correct led matrix route through the muxes, 
  //we can read the output and will hopefully represent the current led pressure
  if(digitalRead(A2)){
    return 0xFF;
  }else{
    return 0x00;
  }
  //return analogRead(A2);
}

void LedMatrix::refresh(byte currentPixel)
{
  //nibble A is connected to the mux address
  byte nibbleA = 0x0F;
  //nibble B is connected to the four gnds of the ledmatrix
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

  //rDisplace variable is in order to access the correct set of pins and to be able to change these fairly easy
  byte rDisplace=12;
  //clear space for nibble B without affecting other pins
  GPIOB_PDOR &= ~(0xF0<<rDisplace);
  //fill colums without affecting other pisn
  GPIOB_PDOR |= (0xF0&nibbleB)<<rDisplace;

  rDisplace=5;
  //clear space for nibble A without affecting other pinstates
  GPIOD_PDOR &= ~(0xF<<rDisplace);
  //write to the mux
  GPIOD_PDOR |= nibbleA<<rDisplace;

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

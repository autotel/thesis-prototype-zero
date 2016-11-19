/*library for writing to a led screen through two 4051 multiplexors */
#include "Arduino.h"
#include "ledMatrix.h"

LedMatrix::LedMatrix()
{

}
void LedMatrix::setup() {
  lastchange = 0;
  _pin = 0;
  //the perfect pulldown is 2.5K ohms

  //analog reader}
  pinMode(A0, INPUT);
  pinMode(A1, OUTPUT);
 
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;
  //empty byteMaps.. I guess this is useless anyways
  byteMaps[0] = 0;
  byteMaps[1] = 0;
  byteMaps[2] = 0;
  byteMaps[3] = 0;
}
void LedMatrix::sum(int red, int green, int blue) {
  byteMaps[1] |= blue;
  byteMaps[2] |= green;
  byteMaps[3] |= red;
}
void LedMatrix::diff(int red, int green, int blue) {
  byteMaps[1] ^= blue;
  byteMaps[2] ^= green;
  byteMaps[3] ^= red;
}
void LedMatrix::sett(int red, int green, int blue) {
  byteMaps[1] = blue;
  byteMaps[2] = green;
  byteMaps[3] = red;
}
/*int LedMatrix::buttonPressed(byte currentPixel) {

    //the multiplexor is shared between the led matrix and the buttons readout.
    //buttonsAtMux contains the mux address where the first button row is.
    //as I don't have a 16 output mux at hand, I am using the nibble 2 of the mux
    //and the led matrix is monochrome
    int buttonsAtMux=12;

    //create the nibble to address mux
    //nibbleA will contain the mux address for the buttons cols (green cables currently)
    byte nibbleA = (currentPixel % 4) + buttonsAtMux;
    //nibbleB will contain the mux address for the button ouputs, or rows (black cables currently).
    //the mux for the butttons output has enough space to detect the four tact buttons aswell,
    //but here we are only reaching the matrix buttons, as the tacts need less precision.
    byte nibbleB = (currentPixel / 4)% 4;

    //make sure button check doesnt light any led up. only needed if sharing mux channels with a led channel
    GPIOB_PDOR |= (0xF0);


    //rDisplace variable is in order to access the correct set of pins and to be able to change these fairly easy
    byte ADisplace=5;
    //clear space for nibble A without affecting other pinstates
    GPIOD_PDOR &= ~(0xF<<ADisplace);

    byte BDisplace=8;
    //clear space for nibbleB without affecting other pinstates
    GPIOC_PDOR &= ~(0xF<<BDisplace);

    //write nibble A to the buttons input mux
    GPIOD_PDOR |= nibbleA<<ADisplace;

    //write nibbleB to the buttons output mux
    GPIOC_PDOR |= nibbleB<<BDisplace;


    //delay(500);
    delayMicroseconds(100);
    //once we created the correct led matrix route through the muxes,
    //we can read the output and will hopefully represent the current led pressure
    /*if(digitalRead(A2)){
      return 0xFF;
    }else{
      return 0x00;
    }
    pinMode(A1,INPUT);
    return analogRead(A1);/**
  }*/

int LedMatrix::refresh(byte currentPixel){
  int buttonRead = 0;

  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;




  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //0-15=0,16-31=4,32-47=8,48-63=12
  

  nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4);
    
  
  if (currentLayer == 0) {
    nibbleB += 4; //~0x10 << ((currentPixel / 4) % 4);
    pinMode(A1,INPUT);
    PORTC |= 0b1;
    PORTD = (nibbleB << 4) | (nibbleA);
    //delayMicroseconds(10);
    return analogRead(A1);
  } else {
    
    //if we are displaying a layer of pixels,
    //pinMode(A0, OUTPUT);
    
    if ((byteMaps[currentLayer] >> currentPixel % 16) & 0x0001) {
      pinMode(A1,OUTPUT);
      //ground & power the led
      PORTC |= 0b1;
      PORTC &= ~0b10;
      PORTD = (nibbleB << 4) | (nibbleA);
    }else{
      //de-ground & de-power the led
      PORTC &= ~0b1;
      PORTC |= 0b10;
    }
    return ~0;
  }
  

  //apply pixels to led
  //rDisplace variable is in order to access the correct set of pins and to be able to change these fairly easy
  /*
     If the mux nibbles are spread along two registers; this is the way to go
    byte rDisplace=4;


    //clear space for nibble B without affecting other pins
    PORTD &= ~(0xF<<rDisplace);
    //fill colums without affecting other pisn
    PORTD |= (0xF&nibbleB)<<rDisplace;

    rDisplace=0;
    //clear space for nibble A without affecting other pinstates
    PORTD &= ~(0xF<<rDisplace);
    //write to the mux
    PORTD |= nibbleA<<rDisplace;
  */

  //this simpler version is for when you have a whole register for the two muxes


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

}

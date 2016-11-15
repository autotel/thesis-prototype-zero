//https://forum.pjrc.com/threads/17532-Tutorial-on-digital-I-O-ATMega-PIN-PORT-DDR-D-B-registers-vs-ARM-GPIO_PDIR-_PDOR
// include the library code:
#include <TimerOne.h>
//#include "C:\Program Files (x86)\Arduino\hardware\teensy\avr\libraries\TimerOne\TimerOne.h"
#include <LiquidCrystal.h>
#include "ledMatrix.h"
#include "IntPattern.h"
// initialize the library with the numbers of the interface pins

LiquidCrystal lcd(33, 24, 3,  4,  8, 2);

LedMatrix lm;
IntPattern testPattern;

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  lm.setup();
  //testPattern.setup();
  Timer1.initialize(1000);
  Timer1.attachInterrupt(refreshLeds);
  
}

byte pixelRefresh = 0;
int largestButton = 0;

long lastChange = 0;
int beatPosition = 0;

int refreshesEachPrint = 0;

void loop() {
  int modularpos = beatPosition % 16;
  if (millis() - lastChange > 250) {
    lastChange = millis();
    beatPosition++;
    lcd.setCursor(0, 0);
    //lcd.print("REA: "+String(refreshesEachPrint)+"<"+String(~(0xF<<5),BIN)+">" );
    //lcd.print(String(modularpos)+" is "+String(lm.buttonPressed(modularpos))+"<"+String(GPIOC_PDOR,HEX)+">" );
    lcd.print(String(largestButton, HEX) + "   ");
    lcd.setCursor(0, 1);
    lcd.print("tt: " + String(testPattern.getBitmap(),BIN));
    refreshesEachPrint = 0;
  }
  lm.sett((int)(1 << modularpos), 0x00);
  lm.sum(testPattern.getBitmap(), 0x00);
  
}

void eachPixel(byte x, byte y){}
void buttonPressed(byte x, byte y,int value){
  testPattern.addEvent(x,y);
}
void buttonNotPressed(byte x, byte y){
  testPattern.removeEvent(x);
}
void refreshLeds(void) {
  //testPattern=0xFFFF;
  //while (true) {
    
    
    refreshesEachPrint++;
    
    int thispress = lm.buttonPressed(pixelRefresh);

    byte thisRow=pixelRefresh/4;
    byte thisCol=pixelRefresh%4;
    eachPixel(thisCol, thisRow);
    if(pixelRefresh==0){
      largestButton = 0;
    }
    if(thispress>largestButton){
      largestButton = thispress;
    }
    
    if (thispress > 0x10) {
      buttonPressed(thisCol,thisRow,thispress);
      //testPattern |= (0x0001 << pixelRefresh);
      
    }else{
      buttonNotPressed(thisCol,thisRow);
      //testPattern &= ~(0x0001<<pixelRefresh);
      
    }
    
    //delay(100);
    
    lm.refresh(pixelRefresh);
    pixelRefresh++;
    pixelRefresh = pixelRefresh % 16;
    
    //delay(100);


  //}
}


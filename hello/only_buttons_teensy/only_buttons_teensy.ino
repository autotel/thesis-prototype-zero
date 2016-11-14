//https://forum.pjrc.com/threads/17532-Tutorial-on-digital-I-O-ATMega-PIN-PORT-DDR-D-B-registers-vs-ARM-GPIO_PDIR-_PDOR
// include the library code:
#include <TimerOne.h>
//#include "C:\Program Files (x86)\Arduino\hardware\teensy\avr\libraries\TimerOne\TimerOne.h"
#include <LiquidCrystal.h>
#include "ledMatrix.h"
// initialize the library with the numbers of the interface pins

LiquidCrystal lcd(33, 24, 3,  4,  8, 2);

LedMatrix lm;
void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  lm.setup();
  Timer1.initialize(200);
  Timer1.attachInterrupt(refreshLeds);

}

byte pixelRefresh = 0;
int largestButton = 0;

long lastChange = 0;
int beatPosition = 0;

int refreshesEachPrint = 0;

int testPattern = 0x0000;
void loop() {
  int modularpos = beatPosition % 16;
  if (millis() - lastChange > 2) {

    lastChange = millis();
    
    int thispress = lm.buttonPressed(beatPosition);
    if (thispress > 0x20) {
      largestButton = thispress;
      testPattern = (modularpos);
    }

    beatPosition++;
    lcd.setCursor(0, 0);
    //lcd.print("REA: "+String(refreshesEachPrint)+"<"+String(~(0xF<<5),BIN)+">" );
    //lcd.print(String(modularpos)+" is "+String(lm.buttonPressed(modularpos))+"<"+String(GPIOC_PDOR,HEX)+">" );
    lcd.print("last press"+String(testPattern, DEC) + "   ");
    lcd.setCursor(0, 1);
    lcd.print("beat: " + String(modularpos));
    refreshesEachPrint = 0;
  }



  //lm.refresh();

  //this is really slow!
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  //lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  //lcd.print(/*String( GPIOD_PDIR, BIN)+"-"+*/String( 0xa00|GPIOD_PDOR, BIN)+"-");

}

void refreshLeds(void) {
  //testPattern=0xFFFF;
  //while (true) {

    
    
    //delay(100);


  //}
}


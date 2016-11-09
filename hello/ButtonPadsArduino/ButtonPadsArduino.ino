#include <TimerOne.h>
#include <LiquidCrystal.h>
#include "ledMatrix.h"
// initialize the library with the numbers of the interface pins
//----------- lcd(23, 22, 16, 15, 14, 13);
LiquidCrystal lcd(33, 24, 3,  4,  16, 17);

LedMatrix lm;
void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  lm.setup();
  //set an interrupt for refreshing the leds. otherwise it flickers
  Timer1.initialize(40);
  Timer1.attachInterrupt(refreshLeds); 
}

long lastChange = 0;
int beatPosition = 0;

int refreshesEachPrint=0;
void loop() {
  if (millis() - lastChange > 250) {
    int modularpos=beatPosition % 16;
    lastChange = millis();
    lm.sett((int)(1 << modularpos),(int)0x0000);
    lm.sum((int)0x0000,(int) 0x8CA9);
    beatPosition++;
    lcd.setCursor(0, 0);
    lcd.print("REA: "+String(refreshesEachPrint));
    lcd.setCursor(0, 1);
    lcd.print("beat: "+String(beatPosition));
    refreshesEachPrint=0;
  }
  

  //this is really slow!
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  //lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  //lcd.print(/*String( GPIOD_PDIR, BIN)+"-"+*/String( 0xa00|GPIOD_PDOR, BIN)+"-");

}
byte pixelRefresh=0;
void refreshLeds(void){

  
  lm.refresh(pixelRefresh);
  pixelRefresh++;
  pixelRefresh=pixelRefresh%16;
}


//https://forum.pjrc.com/threads/17532-Tutorial-on-digital-I-O-ATMega-PIN-PORT-DDR-D-B-registers-vs-ARM-GPIO_PDIR-_PDOR
// include the library code:
#include <LiquidCrystal.h>
#include "ledMatrix.h"
// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(23, 22, 16, 15, 14, 13);
//LiquidCrystal lcd(33, 24, 3,  4,  16, 17);
LedMatrix lm;
void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  lm.setup();
}

long lastChange = 0;
int beatPosition = 0;

int refreshesEachPrint=0;
void loop() {
  if (millis() - lastChange > 200) {
    int modularpos=beatPosition % 16;
    lastChange = millis();
    lm.sett((int)(1 << modularpos), (int)(3 << modularpos));
    beatPosition++;
    lcd.setCursor(0, 0);
    lcd.print("REA: "+String(refreshesEachPrint));
    lcd.setCursor(0, 1);
    lcd.print("beat: "+String(beatPosition));
    refreshesEachPrint=0;
  }
  refreshesEachPrint++;
  lm.refresh();

  //this is really slow!
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  //lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  //lcd.print(/*String( GPIOD_PDIR, BIN)+"-"+*/String( 0xa00|GPIOD_PDOR, BIN)+"-");

}


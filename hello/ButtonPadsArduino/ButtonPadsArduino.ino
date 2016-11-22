#include <TimerOne.h>
#include "ledMatrix.h"
#include <LiquidCrystal.h>
LiquidCrystal lcd(13, 12, 11, 10, 9, 8);
LedMatrix lm;
void setup() {
  lm.setup();
  lcd.begin(16, 2);
  lcd.print("Sequencer");
  lcd.setCursor(0,1);
  lcd.print("transgression");
  Timer1.initialize(100);
  Timer1.attachInterrupt(refreshLeds);
}

byte pixelRefresh = 0;
int largestButton = 0;

long lastChange = 0;
int beatPosition = 0;
int refreshesEachPrint = 0;
int testPattern = 0x0a00;


void loop() {
  int modularpos = beatPosition % 16;
  if (millis() - lastChange > 250) {
    onBeat(modularpos);
    lastChange = millis();



    beatPosition++;

    
    
    //lm.diff(0x1<<modularpos,0,0);
    refreshesEachPrint = 0;
    lcd.setCursor(0,1);
    lcd.print("0x"+String(largestButton,HEX)+"---");
    largestButton=0;
    //testPattern=0;
  }

  //lm.sett((int)(1 << modularpos), 0xaa);
  //lm.sum((int)testPattern, 0x00);

}
void onBeat(int beatn) {

}

void refreshLeds(void) {

  int modularpos =beatPosition%16;
  //int thispress = lm.buttonPressed(pixelRefresh)
  int thispress = lm.refresh(pixelRefresh);
  
  
  
  if (thispress > largestButton) {
    largestButton = thispress;
  }
  
  if (thispress > 0xF) {
    testPattern |= (0x0001 << pixelRefresh);
  } else {
    //testPattern &= ~(0x0001<<pixelRefresh);
  }
  lm.sett(testPattern|(1<<modularpos), 1<<modularpos, testPattern|(1<<modularpos));
  //delay(100);

  pixelRefresh++;
  pixelRefresh = pixelRefresh % 64;
  //delay(100);


  //}
}


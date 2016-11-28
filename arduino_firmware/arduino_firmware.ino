
#include "ledMatrix.h"
#include <LiquidCrystal.h>
#include <TimerOne.h>
LiquidCrystal lcd(13, 12, 11, 10, 9, 8);
LedMatrix lm;
int pattern=0x0000;
int playhead=0x0001;

void setup() {
  lcd.begin(16, 2);
  lcd.print("Sequencer");
  lcd.setCursor(0,1);
  lcd.print("transgression");
  lm.setup();
  lm.onButtonPressed(onSequencerButtonPressed);
  lm.onButtonReleased(onSequencerButtonReleased);
  //initialize interrupt timer to redraw the leds
  Timer1.initialize(100);
  Timer1.attachInterrupt(refrsh);
}
int beatPosition=0;
long lastBeat=0;
void loop() {
  int modularpos = beatPosition % 16;
  if (millis() - lastBeat > 250) {
    lastBeat = millis();
    beatPosition++;
    lm.sett(0xFFFF,playhead<<modularpos,pattern);
  }
  
}
void refreshNextPixel() {
  int thispress = refresh(pixelRefresh);
  //a mask to select the corresponding bit on byteMaps[0]
  int currentBitMask = (0x0001 << pixelRefresh);
  //function to detect if the button changed it's state of pressed
  if (thispress > 0xF) {
    //if in the previous check this button was not pressed, means this button has just been pressed.
    if (byteMaps[0]&currentBitMask > 0) {
      byteMaps[0] |= currentBitMask;
      if (lem._buttonPressedCallback != 0)
        buttonPressedCallback(pixelRefresh);
    }
  } else {
    //if in the previous check this button was pressed, means it has just been released.
    if (byteMaps[0]&currentBitMask > 0) {
      byteMaps[0] &= ~currentBitMask;
      if (lem._buttonReleasedCallback != 0)
        buttonReleasedCallback(pixelRefresh);
    }
  }
  //lm.sett(testPattern|(1<<modularpos), 1<<modularpos, testPattern|(1<<modularpos));
  //delay(100);

  pixelRefresh++;
  pixelRefresh = pixelRefresh % 64;
}
void onSequencerButtonPressed(byte button){
  pattern|=1<<button;
  pattern=0xFFFF;
};
void onSequencerButtonReleased(byte button){
};

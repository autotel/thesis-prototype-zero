
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
  lem.onButtonPressed(onSequencerButtonPressed);
  lem.onButtonReleased(onSequencerButtonReleased);
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
void refrsh(){
  lm.refreshNextPixel();
}
void onSequencerButtonPressed(byte button){
  pattern|=1<<button;
  pattern=0xFFFF;
};
void onSequencerButtonReleased(byte button){
};

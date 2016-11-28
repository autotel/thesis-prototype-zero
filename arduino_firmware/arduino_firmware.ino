
#include "ledMatrix.h"
#include <LiquidCrystal.h>
#include <TimerOne.h>
//LiquidCrystal lcd(13, 12, 11, 10, 9, 8);
//LiquidCrystal lcd(9, 8, 13, 12, 11, 10);
//LiquidCrystal lcd(13, 12, 11, 10, 8, 9);
LiquidCrystal lcd(9, 8, 10, 11, 12, 13);
LedMatrix lm;
int pattern = 0x0000;
int playhead = 0x0001;

void setup() {
  lcd.begin(16, 2);
  lcd.print("Sequencer");
  lcd.setCursor(0, 1);
  lcd.print("transgression");
  lm.setup();
  //lm.onButtonPressed(onSequencerButtonPressed);
  //lm.onButtonReleased(onSequencerButtonReleased);
  //initialize interrupt timer to redraw the leds
  Timer1.initialize(200);
  Timer1.attachInterrupt(refreshNextPixel);
}
String watching = "";
int beatPosition = 0;
long lastBeat = 0;
void loop() {
  int modularpos = beatPosition % 16;
  if (millis() - lastBeat > 250) {
    lastBeat = millis();
    beatPosition++;
    lm.sett(0xFFFF, playhead << modularpos, pattern);
    lcd.setCursor(0, 1);
    lcd.print(watching + "-");
  }

}

void watch(String what)
{
  watching = what;
}
byte pixelRefresh = 0;
void refreshNextPixel() {
  int thispress = lm.refresh(pixelRefresh);
  //a mask to select the corresponding bit on byteMaps[0]
  int currentBitMask = (0x1 << pixelRefresh);
  //function to detect if the button changed it's state of pressed
  if (thispress > 0xF) {
    //if in the previous check this button was not pressed, means this button has just been pressed.
    watch(String(lm.byteMaps[0]&currentBitMask, HEX));

    if (!(lm.byteMaps[0] & currentBitMask)) {
      //pattern=0xff;
      lm.byteMaps[0] |= currentBitMask;
      buttonPressedCallback(pixelRefresh);
    }
    //lm.byteMaps[3] = lm.byteMaps[0];
  } else {
    //if in the previous check this button was pressed, means it has just been released.
    if (lm.byteMaps[0] & currentBitMask) {
      lm.byteMaps[0] &= ~currentBitMask;
      buttonReleasedCallback(pixelRefresh);
    }
  }
  //lm.sett(testPattern|(1<<modularpos), 1<<modularpos, testPattern|(1<<modularpos));
  //delay(100);

  pixelRefresh++;
  pixelRefresh = pixelRefresh % 64;
}
void buttonPressedCallback(byte button) {
  if (pattern & (1 << button)) {
    pattern &= ~(1 << button);
  } else {
    pattern |= 1 << button;
  }
  //  = (pattern | (1 << button));
  //pattern=0xFFFF;
};
void buttonReleasedCallback(byte button) {
  //pattern=0;
};

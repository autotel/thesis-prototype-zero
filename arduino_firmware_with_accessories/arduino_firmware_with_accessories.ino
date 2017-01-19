
#include "ledMatrix.h"
#include <LiquidCrystal.h>
#include <TimerOne.h>
#include <SoftwareSerial.h>

//SoftwareSerial mySerial(18, 19); // RX, TX

LiquidCrystal lcd(9, 8, 10, 11, 12, 13);
LedMatrix lm;
int pattern = 0x0000;
int playhead = 0x0001;

void setup() {
 // Serial.begin(9600);
  lcd.begin(16, 2);
  lcd.print(random()*0xFF);
  lcd.setCursor(0, 1);
  lcd.print("-");
  lm.setup();
  //lm.onButtonPressed(onSequencerButtonPressed);
  //lm.onButtonReleased(onSequencerButtonReleased);
  //initialize interrupt timer to redraw the leds
  Timer1.initialize(200);
  Timer1.attachInterrupt(refreshNextPixel);

  // set the data rate for the SoftwareSerial port
  //mySerial.begin(38400);

  pinMode(A6,INPUT_PULLUP);//encoder's
  pinMode(A7,INPUT_PULLUP);

  
  
}
String watching = "";
int beatPosition = 0;
long lastBeat = 0;
void loop() {
  
  int modularpos = beatPosition % 16;

  lm.sett(0xFFFF, playhead << modularpos, pattern);
  
  if (millis() - lastBeat > 250) {
    lastBeat = millis();
    beatPosition++;
    
    lcd.setCursor(0, 1);
    
    int numberwang=0b0;
   // for(int a=8; a<16; a++){
      //if(lm.readMuxB(a))
     // numberwang|=1<<a;
   // }
    lcd.print(watching+"-");//""+String(numberwang,BIN)+"-"+
    
    
    //Serial.print("heelooo");
    //mySerial.println("Hello, world?");
  }
  
}

void watch(String what)
{
  watching = what;
}
byte pixelRefresh = 0;
//readouts behind the mux last 4 addresses 
byte muxBS8=0x00;
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
  pixelRefresh = pixelRefresh % 32;
}
void buttonPressedCallback(byte button) {
  if (pattern & (1 << button)) {
    pattern &= ~(1 << button);
  } else {
    pattern |= 1 << button;
  }
  if(button>16){
    watch(String(button));
  }
  //  = (pattern | (1 << button));
  //pattern=0xFFFF;
};
void buttonReleasedCallback(byte button) {
  //pattern=0;
};

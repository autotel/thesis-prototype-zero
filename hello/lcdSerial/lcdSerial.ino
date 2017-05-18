

// include the library code:
#include <LiquidCrystal.h>
String lastRcv="";
// initialize the library with the numbers of the interface pins
//LiquidCrystal lcd(13, 12, 11, 10, 9, 8);
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("hello, world!");
  Serial.begin(19200);
}

void loop() {
  // when characters arrive over the serial port...
  if (Serial.available()) {
    // wait a bit for the entire message to arrive
    delay(100);
    // clear the screen
    lcd.clear();
    // read all the available characters
    while (Serial.available() > 0) {
      // display each character to the LCD
      lcd.write(Serial.read());
    }
  }
}


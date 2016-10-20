/* The library is not strictly needed, as taught here: 
 *  http://bildr.org/2012/08/rotary-encoder-arduino/
 *  
 *  
 *  
 *  Encoder Library - Basic Example
 * http://www.pjrc.com/teensy/td_libs_Encoder.html
 *
 * This example code is in the public domain.
 */


// include the library code:
#include <LiquidCrystal.h>
#include <Encoder.h>

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(23, 22, 16, 15, 14, 13);
//Encoder myEnc(17, 18);



void setup() {
  // set up the LCD's number of columns and rows: 
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("hello, world!");
  pinMode(17,INPUT);
  pinMode(18,INPUT);
}

void loop() {
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  lcd.print(String(millis()/1000)+"-"+String(/*myEnc.read()+*/12)+" <"+String(digitalRead(17))+"-"+String(digitalRead(18))+">");
}


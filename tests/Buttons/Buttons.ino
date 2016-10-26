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
  //lcd.print("hello, world!");
  pinMode(17,INPUT);
  pinMode(18,INPUT);
}
long value=0;
void loop() {
  if(digitalRead(17)){
    value++;
  }
  if(digitalRead(18)){
    value--;
  }
  lcd.setCursor(0, 0);
  // print the number of seconds since reset:
  lcd.print(value);
  lcd.setCursor(0,1);
  lcd.print("<"+String(PIND,HEX)+"> <"+String(PINC,HEX)+"> <"+String(PINB,HEX)+">");
}


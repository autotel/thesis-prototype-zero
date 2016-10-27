//https://forum.pjrc.com/threads/17532-Tutorial-on-digital-I-O-ATMega-PIN-PORT-DDR-D-B-registers-vs-ARM-GPIO_PDIR-_PDOR
// include the library code:
#include <LiquidCrystal.h>

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(23, 22, 16, 15, 14, 13);

void setup() {
  // set up the LCD's number of columns and rows: 
  lcd.begin(16, 2);
  //GPIOD_<<4
  pinMode(6,OUTPUT);
  pinMode(20,OUTPUT);
  pinMode(21,OUTPUT);
  pinMode(5,OUTPUT);
  //GPIOB_<<4
  pinMode(0,OUTPUT);
  pinMode(1,OUTPUT);
  pinMode(32,OUTPUT);
  pinMode(25,OUTPUT);
}
byte t=0;
long lastchange=0;
void loop() {
  
  if(millis()-lastchange>300){
    lastchange=millis();
    t++;
    //weird bitwise modulo for powers of two http://stackoverflow.com/questions/11076216/re-implement-modulo-using-bit-shifts
//   GPIOD_PDOR=0x10<<(t)%4;
     GPIOD_PDOR=(t%8|(t%8<<4));
     GPIOB_PDOR=~0x10000<<(t/4)%4;//((t/4)%16)+4;
  }
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  lcd.print(/*String( GPIOD_PDIR, BIN)+"-"+*/String( 0xa00|GPIOD_PDOR, BIN)+"-");
  
}


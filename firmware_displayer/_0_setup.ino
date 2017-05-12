//find midi communication at the bottom


#include <LiquidCrystal.h>
#include <SoftwareSerial.h>


//analog inputs that are connected to the multiplexor commons

#define analogA A1
#define analogB A0

//pins that are connected to the encoder A and B
//pc4 & pc5
#define encoder0PinA  A4
#define encoder0PinB  A5
volatile unsigned int encoder0Pos = 0;

//pins that are connected to the midi plugs as software serial
#define sIn A2
#define sOut A3
SoftwareSerial mySerial(sIn, sOut); // RX, TX

//text to print in screens
String screenA = "";
String screenB = "";
String lastScreenA = "";
String lastScreenB = "";

//flag that indicates that the screen should be redrawn when possible
bool screenChanged = true;

//the last button that has been pressed on the matrix buttons
unsigned char lastMatrixButtonPressed = 0;
//buttons that were pressed on last evaluation;
unsigned int pressedMatrixButtonsBitmap = 0x0000;
unsigned char pressedSelectorButtonsBitmap = 0x00;
//the buttons that are active while engaged in binary number input (ex. note selector)
unsigned int activePadInput = 0x0000;

LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

unsigned int layers [] = {0xffff, 0xffff, 0x0};

void setup() {
  //the perfect pulldown is 2.5K ohms
  //the analog port that will be connected to each mux A and B
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;

//pendant: probably can be faster
  mySerial.begin(SOFT_BAUDRATE);
  mySerial.write(TH_hello);

  //lcd screen initial write
  lcd.begin(16, 2);

  //encoder set up
  pinMode(encoder0PinA, INPUT);
  digitalWrite(encoder0PinA, HIGH);       // turn on pull-up resistor
  pinMode(encoder0PinB, INPUT);
  digitalWrite(encoder0PinB, HIGH);       // turn on pull-up resistor
  lcdPrintA("lcdA");
  lcdPrintB("lcdB");
}

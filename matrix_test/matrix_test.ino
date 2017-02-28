
void setup();
void change();
void refresh();
int refresh(byte);
void sum(int, int, int);
void diff(int, int, int);
void sett(int, int, int);
int buttonPressed(byte);
int analogA;
int analogB;
int _pin;
long lastchange;

byte currentPixel=0;

void setup() {
  //the perfect pulldown is 2.5K ohms
  //the analog port that will be connected to each mux A and B
  analogA = A1;
  analogB = A0;
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;
}

void loop() {
  
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
  nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

  nibbleB+=8;
  //ground & power the led
  //PORTC |= 0b1;
  //PORTC &= ~0b10;
  PORTD = (nibbleB << 4) | (nibbleA);

  switch (currentPixel/16){
    case 1:
    delayMicroseconds(1);
    break;
    case 2:
    delayMicroseconds(1);
    break;
    case 3:
    delayMicroseconds(10);
  }

  currentPixel++;
  currentPixel=currentPixel%64;
}

void updatePixel(){
}
void readButton(){}


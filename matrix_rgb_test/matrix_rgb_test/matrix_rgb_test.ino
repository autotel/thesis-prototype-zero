
void setup();
#define COMPENSATE_R 14
#define COMPENSATE_G 2
#define COMPENSATE_B 1

#define analogA A1
#define analogB A0

int _pin;
long lastchange;

char16_t gridImage [16] = {
  0xf00, 0xff0, 0x00f, 0xf00,
  0xff0, 0x0f0, 0x0ff, 0x0f0,
  0xf0f, 0x0ff, 0x00f, 0x00f,
  0xf00, 0x0f0, 0x00f, 0x000,

};

byte currentPixel = 0;

void setup() {
  //the perfect pulldown is 2.5K ohms
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;


}
long prevMillis=0;

void loop() {
  float mills = (millis() % 2048) / 8.00;
  /* for (byte a = 0; a < 16; a++) {
     gridImage[a] |= a%4*0x4;

     gridImage[a] |= (a%4)*0x4<<4;

     gridImage[a] |= (a%4)*0x4<<8;

    }*/
    
  if (prevMillis > millis() + 10) {
    prevMillis=millis();
    for (byte a = 0; a < 16; a++) {
      int m = 0;
      for (byte b = 0; b < 3; b++) {
        int sm = gridImage[a] >> b * 4;
        sm++;
        sm |= 0xf;
        m |= sm << b * 4;
      }
      gridImage[a] = m;
    }
  }
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;

  nibbleA &= (((currentPixel % 3) * 4) + (currentPixel % 12) / 3);
  nibbleB &= (currentPixel / 12);

  nibbleA += 4;
  nibbleB += 8;

  //mask out to get the current channel, in the gridimage that belongs to current puxel
  byte currentIntensity = 0xF & (gridImage[(currentPixel / 3) % 16] >> ((currentPixel % 3) * 4));
  if (currentIntensity > 0) {
    analogWrite(analogA, currentIntensity << 4);

    analogWrite(analogB, 0xf - currentIntensity);
    PORTD = (nibbleB << 4) | (nibbleA);

    switch (currentPixel % 3) {
      case 1:
        delayMicroseconds( COMPENSATE_B);
        break;
      case 2:
        delayMicroseconds( COMPENSATE_G);
        break;
      case 3:
        delayMicroseconds( COMPENSATE_R);
    }
  } else {
    digitalWrite(analogA, LOW);
    digitalWrite(analogB, HIGH);
  }
  // delay(300);
  currentPixel++;
  currentPixel = currentPixel % 48;
}

void updatePixel() {
}
void readButton() {}


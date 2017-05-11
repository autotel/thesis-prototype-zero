#define COMPENSATE_R 200
#define COMPENSATE_G 0
#define COMPENSATE_B 0

#define analogA A1
#define analogB A0


void setup() {
  // put your setup code here, to run once:
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);
  DDRD = 0xFF;

}
int count = 0;
int currentPixel=0;
void loop() {

  //esta variable establece un loop de 3 veces 16, para escanear los tres colores en las 16 luces.
  //al final del loop se le suma 1
  count = count % 48;
  //void updatePixel(byte count) {
  //update one pixel on one of the color channels behind the mux. Be aware that redPixel function exists
  currentPixel = count+0xf;
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel / 16;
  //calculate the two mux addresses
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12);
  nibbleB &= (currentPixel / 4) % 4;
  nibbleB += 8;
  //gives power to the leds
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);

  PORTD = (nibbleB << 4) | (nibbleA);

  switch (currentLayer) {
#if COMPENSATE_R > 0
    case 3:
      delayMicroseconds( COMPENSATE_R);
      break;
#endif
#if COMPENSATE_G > 0
    case 1:
      delayMicroseconds( COMPENSATE_G);
      break;
#endif
#if COMPENSATE_B > 0
    case 2:
      delayMicroseconds( COMPENSATE_B);
      break;
#endif
  }
  //}
  count++;
}

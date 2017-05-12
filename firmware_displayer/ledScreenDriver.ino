#define COMPENSATE_R 200
#define COMPENSATE_G 0
#define COMPENSATE_B 0
//update one pixel on one of the color channels behind the mux. Be aware that redPixel function exists
void updatePixel(unsigned char currentPixel) {
  currentPixel += 0xf;
  //nibble A is connected to the mux address for the anodes / btn inputs
  unsigned char nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  unsigned char nibbleB = 0xF;
  unsigned char currentLayer = currentPixel / 16;
  if ((layers[currentLayer-1] >> (currentPixel % 16)) & 0x1) {

    //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
    nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
    nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

    nibbleB += 8;
    //ground & power the led. strangely still works without these lines

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

  }
}

//just draw a pixel disregarding the layer information
void turnPixelOn(unsigned char currentPixel) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  unsigned char nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  unsigned char nibbleB = 0xF;
  unsigned char currentLayer = currentPixel >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
  nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

  nibbleB += 8;
  //ground & power the led
  /*PORTC |= 0b1;
    PORTC &= ~0b10;*/
  PORTD = (nibbleB << 4) | (nibbleA);
}

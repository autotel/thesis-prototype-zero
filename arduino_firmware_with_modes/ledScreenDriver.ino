//update one pixel on one of the color channels behind the mux. Be aware that redPixel function exists
void updatePixel(byte currentPixel) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;
  if ((layers[currentLayer] >> currentPixel % 16) & 0x0001) {

    //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
    nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
    nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

    nibbleB += 8;
    //ground & power the led. strangely still works without these lines
    /*PORTC |= 0b10;
      PORTC &= ~0b1;*/

    PORTD = (nibbleB << 4) | (nibbleA);

  }
}

//just draw a pixel disregarding the layer information
void turnPixelOn(byte currentPixel) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
  nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

  nibbleB += 8;
  //ground & power the led
  /*PORTC |= 0b1;
    PORTC &= ~0b10;*/
  PORTD = (nibbleB << 4) | (nibbleA);
}

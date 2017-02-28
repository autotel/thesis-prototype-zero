//read one button behind the multiplexor to check whether is pressed or not.
int readMatrixButton(byte currentButton) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  //byte currentLayer = currentButton >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentButton % 4);
  nibbleB &= (currentButton / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  pinMode(analogB, INPUT);
  digitalWrite(analogA, HIGH);
  //PORTC |= 0b10;
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}

bool readMuxB(byte address) {
  //nibbleA in this case is only to avoid writing to muxA
  byte nibbleA = PORTD & 0xF;
  //nibbleB will contain the address for the mux B
  byte nibbleB = address & 0xF;
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  //now that we are connected to the mux, read the input
  pinMode(analogB, INPUT);
  bool ret = digitalRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}

//untested
int analogReadMuxB(byte address) {
  //nibbleA in this case is only to avoid writing to muxA
  byte nibbleA = PORTD & 0xF;
  //nibbleB will contain the address for the mux B
  byte nibbleB = address & 0xF;
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  //now that we are connected to the mux, read the input
  pinMode(analogB, INPUT);
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}
byte enc_last = 0;
//this would be an array, but a byte has enough space
byte grayToBinary = 0b10110100;
//read encoder. sourced from http://playground.arduino.cc/Main/RotaryEncoders#Example2
void doEncoder() {
  //encread turns around as follows: <- 0,1,3,2 ->
  //upon conversion it will turn as: <- 0,1,2,3 ->
  //pendant: we should compare using the gray code, is more economic than converting each time
  byte enc_read = (grayToBinary >> ( ( (PINC >> 4) & 0x3) * 2 ) ) & 0x3;
  if (enc_read != enc_last) {
    signed char enc_inc = enc_read - enc_last;

    if (enc_inc > 2) {
      enc_inc = -1;
    }
    if (enc_inc < -2) {
      enc_inc = +1;
    }

    encoder0Pos += enc_inc;
    onEncoderScroll(encoder0Pos, enc_inc);
    enc_last = enc_read;
    //lcdPrintB(String(enc_read, HEX)+"-"+String(encoder0Pos, HEX)+"-"+String(enc_inc, HEX));
  }



}


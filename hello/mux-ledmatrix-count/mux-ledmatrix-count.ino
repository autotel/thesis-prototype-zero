void setup() {
  // put your setup code here, to run once:
  DDRD=0xFF;
}
int a=0;
void loop() {
  byte nibbleA=0x0F;
  byte nibbleB=0xF0;
  nibbleA&=a%4;
  nibbleB&=~0x10<<((a/4)%4);
  PORTD=nibbleA|nibbleB;
  a++;
  //otherwise a overflows
  a=a%16;
  //delay(100);
}

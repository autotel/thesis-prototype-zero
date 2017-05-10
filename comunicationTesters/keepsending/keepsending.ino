#include <SoftwareSerial.h>

SoftwareSerial mySerial(A2,A3); // RX, TX
long lastRcv=0;
long elapsed=0;
void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  mySerial.begin(9600);
}
int c=0;
void loop() {
  mySerial.write(c);
  c++;
  delay(200);
}

#include <SoftwareSerial.h>

SoftwareSerial mySerial(A2,A3); // RX, TX
long lastRcv=0;
long elapsed=0;
void setup() {
  Serial.begin(57600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  mySerial.begin(4800);
}

void loop() {
  if (Serial.available()){
    char rcv=(char)Serial.read();
    Serial.println("received, sending");
    Serial.write((char)rcv);
    mySerial.write((char)rcv);
  }
  if (mySerial.available()) {
    long starting=micros();
    char rcv=mySerial.read();
    mySerial.write((char)rcv+1);
    elapsed=micros()-starting;
    Serial.println(String((char)rcv,BIN)+" is "+(char)rcv+" El:"+elapsed);
    delay(500);
  }
}

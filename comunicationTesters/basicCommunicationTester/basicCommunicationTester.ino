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

void loop() {
  
  if (Serial.available()){
    char rcv=(char)Serial.read();
    Serial.println("received, sending");
    Serial.write((char)rcv);
    //mirror serial into virtual serial
    mySerial.write((char)rcv);
  }
  String stringRecieved="";
  if (mySerial.available()) {
    long starting=micros();
    char rcv=mySerial.read();
    //respond in the same serial
    //mySerial.write((char)rcv+1);
    elapsed=micros()-starting;
    stringRecieved+=((char)rcv);
    delay(1);
  }
  //respond in the same serial
  if(stringRecieved!=""){
    mySerial.write(0x37);
  }
}

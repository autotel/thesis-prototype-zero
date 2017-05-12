#define serialInLength 16
byte serialIn[serialInLength];
boolean serialInLocked = false;
void checkMessages() {

  int bnum = 0;
  byte inHeader = 0;
  if (!serialInLocked)
    while (mySerial.available() && (bnum < serialInLength)) {
      //if (bnum == 0) {
      //inHeader = mySerial.read();
      //} else {
      serialIn[bnum] = mySerial.read();
      //}
      bnum++;
      //pendant: split message based on declared message lengths instead of the shitty delay
      delayMicroseconds(100);
    }
  if (bnum)
    messageReceived( serialIn, bnum);

}


void sendToBrain(byte header, byte datarray [], int len) {
  //wait until lastserial-millis>serialSeparationTime,
  //but hopefuilly not pausing the program

  mySerial.write(header);
  for (int a = 0; a < len; a++) {
    mySerial.write(datarray[a]);
  }

  lastSerial = millis();
}


String arrToString(byte arr[], int len) {
  String ret = ">";
  for (int a; a < len; a++) {
    ret += arr[a];
  }
  return ret;
}


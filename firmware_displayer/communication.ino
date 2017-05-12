#define serialInLength 32
byte serialIn[serialInLength];
boolean serialInLocked=false;
void checkMessages() {

  int bnum = 0;
  byte inHeader = 0;
  if(!serialInLocked)
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
//react and split messages
void messageReceived(byte datarray [], int len) {
  lcdPrintB(String(datarray[0],HEX));
  serialInLocked=true;
  int a = 0;
  //lcdPrintB(String(len));
  while (a < len) {
    byte currentHeader = datarray[a];
    a++;
    switch (currentHeader) {
      case RH_hello: {
          lcdPrintA("rcv hello");
          break;
        }
      case RH_ledMatrix: {
        lcdPrintA("rcv ledmatrix");
          layers[0] = datarray[a + 0] | (datarray[a + 1] << 8);
          layers[1] = datarray[a + 2] | (datarray[a + 3] << 8);
          layers[2] = datarray[a + 4] | (datarray[a + 5] << 8);
          a += RH_ledMatrix_len;
          break;
        }/*
      case RH_screenA: {
          int b=0;
          while ((datarray[a] != EOMessage) && b<16) {
            screenA [a]= (byte)datarray[a];
            b++;
            a++;
          }
          screenChanged = true;
          break;
        }
      case RH_screenB: {
          int b=0;
          while ((datarray[a] != EOMessage) && b<16) {
            screenB [a]= (byte)datarray[a];
            b++;
            a++;
          }
          screenChanged = true;
          break;
        }*/
      default:
        a++;
    }
  }
  serialInLocked=false;
}

String arrToString(byte arr[], int len) {
  String ret = ">";
  for (int a; a < len; a++) {
    ret += arr[a];
  }
  return ret;
}


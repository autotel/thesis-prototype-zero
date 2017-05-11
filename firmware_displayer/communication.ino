#define serialInLength 16
int serialIn[serialInLength];
void checkMessages(){
  int bnum = 0;
  byte inHeader = 0;
  while (mySerial.available() && bnum < serialInLength) {
    if (bnum == 0) {
      inHeader = mySerial.read();
    } else {
      serialIn[bnum - 1] = mySerial.read();
    }
    bnum++;
    //pendant: split message based on declared message lengths instead of the shitty delay
    delayMicroseconds(100);
  }
  messageReceived(inHeader, serialIn, bnum);
}


void sendToBrain(char header, char datarray [], int len) {
  //wait until lastserial-millis>serialSeparationTime,
  //but hopefuilly not pausing the program

  mySerial.write(header);
  for (int a = 0; a < len; a++) {
    mySerial.write(datarray[a]);
  }

  lastSerial = millis();
}

void messageReceived(char header, int datarray [], int len) {
  switch (header) {
    case RH_hello:
      lcdPrintA("connected");
      break;
    case RH_ledMatrix:
      layers[0] = datarray[0] | (datarray[1] << 8);
      layers[1] = datarray[2] | (datarray[3] << 8);
      layers[2] = datarray[4] | (datarray[5] << 8);
      break;
    case RH_screenA:
      lcdPrintA(arrToString(datarray, len));
      break;
    case RH_screenB:
      lcdPrintB(arrToString(datarray, len));
      break;
  }
}

String arrToString(int arr[], int len) {
  String ret = ">";
  for (int a; a < len; a++) {
    ret += arr[a];
  }
  return ret;
}


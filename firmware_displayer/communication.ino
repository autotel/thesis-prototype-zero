#define serialInLength 16
int serialIn[serialInLength];
void checkMessages(){
  unsigned int bnum = 0;
  int inHeader = 0;
  //idea: bnum<currentLength :)
  while (mySerial.available() && bnum < serialInLength) {
    if (bnum == 0) {
      inHeader =  mySerial.read();
    } else {
      serialIn[bnum - 1] = mySerial.read();
    }
    bnum++;
    //pendant: message ending shouldn't be marked by a pause in time, rather by a special char.
    delayMicroseconds(100);
  }
  if(bnum)
    messageReceived(inHeader, serialIn, bnum);
}

void messageReceived(int header, int datarray [], unsigned int len) {
  lcdPrintB(String(header,HEX));
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
      // lcdPrintA(arrToString(datarray, len));
      break;
    case RH_screenB:
      // lcdPrintB(arrToString(datarray, len));
      break;
    case RH_currentStep:
      layers[0] = datarray[0] | (datarray[1] << 8);
      lcdPrintB(String(header,HEX)+"-"+String(datarray[0],HEX));
      break;
    case 7:
      // layers[0] = datarray[0] | (datarray[1] << 8);
      lcdPrintB(String(header,HEX)+"-"+String(datarray[0],HEX));
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

void sendToBrain(unsigned char header, unsigned char datarray [], int len) {
  //wait until lastserial-millis>serialSeparationTime,
  //but hopefuilly not pausing the program
  mySerial.write(header);
  for (int a = 0; a < len; a++) {
    mySerial.write(datarray[a]);
  }
}


#define serialInLength 16
unsigned char serialIn[serialInLength];
boolean serialInLocked=false;
boolean screenTestMode=false;
void checkMessages() {

  int bnum = 0;
  unsigned char inHeader = 0;
  if(!serialInLocked)
  if (Serial.available()) {
    delay(100);
    while (Serial.available() && (bnum < serialInLength)) {
      //if (bnum == 0) {
      //inHeader = Serial.read();
      //} else {
      serialIn[bnum] =  Serial.read();
      //condition to enter screen typing mode
      // if(bnum==0)
      //   if(serialIn[bnum]==RH_comTester){
      //     screenTestMode=true;
      //   }
      // if(screenTestMode){
      //
      // }
      //}
      bnum++;
      //pendant: split message based on declared message lengths instead of the shitty delay
      delayMicroseconds(100);
    }
  }
  // screenTestMode=false;
  if (bnum)
    messageReceived(serialIn, bnum);

}


void sendToBrain(byte header, byte datarray [], int len) {
  serialInLocked=true;
  Serial.write(header);
  for (int a = 0; a < len; a++) {
    Serial.write(datarray[a]);
  }
  serialInLocked=false;
}


//react and split messages
void messageReceived(unsigned char datarray [], int len) {
  //lcdPrintB(String(datarray[0],HEX));
  serialInLocked=true;
  int a = 0;
  lcdPrintB("L"+String(len)+"[1]"+String(datarray[1]));
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
          //layers[0]=layers[1]=layers[2]=datarray[a];
          layers[0] = datarray[a + 0] | (datarray[a + 1] << 8);
          layers[1] = datarray[a + 2] | (datarray[a + 3] << 8);
          layers[2] = datarray[a + 4] | (datarray[a + 5] << 8);
          a += RH_ledMatrix_len;
          //lcdPrintB("B"+String(layers[0],HEX)+"C"+(char)layers[0]);
          break;
        }
      case RH_comTester: {
        lcdPrintA("com test");
        lcdPrintB(String(datarray[a],HEX));
        break;
      }
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


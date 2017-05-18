#define serialInLength 32
unsigned char inBuff[serialInLength];

bool recordingBuffer=false;
int expectedLength=0;
unsigned char currentHeader=0;
int byteNumber = 0;


void checkMessages() {
  while (Serial.available() && (byteNumber < serialInLength)) {
    //delayMicroseconds(100);
    unsigned char data_a=Serial.read();

    if(!recordingBuffer){
      //we are expecting a message header, so we check what header current byte is
      //if is successfull, we start gathering or recording a new data packet.

      //byte  is in our header list?
      switch (data_a) {
        case RH_null:
          lcdPrintA("H_null");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_null_len+1;
          break;
        case RH_hello:
          lcdPrintA("H_hello");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_hello_len+1;
          break;
        case RH_ledMatrix:
          lcdPrintA("dMatrix");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_ledMatrix_len+1;
          break;
        case RH_screenA:
          lcdPrintA("screenA");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_screenA_len+1;
          break;
        case RH_screenB:
          lcdPrintA("screenB");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_screenB_len+1;
          break;
        case RH_setInteractionMode:
          lcdPrintA("ionMode");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_setInteractionMode_len+1;
          break;
        case RH_currentStep:
          lcdPrintA("entStep");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_currentStep_len+1;
          break;
        case RH_comTester:
          lcdPrintA("mTester");
          currentHeader=data_a;
          recordingBuffer=true;
          expectedLength=RH_comTester_len+1;
          break;
      }
    }

    if(recordingBuffer){
      if(byteNumber<expectedLength-1){
        //a new byte arrived and is added to the current packet
        inBuff[byteNumber] =  data_a;
        byteNumber++;
      }else{
        //a whole expected packet arrived
        inBuff[byteNumber]=data_a;
        recordingBuffer=false;
        lcdPrintB("L:"+String(byteNumber)+"ex"+(expectedLength-1));
        messageReceived(currentHeader,inBuff,byteNumber);
        byteNumber=0;
        currentHeader=0;
      }
    }else{
      //a byte arrived, but there is no packet gathering bytes
      lcdPrintA("inv");
      lcdPrintB(String(data_a)+"ex"+expectedLength+"len:"+byteNumber);
    }
    // byteNumber++;
  }

  // if (byteNumber)
  //   messageReceived(inBuff, byteNumber);

}


void sendToBrain(byte header, byte datarray [], int len) {
  Serial.write(header);
  for (int a = 0; a < len; a++) {
    Serial.write(datarray[a]);
  }
}


//react and split messages
void messageReceived(unsigned char header,unsigned char datarray [], int len) {
  int a = 1;
  switch (header) {
    while (a < len) {
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
}

String arrToString(byte arr[], int len) {
  String ret = ">";
  for (int a; a < len; a++) {
    ret += arr[a];
  }
  return ret;
}


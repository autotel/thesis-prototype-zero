
void sendToBrain(char header, int datarray [], int len) {
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


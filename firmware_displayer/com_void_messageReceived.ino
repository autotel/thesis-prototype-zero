void messageReceived(byte datarray [], int len) {
  int a = 0;
  //lcdPrintB(String(len));
  while (a < len) {
    byte currentHeader = datarray[a];
    a++;
    switch (currentHeader) {
      case RH_null: {
          break;
        }
      case RH_hello: {
          lcdPrintA("rcv hello");
          break;
        }
      case RH_ledMatrix: {
          layers[0] = datarray[a + 0] | (datarray[a + 1] << 8);
          layers[1] = datarray[a + 2] | (datarray[a + 3] << 8);
          layers[2] = datarray[a + 4] | (datarray[a + 5] << 8);
          a += RH_ledMatrix_len;
          break;
        }
      case RH_screenA: {
          break;
        }
      case RH_screenB: {
          break;
        }
      case RH_mode_none: {
          currentInterface=face_none;
          break;
        }
      case RH_mode_perform: {
          lcdPrintA("perform mode");
          currentInterface=face_performer;
          a += RH_mode_perform_len;
          break;
        }
      case RH_mode_sequencer: {
          lcdPrintA("sequencer mode");
          currentInterface=face_sequencer;
          a += RH_mode_sequencer_len;
          break;
        }
      case RH_mode_scale: {
          lcdPrintA("scale mode");
          currentInterface=face_scale;
          a += RH_mode_scale_len;
          break;
        }
      case RH_currentStep: {
          currentStep=datarray[1];
          break;
          a += RH_currentStep_len;
        }
      case RH_interfaceMap: {
          currentInterfaceMap[datarray[a]] = datarray[a + 1] | (datarray[a + 2] << 8);
          a += RH_interfaceMap_len;
          break;
        }
      default:        a++;
    }
  }
}

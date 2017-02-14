
unsigned int graph_debug = 0x00;
int currentStep16 = 0;
int currentStep16x12 = 0;
int loop128 = 0;
void loop() {
  if (mySerial.available()) {
    byte midiHeader = mySerial.read();
    if (m_recording) {
      if ((midiHeader & 0xF0) == 0x90) {
        sequence[currentStep16][0] = midiHeader;//pendant: this is not right implementation of midi in
        sequence[currentStep16][1] =  mySerial.read();
        sequence[currentStep16][2] =  mySerial.read();
      }
    }
    //clock
    if (midiHeader == 0xF8) {
      currentStep16x12 = (currentStep16x12 + 1) % (16 * 12);
      if (currentStep16x12 % 12 == 0) {
        currentStep16 = currentStep16x12 / 12;

      }
    }
    //start
    if (midiHeader == 0xFA) {
      currentStep16x12 = 0;
      currentStep16 = 0;
    }
  }



  evaluateSequence();
  if (loop128 % 4 == 0)
    timedLoop();

  loop128++;
  loop128 %= 128;
}




void draw() {
  byte selectedGraph = 0;
  if (selector_mode || selector_a || selector_b || selector_c) {
    switch (m_mode) {
      case 0:
        if (selector_a) {
          selectedGraph = 16;
        } else if (selector_b) {
          selectedGraph = 1;
        } else if (selector_c) {
          selectedGraph = 0;
        }
        break;
    }
    unsigned int graph [] = {0, 0};
    modifierGraph(selectedGraph, graph);
    layers[1] = graph [0];
    layers[2] = graph [1];
  } else {
    switch (m_mode) {
      case 4:
        layers[2] = structure_scales[se_selectedScale][2]^graph_fingers;
        layers[1] = structure_scales[se_selectedScale][2];
        //this because is just nice to see how the scale patterns up
        layers[2]|=layers[2]<<12;
        layers[1]|=layers[1]<<12;
        break;

      default:
        layers[2] = graph_sequence;
        layers[1] = graph_fingers;

        layers[1] |= graph_pointer;
        layers[2] |= graph_fingers;

        layers[0] = 0xFFFF;
        // layers[1]|=graph_debug;
        layers[2] |= graph_debug;
        break;
    }
  }
  if (screenChanged) {
    screenChanged = false;
    if (lastScreenA != screenA) {
      lastScreenA = screenA;
      lcd.setCursor(0, 0);
      lcd.print(screenA);

      for (byte strl = 16 - screenA.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
    if (lastScreenB != screenB) {
      lastScreenB = screenB;
      lcd.setCursor(0, 1);
      lcd.print(screenB);
      for (byte strl = 16 - screenB.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
  }
}


byte cp64 = 0;




void timedLoop() {
  //evaluate matrix buttons
  byte cp16 = cp64 % 16;
  byte cp32 = cp64 % 32;

  int buttonPressure = readMatrixButton(cp16);
  int evaluator = 0x1 << cp16;
  if (buttonPressure > 1) {
    //if last lap this button was not pressed, trigger on  button pressed
    if ((evaluator & pressedMatrixButtonsBitmap) == 0) {
      pressedMatrixButtonsBitmap |= evaluator;
      onMatrixButtonPressed(cp16, buttonPressure);
    } else {
      onMatrixButtonHold(cp16, buttonPressure);
    }
  } else {
    if ((evaluator & pressedMatrixButtonsBitmap) != 0) {
      pressedMatrixButtonsBitmap &= ~(0x1 << cp16);
      onMatrixButtonReleased(cp16);
    }
  }
  /*layers[0]=readMatrixButton(3);
    layers[1]=readMatrixButton(1);
    layers[2]=readMatrixButton(2);*/





  updatePixel(cp32 + 0xF); //using 32 instead of 64 for more light at cost of the red channel


  //evaluate Selector buttons (the tact buttons on top of the matrix)
  //less frequently than matrix, because these are not performance buttons
  if (cp16 == 0) {
    //cp64/16 will be 0,1,2,3 alernatingly each time cp16 is 0
    int cb_4 = cp64 / 0xf;
    //see previous use of this var for more reference
    evaluator = 0x1 << cb_4;
    if (readMuxB(cb_4 + 4)) {
      //if last lap this button was not pressed, trigger on  button pressed
      if ((evaluator & pressedSelectorButtonsBitmap) == 0) {
        pressedSelectorButtonsBitmap |= evaluator;
        onSelectorButtonPressed(cb_4);
      } else {
        onSelectorButtonHold(cb_4);
      }
    } else {
      if ((evaluator & pressedSelectorButtonsBitmap) != 0) {
        pressedSelectorButtonsBitmap &= ~(0x1 << cb_4);
        onSelectorButtonReleased(cb_4);
      }
    }
  }

  if (cp64 == m_mode) {
    draw();
  }

  cp64++;
  cp64 = cp64 % 64;


}

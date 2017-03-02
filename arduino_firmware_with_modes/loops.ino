

int loop128 = 0;
void loop() {
  if (mySerial.available()) {
    byte midiHeader = mySerial.read();
    if (m_recording) {
      if ((midiHeader & 0xF0) == 0x90) {
        /*seq_ence[0][seq_currentStep16][0] = 0x1;
          seq_ence[0][seq_currentStep16][1] = midiHeader;//pendant: this is not right implementation of midi in
          seq_ence[0][seq_currentStep16][2] =  mySerial.read();
          seq_ence[0][seq_currentStep16][3] =  mySerial.read();*/
      }
    }
    //clock
    if (midiHeader == 0xF8) {
      seq_currentStep128x12  = (seq_currentStep128x12  + 1) % (128 * 12);
      recalculateSeqSteps();
      if (seq_currentStep128x12 % 6 == 0) {
        evaluateSequence();
      }
    }
    //start
    if (midiHeader == 0xFA) {
      seq_currentStep128x12 = 0;
      recalculateSeqSteps();
    }
  }
  if (loop128 % 4 == 0) {

    timedLoop();

  }

  loop128++;
  loop128 %= 128;
}






byte cp64 = 0;
byte cp48 = 0;
byte cp49 = 0;
void timedLoop() {
  //evaluate matrix buttons
  cp64 = cp64 % 64;
  byte cp16 = cp64 % 16;
  byte cp32 = cp64 % 32;
  cp48 = cp48 % 48;
  cp49 = cp49 % 49;
  byte buttonPressure = (byte)(readMatrixButton(cp16) / 2);
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

  updatePixel(cp49);


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
  doEncoder();
  /* encoder needs to be connected the other way around, because muxB is pulled down
    if (cp16 == 0) {
    //encoder is soldered to muxB12
    //see previous use of this var for more reference
    evaluator = 0x1;
    //encoder button needs internal pullup and works reverse logic
    digitalWrite(A0,HIGH);
    if (!readMuxB(11)) {
      //if last lap this button was not pressed, trigger on  button pressed
      if ((evaluator & pressedSelectorButtonsBitmap) == 0) {
        pressedSelectorButtonsBitmap |= evaluator;
        onSelectorButtonPressed(4);
      } else {
        onSelectorButtonHold(4);
      }
    } else {
      if ((evaluator & pressedSelectorButtonsBitmap) != 0) {
        pressedSelectorButtonsBitmap &= ~(0x1);
        onSelectorButtonReleased(4);
      }
    }
    }*/

  if (cp64 == m_mode) {
    draw();
  }

  cp64++;

  cp48++;
  cp49++;
}



void draw() {
  byte selectedGraph = 0;
  if (selector_mode || selector_a || selector_b || selector_c) {
    switch (m_mode) {
      case MODE_PERF:
        if (selector_a) {
          selectedGraph = SELECTORGRAPH_POV;
        } else if (selector_b) {
          selectedGraph = SELECTORGRAPH_BINARY;
        } else if (selector_c) {
          selectedGraph = SELECTORGRAPH_POINT;
        }
        break;
      case MODE_SEQ:
        if (selector_a) {
          selectedGraph = SELECTORGRAPH_POV;
        } else if (selector_b) {
          selectedGraph = SELECTORGRAPH_BINARY;
        } else if (selector_c) {
          selectedGraph = SELECTORGRAPH_POINT;
        }
        break;
    }
    if(selector_mode)
    selectedGraph=SELECTORGRAPH_MODE;
    modifierGraph(selectedGraph, layers);
  } else {
    //green, blue, red
    switch (m_mode) {
      /*case 0:
        layers[2] = structure_scales[se_selectedScale][2] ^ graph_fingers;
        layers[1] = structure_scales[se_selectedScale][2];
        //this because is just nice to see how the scale patterns up
        layers[2] |= structure_scales[se_selectedScale][2] << 12;
        layers[1] |= structure_scales[se_selectedScale][2] << 12;
        break;*/
      case 1:
        updateSequenceGraph();
        layers[0] = graph_sequence;
        layers[1] = graph_sequence ^ graph_fingers;

        layers[1] |= graph_pointer;


        layers[2] = graph_pointer;
        break;
      case 4:
        layers[1] = structure_scales[se_selectedScale][2] ^ graph_fingers;
        layers[0] = structure_scales[se_selectedScale][2];
        layers[2] = structure_scales[se_selectedScale][2];
        //this because is just nice to see how the scale patterns up
        layers[1] |= layers[2] << 12;
        layers[0] |= layers[1] << 12;


        break;
      default:
        layers[1] = 0xFFFF ^ graph_fingers;
        layers[0] = 0xFFFF;
        // layers[1]|=graph_debug;
        layers[2] |= structure_scales[se_selectedScale][2];
        break;
    }
  }
  if (screenChanged) {
    screenChanged = false;
    if (lastScreenA != screenA) {
      if (screenA.length() > 16)
        screenA = screenA.substring(0, 16);
      lastScreenA = screenA;
      lcd.setCursor(0, 0);
      lcd.print(screenA);

      for (byte strl = 16 - screenA.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
    if (lastScreenB != screenB) {
      if (screenB.length() > 16)
        screenB = screenB.substring(0, 16);

      lastScreenB = screenB;
      lcd.setCursor(0, 1);
      lcd.print(screenB);

      for (byte strl = 16 - screenB.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
  }
}

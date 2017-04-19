

int loop128 = 0;
void loop() {
  if (mySerial.available()) {
    mySerial.write((char)mySerial.read()+1);
  }

  if (loop128 % 4 == 0) {

    timedLoop();

  }

  loop128++;
  loop128 %= 128;
}





byte cp128 = 0;
byte cp64 = 0;
byte cp48 = 0;
byte cp49 = 0;
byte cp16 = 0;
void timedLoop() {
  //evaluate matrix buttons
  cp128 = cp128 % 128;
  cp64 = cp128 % 64;
  cp16 = cp64 % 16;
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
    byte cb_4 = cp64 / 0xf;
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
      //if in last lap this button was pressed but in this lap is not
      if ((evaluator & pressedSelectorButtonsBitmap) != 0) {
        pressedSelectorButtonsBitmap &= ~(0x1 << cb_4);
        onSelectorButtonReleased(cb_4);
      }
    }
  }
  doEncoder();
  if (cp128 == m_mode) {
    draw();
  }

  cp128++;

  cp48++;
  cp49++;
}



void draw() {

  if (selector_current == SELECTOR_NONE) {
    //green, blue, red
    switch (m_mode) {
 
      case 1:

        updateSequenceGraph();
        layers[0] = graph_sequence | graph_fingers;
        layers[1] = graph_sequence | graph_fingers;

        layers[1] |= graph_pointer;
        layers[2] = graph_pointer | graph_fingers | graph_sequence2;
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
  } else {
    byte selectedGraph = 0;
    switch (selector_current) {
      case SELECTOR_MODE:
        selectedGraph = SELECTORGRAPH_MODE;
        break;
      case SELECTOR_POV:
        selectedGraph = SELECTORGRAPH_POV;
        break;
      case SELECTOR_NOTE:
        selectedGraph = SELECTORGRAPH_BINARY;
        break;
      case SELECTOR_CHANNEL:
        selectedGraph = SELECTORGRAPH_POINT;
        break;
      case SELECTOR_MODULUS:
        selectedGraph = SELECTORGRAPH_BINARY;
        break;
    }
    modifierGraph(selectedGraph, layers);
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

int loop128 = 0;
void loop() {
  if (loop128 % 2 == 1) {
    checkMessages();
  }
  if (loop128 % 8 == 0) {
    timedLoop();
  }
  loop128++;
  loop128 %= 128;
}

unsigned char cp128 = 0;
unsigned char cp64 = 0;
unsigned char cp48 = 0;
unsigned char cp49 = 0;
unsigned char cp16 = 0;
void timedLoop() {
  //evaluate matrix buttons
  cp128 = cp128 % 128;
  cp64 = cp128 % 64;
  cp16 = cp64 % 16;
  unsigned char cp32 = cp64 % 32;
  cp48 = cp48 % 48;
  cp49 = cp49 % 49;
  unsigned char buttonPressure = (unsigned char)(readMatrixButton(cp16) / 2);
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
  updatePixel(cp49);

  //evaluate Selector buttons (the tact buttons on top of the matrix)
  //less frequently than matrix, because these are not performance buttons
  if (cp49 == 0) {
    //cp64/16 will be 0,1,2,3 alernatingly each time cp16 is 0
    unsigned char cb_4 = cp64 / 0xf;
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
  if (cp128 == 2) {
    draw();
  }
  cp128++;
  cp48++;
  cp49++;
}



void draw() {
  if (screenChanged) {
    screenChanged = false;
    if (lastScreenA != screenA) {
      if (screenA.length() > 16)
        screenA = screenA.substring(0, 16);
      lastScreenA = screenA;
      lcd.setCursor(0, 0);
      lcd.print(screenA);

      for (unsigned char strl = 16 - screenA.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
    if (lastScreenB != screenB) {
      if (screenB.length() > 16)
        screenB = screenB.substring(0, 16);

      lastScreenB = screenB;
      lcd.setCursor(0, 1);
      lcd.print(screenB);

      for (unsigned char strl = 16 - screenB.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
  }
}

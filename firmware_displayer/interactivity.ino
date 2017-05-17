

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, byte buttonPressure) {
  //int sData[]={button,buttonPressure,pressedMatrixButtonsBitmap};
  //sendToBrain(TH_buttonMatrixHold,sData,3);
}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
  byte sData[]={button,1,(byte)pressedMatrixButtonsBitmap,(byte)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrixPressed,sData,TH_buttonMatrixPressed_len);
}


//actions to take once a button is pressed

void onMatrixButtonPressed(byte button, int buttonPressure) {
  byte sData[]={button,(byte) buttonPressure,(byte)pressedMatrixButtonsBitmap,(byte)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrixVelocity,sData,TH_buttonMatrixVelocity_len);
}
//actions to take once a button is released
void onMatrixButtonReleased(byte button) {
  byte sData[]={button,0,(byte)pressedMatrixButtonsBitmap,(byte)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrixReleased,sData,TH_buttonMatrixReleased_len);
}
void onEncoderScroll(int absolute, int delta) {
  byte sData[]={(char)absolute,(char)delta};
  //lcdPrintA(String(absolute,HEX));

  sendToBrain(TH_encoderScroll,sData,TH_encoderScroll_len);
}

void onEncoderPressed() {
  byte sData[]={1};
  sendToBrain(TH_encoderPressed,sData,TH_encoderPressed_len);
}

//
void onSelectorButtonPressed(byte button) {
  byte sData[]={button,1};
  sendToBrain(TH_selectorButtonPressed,sData,TH_selectorButtonPressed_len);
}
//
void onSelectorButtonReleased(byte button) {
  byte sData[]={button,0};
  sendToBrain(TH_selectorButtonReleased,sData,TH_selectorButtonReleased_len);
}
void onSelectorButtonHold(byte button) {}




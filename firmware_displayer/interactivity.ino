

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, byte buttonPressure) {
  //int sData[]={button,buttonPressure,pressedMatrixButtonsBitmap};
  //sendToBrain(TH_buttonMatrix,sData,3);
}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
  char sData[]={button,1,(byte)pressedMatrixButtonsBitmap,(byte)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrix,sData,4);
}


//actions to take once a button is pressed

void onMatrixButtonPressed(byte button, int buttonPressure) {
  char sData[]={button,(char) buttonPressure,(byte)pressedMatrixButtonsBitmap,(byte)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrix,sData,4);
}
//actions to take once a button is released
void onMatrixButtonReleased(byte button) {
  char sData[]={button,0,(byte)pressedMatrixButtonsBitmap,(byte)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrix,sData,4);
}
void onEncoderScroll(int absolute, int delta) {
  char sData[]={(char)absolute,(char)delta};
  sendToBrain(TH_encoderScroll,sData,2);
}

void onEncoderPressed() {
  char sData[]={1};
  sendToBrain(TH_encoderButton,sData,1);
}

//
void onSelectorButtonPressed(byte button) {
  char sData[]={button,1};
  sendToBrain(TH_selectorButton,sData,2);
}
//
void onSelectorButtonReleased(byte button) {
  char sData[]={button,0};
  sendToBrain(TH_selectorButton,sData,2);
}
void onSelectorButtonHold(byte button) {}




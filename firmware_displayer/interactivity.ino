

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, byte buttonPressure) {
  //int sData[]={button,buttonPressure,pressedMatrixButtonsBitmap};
  //sendToBrain(TH_buttonMatrix,sData,3);
}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
  int sData[]={button,pressedMatrixButtonsBitmap};
  sendToBrain(TH_buttonMatrix,sData,2);
}


//actions to take once a button is pressed

void onMatrixButtonPressed(byte button, int buttonPressure) {
  int sData[]={button,buttonPressure,pressedMatrixButtonsBitmap};
  sendToBrain(TH_buttonMatrix,sData,3);
}
//actions to take once a button is released
void onMatrixButtonReleased(byte button) {
  int sData[]={button,0,pressedMatrixButtonsBitmap};
  sendToBrain(TH_buttonMatrix,sData,3);
}
void onEncoderScroll(int absolute, int delta) {
  int sData[]={absolute,delta};
  sendToBrain(TH_encoderScroll,sData,2);
}

void onEncoderPressed() {
  int sData[]={1};
  sendToBrain(TH_encoderButton,sData,1);
}

//
void onSelectorButtonPressed(byte button) {
  int sData[]={button,1};
  sendToBrain(TH_selectorButton,sData,2);
}
//
void onSelectorButtonReleased(byte button) {
  int sData[]={button,0};
  sendToBrain(TH_selectorButton,sData,2);
}
void onSelectorButtonHold(byte button) {}




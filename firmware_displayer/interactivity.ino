

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(unsigned char button, unsigned char buttonPressure) {
  //int sData[]={button,buttonPressure,pressedMatrixButtonsBitmap};
  //sendToBrain(TH_buttonMatrixHold,sData,3);
}
//actions to take while a button is pressed
void onMatrixButtonPressed(unsigned char button) {
  unsigned char sData[]={button,1,(unsigned char)pressedMatrixButtonsBitmap,(unsigned char)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrixPressed,sData,TH_buttonMatrixPressed_len);
}


//actions to take once a button is pressed

void onMatrixButtonPressed(unsigned char button, int buttonPressure) {
  unsigned char sData[]={button,(unsigned char) buttonPressure,(unsigned char)pressedMatrixButtonsBitmap,(unsigned char)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrixVelocity,sData,TH_buttonMatrixVelocity_len);
}
//actions to take once a button is released
void onMatrixButtonReleased(unsigned char button) {
  unsigned char sData[]={button,0,(unsigned char)pressedMatrixButtonsBitmap,(unsigned char)(pressedMatrixButtonsBitmap>>8)};
  sendToBrain(TH_buttonMatrixReleased,sData,TH_buttonMatrixReleased_len);
}
void onEncoderScroll(int absolute, int delta) {
  unsigned char sData[]={(char)absolute,(char)delta};
  sendToBrain(TH_encoderScroll,sData,TH_encoderScroll_len);
}

void onEncoderPressed() {
  unsigned char sData[]={1};
  sendToBrain(TH_encoderPressed,sData,TH_encoderPressed_len);
}

//
void onSelectorButtonPressed(unsigned char button) {
  unsigned char sData[]={button,1};
  sendToBrain(TH_selectorButtonPressed,sData,TH_selectorButtonPressed_len);
}
//
void onSelectorButtonReleased(unsigned char button) {
  unsigned char sData[]={button,0};
  sendToBrain(TH_selectorButtonReleased,sData,TH_selectorButtonReleased_len);
}
void onSelectorButtonHold(unsigned char button) {}




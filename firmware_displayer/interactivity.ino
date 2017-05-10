

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, byte buttonPressure) {
}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
}


//actions to take once a button is pressed

void onMatrixButtonPressed(byte button, int buttonPressure) {
  mySerial.write(button);
}
//actions to take once a button is released
void onMatrixButtonReleased(byte button) {
}
void onEncoderScroll(int absolute, int delta) {
  mySerial.write(absolute);
}

void onEncoderPressed() {
  pov_current++;
  pov_current%=POVS_COUNT;
}

//
void onSelectorButtonPressed(byte button) {
}
//
void onSelectorButtonReleased(byte button) {

}
void onSelectorButtonHold(byte button) {}




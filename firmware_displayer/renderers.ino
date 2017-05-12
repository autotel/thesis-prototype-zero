

void lcdPrintA(String what) {
  screenChanged = true;
  screenA = what;
}

void lcdPrintB(String what) {
  screenChanged = true;
  screenB = what;
}


void sequencerInteractionMode(){
  int seqB=interfaceMap[0];
  layers[0]=seqB^0x0001<<currentStep;
  layers[1]=seqB
  layers[2]=0x0001<<currentStep;
}
void performerInteractionMode(){}
void scaleInteractionMode(){}

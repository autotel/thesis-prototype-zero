

void lcdPrintA(String what) {
  screenChanged = true;
  screenA = what;
}

void lcdPrintB(String what) {
  screenChanged = true;
  screenB = what;
}


void render_interface_sequencer(){
  int seqB=currentInterfaceMap[0];
  layers[0]=seqB^0x0001<<currentStep;
  layers[1]=seqB;
  layers[2]=0x0001<<currentStep;
}
void render_interface_performer(){}
void render_interface_scale(){}
void render_interface_none(){}
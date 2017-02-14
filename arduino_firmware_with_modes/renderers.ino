//different colouring schemes for when a selector button is being held
void modifierGraph(byte selection, unsigned int * _graph) {
  unsigned int graph [] = {0, 0};
  switch (selection) {
    //generic single point among 16 selection
    case 0:
      graph[0] = 0x1 << lastMatrixButtonPressed;
      graph[1] = ~graph[0];
      break;
    //binary number or multi point selector
    case 1:
      graph[0] = binaryInputActiveBitmap;
      graph[1] = 0xFFFF;
      break;
    //calculator
    case 2:
      graph[0] = 0b111011101110;
      graph[1] = ~graph[0];
      break;
    //single point, performance layer selector
    case 16:
      graph[0] = ~(0xFFFF << 8);
      graph[1] = 0x1 << lastMatrixButtonPressed;
      break;
  }
  *_graph = graph[0];
  *(_graph + 1) = graph[1];
}

void lcdPrintA(String what) {
  screenChanged = true;
  screenA = what;
}

void lcdPrintB(String what) {
  screenChanged = true;
  screenB = what;
}

long lastMillis = 0;
unsigned int stepInterval = 200;
void evaluateSequence() {
  graph_pointer = 1 << currentStep16;

  /*
    long thisMillis = millis();
    //evaluate wether to step
    if (thisMillis - lastMillis >= stepInterval) {
    lastMillis = thisMillis;
    //currentStep16=(currentStep16+1)%16;
    graph_pointer = 1 << currentStep16;
    }*/
  //create the graphic layer to display the sequence

  graph_sequence = 0;
  for (byte a = 0; a < 16; a++) {
    if (frameHasNote(a)) {
      graph_sequence |= 0x1 << a;
    }
  }
}


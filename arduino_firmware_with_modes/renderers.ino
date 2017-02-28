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

void lcdUpdateMode() {
  //concatenate both text of the first row of the lcd. one from left to right, other from roght to left
  lcdPrintA((getString_mode(m_mode) + "/" + getString_POV(pm_current)).substring(0, 16));
}
void lcdUpdatePOV(String is) {
  //efficiency coming some other day...
  lcdUpdateMode();
}
void lcdUpdateStatus() {
  switch (m_mode) {
    default:
      switch (pm_current) {
        //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
        case 3:
          lcdPrintB(getString_POV(pm_current) + String(pm_selectedNote));
          break;
        case 4:
          lcdPrintB(getString_POV(pm_current) + String(pm_selectedChannel));
          break;
        default:
          lcdPrintB(String(F("ch")) + String(pm_selectedChannel, DEC) + String(F(", note")) + noteNameArray[pm_selectedNote % 12] + String(pm_selectedNote / 12, DEC));
          break;
      }
  }
}
//function for strings that go in the LCD. it adds a text alighed to the right
/*String lcd_addTextAtRight(String texta,String textb){
  texta=(texta+"                ").substring(0,16);
  for(byte a=textb.length(); a>0; a--){
    texta[16-a]=textb[a];
  }
  return texta;
  }*/

long lastMillis = 0;
unsigned int stepInterval = 200;
void updateSequenceGraph(){

    graph_pointer = 1 << seq_currentStep16x2;

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
      if (seq_frameHasNote(a,true)) {
        graph_sequence |= 0x1 << a;
      }
    }
}



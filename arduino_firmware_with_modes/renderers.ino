//different colouring schemes for when a selector button is being held
void modifierGraph(byte selection, unsigned int * _graph) {
  unsigned int graph [] = {0, 0, 0};
  switch (selection) {
    //generic single point among 16 selection
    case SELECTORGRAPH_POINT:
      graph[1] = 0x1 << activePadInput;
      //graph[2] = ~graph[0];
      graph[2] = 0;
      break;
    //binary number or multi point selector
    case SELECTORGRAPH_BINARY:
      graph[1] = activePadInput;
      //graph[2] = 0xFFFF;
      graph[2] = 0;
      break;
    //calculator
    case SELECTORGRAPH_CALCULATOR:
      graph[1] = 0b111011101110;
      graph[2] = ~graph[0];
      break;
    //single point, mode selector
    case SELECTORGRAPH_MODE:
      graph[1] = 0x1 << activePadInput;
      graph[2] = ~(0xFFFF << MODES_COUNT);
      break;
    //record interface
    case SELECTORGRAPH_RECORD:
      graph[1] = (0x1);
      graph[2] = (0xFF);
      break;
    //single point, performance layer selector
    case SELECTORGRAPH_POV:
      graph[1] = 0x1 << activePadInput;
      graph[2] = ~(0xFFFF << POVS_COUNT);
      break;
  }
  graph[0] = graph[1];

  *_graph = graph[0];
  *(_graph + 1) = graph[1];
  *(_graph + 2) = graph[2];
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
  String additions = "";
  if (m_recording)
    additions = "*";
  lcdPrintA((getString_mode(m_mode) + " /" + getString_POV(pm_current)).substring(0, 16) + additions);
}
void lcdUpdatePOV(String is) {
  //efficiency coming some other day...
  lcdUpdateMode();
}
void lcdUpdateStatus() {
  switch (m_mode) {
    /*#define POV_GRADE 0
      #define POV_NOTE 1
      #define POV_CHAN 2
      #define POV_CCN 3*/
    default:
      switch (pm_current) {
        //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
        case POV_CCN:
          lcdPrintB(getString_POV(pm_current) + String(pm_selectedNote));
          break;
        case POV_CCCH:
          lcdPrintB(getString_POV(pm_current) + String(pm_selectedChannel));
          break;
        case POV_CHAN:
          lcdPrintB(String(F("ch")) + String(pm_selectedChannel, DEC)+ (char)127 + String(F(" note")) + noteNameArray[pm_selectedNote % 12] + String(pm_selectedNote / 12, DEC));
          break;
        case POV_NOTE:
          lcdPrintB(String(F("ch")) + String(pm_selectedChannel, DEC) + String(F(" note")) + noteNameArray[pm_selectedNote % 12] + String(pm_selectedNote / 12, DEC)+ (char)127);
          break;
        default:
          lcdPrintB(String(F("ch")) + String(pm_selectedChannel, DEC) + String(F(" note")) + noteNameArray[pm_selectedNote % 12] + String(pm_selectedNote / 12, DEC));
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
void updateSequenceGraph() {

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
    if (seq_frameHasNote(a, true)) {
      graph_sequence |= 0x1 << a;
    }
  }
}



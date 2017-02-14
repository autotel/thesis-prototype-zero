
#include <LiquidCrystal.h>
#include <TimerOne.h>
#include <SoftwareSerial.h>

//analog inputs that are connected to the multiplexor commons
int analogA;
int analogB;

//pins that are connected to the encoder A and B
#define encoder0PinA  A4
#define encoder0PinB  A5
volatile unsigned int encoder0Pos = 0;

//pins that are connected to the midi plugs as software serial
int midiIn = A3;
int midiOut = A2;
SoftwareSerial mySerial(midiIn, midiOut); // RX, TX


//current mode
int m_mode = 0;
//wether it is recording the midi stream
bool m_recording = false;
//names for the m_mode possible values
String  m_list [] = {
  "performer", "sequencer", "jumper 1", "jumper 2",
  "scale", "chordset", "patternset 1", "patternset 2",
  "Tesseractor A", "Tesseractor B", "Tesseractor C", "Tesseractor D",
  "Tesseractor E", "Tesseractor F", "Tesseractor G", "Tesseractor H",
};
//pm_
byte pm_current = 2;
String pm_layerList [] = {
  "chords", "grades", "notes", "channels", "cc's", "custom"
};
byte pm_selectedChannel = 0;
byte pm_selectedNote = 36;
byte pm_selectedVelocity = 36;
//structure_
/*byte structure_scale[] = {0, 2, 4, 5, 7, 9, 11};
  byte structure_chords[16][16];
  byte structure_chords[0] = {0, 2, 4};
  byte structure_chords[1] = {1, 3, 5};
  byte structure_chords[2] = {2, 4, 8};
  byte structure_chords[3] = {3, 5, 7};*/
//modifier states
//example boolean shift=false;
bool selector_mode = false;
bool selector_a = false;
bool selector_b = false;
bool selector_c = false;
//midi tracking
//[0,0]=wether last thing sent was a note on (off is due)
//[0,1]=channel...
byte MIDI_NoteOns [16][4];
//text to print in screens
String screenA = "CALCUTRATOR";
String screenB = "0";
//flag that indicates that the screen should be redrawn when possible
bool screenChanged = true;

//the last button that has been pressed on the matrix buttons
byte lastMatrixButtonPressed = 0;
//buttons that were pressed on last evaluation;
unsigned int pressedMatrixButtonsBitmap = 0x0000;
byte pressedSelectorButtonsBitmap = 0x00;
//the buttons that are active while engaged in binary number input (ex. note selector)
unsigned int binaryInputActiveBitmap = 0x0000;

LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

long lastchange;

//contains the midi sequence to play
byte sequence [96][3];

unsigned int layers [] = {0xfff0, 0x0, 0x0};

void setup() {
  //the perfect pulldown is 2.5K ohms
  //the analog port that will be connected to each mux A and B
  analogA = A1;
  analogB = A0;
  pinMode(analogA, OUTPUT);
  pinMode(analogB, OUTPUT);
  digitalWrite(analogA, HIGH);
  digitalWrite(analogB, LOW);
  //set all pins from 0 to 7 to output
  DDRD = 0xFF;
  //Timer1.initialize(9000);//200
  //Timer1.attachInterrupt(timedLoop);
  //sequence[2][0] = 0x90;

  mySerial.begin(31250);


  //lcd screen initial write
  lcd.begin(16, 2);
  lcd.print("hello, world!");

  //encoder set up
  pinMode(encoder0PinA, INPUT);
  digitalWrite(encoder0PinA, HIGH);       // turn on pull-up resistor
  pinMode(encoder0PinB, INPUT);
  digitalWrite(encoder0PinB, HIGH);       // turn on pull-up resistor

  //attachInterrupt(0, doEncoder, CHANGE);  // encoder pin on interrupt 0 - pin 2
  //Timer1.initialize(200);//200
  //Timer1.attachInterrupt(doEncoder);
}


unsigned int graph_debug = 0x00;
int currentStep16 = 0;
int currentStep16x12 = 0;
int loop128 = 0;
void loop() {
  if (mySerial.available()) {
    byte midiHeader = mySerial.read();
    if (m_recording) {
      if ((midiHeader & 0xF0) == 0x90) {
        sequence[currentStep16][0] = midiHeader;//pendant: this is not right implementation of midi in
        sequence[currentStep16][1] =  mySerial.read();
        sequence[currentStep16][2] =  mySerial.read();
      }
    }
    //clock
    if (midiHeader == 0xF8) {
      currentStep16x12 = (currentStep16x12 + 1) % (16 * 12);
      if (currentStep16x12 % 12 == 0) {
        currentStep16 = currentStep16x12 / 12;

      }
    }
    //start
    if (midiHeader == 0xFA) {
      currentStep16x12 = 0;
      currentStep16 = 0;
    }
  }



  evaluateSequence();
  if (loop128 % 4 == 0)
    timedLoop();

  loop128++;
  loop128 %= 128;
}
/**
  Check if a given frame has a note on it or not.
  a frame is the smallest unit of time in the sequencer memory. All event data is quantized into these frames.
  @method frameHasNote
  @return {boolean} true if there is a note, false if there is not.
  @example frameHasNote(32);
*/
bool frameHasNote(byte frame) {
  return (sequence[frame][0] & 0xF0) == 0x90;
}

int graph_pointer = 0x00;
int graph_fingers = 0x00;
int graph_sequence = 0x00;
String lastScreenA = "";
String lastScreenB = "";

void draw() {
  byte selectedGraph = 0;
  if (selector_mode || selector_a || selector_b || selector_c) {
    switch (m_mode) {
      case 0:
        if (selector_a) {
          selectedGraph = 16;
        } else if (selector_b) {
          selectedGraph = 1;
        } else if (selector_c) {
          selectedGraph = 0;
        }
        break;
    }
    unsigned int graph [] = {0, 0};
    modifierGraph(selectedGraph, graph);
    layers[1] = graph [0];
    layers[2] = graph [1];
  } else {
    layers[2] = graph_sequence;
    layers[1] = graph_fingers;

    layers[1] |= graph_pointer;
    layers[2] |= graph_fingers;

    layers[0] = graph_debug;
    // layers[1]|=graph_debug;
    layers[2] |= graph_debug;
  }
  if (screenChanged) {
    screenChanged = false;
    if (lastScreenA != screenA) {
      lastScreenA = screenA;
      lcd.setCursor(0, 0);
      lcd.print(screenA);

      for (byte strl = 16 - screenA.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
    if (lastScreenB != screenB) {
      lastScreenB = screenB;
      lcd.setCursor(0, 1);
      lcd.print(screenB);
      for (byte strl = 16 - screenB.length(); strl > 0; strl--) {
        lcd.write(' ');
      }
    }
  }
}
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
      graph[0] = ~(0xFFFF << 6);
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

byte cp64 = 0;




void timedLoop() {
  //evaluate matrix buttons
  byte cp16 = cp64 % 16;
  byte cp32 = cp64 % 32;

  int buttonPressure = readMatrixButton(cp16);
  int evaluator = 0x1 << cp16;
  if (buttonPressure > 1) {
    //if last lap this button was not pressed, trigger on  button pressed
    if ((evaluator & pressedMatrixButtonsBitmap) == 0) {
      pressedMatrixButtonsBitmap |= evaluator;
      onMatrixButtonPressed(cp16, buttonPressure);
    } else {
      onMatrixButtonHold(cp16, buttonPressure);
    }
  } else {
    if ((evaluator & pressedMatrixButtonsBitmap) != 0) {
      pressedMatrixButtonsBitmap &= ~(0x1 << cp16);
      onMatrixButtonReleased(cp16);
    }
  }
  /*layers[0]=readMatrixButton(3);
    layers[1]=readMatrixButton(1);
    layers[2]=readMatrixButton(2);*/





  updatePixel(cp32 + 0xF); //using 32 instead of 64 for more light at cost of the red channel


  //evaluate Selector buttons (the tact buttons on top of the matrix)
  //less frequently than matrix, because these are not performance buttons
  if (cp16 == 0) {
    //cp64/16 will be 0,1,2,3 alernatingly each time cp16 is 0
    int cb_4 = cp64 / 0xf;
    //see previous use of this var for more reference
    evaluator = 0x1 << cb_4;
    if (readMuxB(cb_4 + 4)) {
      //if last lap this button was not pressed, trigger on  button pressed
      if ((evaluator & pressedSelectorButtonsBitmap) == 0) {
        pressedSelectorButtonsBitmap |= evaluator;
        onSelectorButtonPressed(cb_4);
      } else {
        onSelectorButtonHold(cb_4);
      }
    } else {
      if ((evaluator & pressedSelectorButtonsBitmap) != 0) {
        pressedSelectorButtonsBitmap &= ~(0x1 << cb_4);
        onSelectorButtonReleased(cb_4);
      }
    }
  }

  if (cp64 == m_mode) {
    draw();
  }

  cp64++;
  cp64 = cp64 % 64;


}

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, int buttonPressure) {}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
  onMatrixButtonPressed(button, 127);
}

//actions to take once a button is pressed

void onMatrixButtonPressed(byte button, int buttonPressure) {
  lastMatrixButtonPressed = button;
  graph_fingers |= 0x1 << button;
  if (selector_mode) {
    changeMode(button);
  } else {
    switch (m_mode) {
      //performer m_mode
      case 0:
        //check wether we are engaged in a selector mode
        if (selector_a) {
          changePerformanceLayer(button);// channels, chords, grades, notes, velocities
        } else if (selector_b) {
          if ((0x1 << button)&binaryInputActiveBitmap) {
            binaryInputActiveBitmap &= ~(0x1 << button);
          } else {
            binaryInputActiveBitmap |= 0x1 << button;
          }
          pm_selectedNote = (byte) binaryInputActiveBitmap; //works as binary input
          lcdPrintB("note now " + String(binaryInputActiveBitmap, DEC));
        } else if (selector_c) {
          pm_selectedChannel = button;
          lcdPrintB("channel now " + String(button, DEC));
        } else {
          //we are not in selector mode, therefore we just perform
          //"chords", "grades", "notes", "channels", "cc's", "custom"
          switch (pm_current) {
            //chords
            case 0:
              break;
            //grades
            case 1:
              break;
            //notes
            case 2:
              //pm_selectedNote = button;
              noteOn(pm_selectedChannel, pm_selectedNote + button, pm_selectedVelocity, button, true);
              break;
            //channels
            case 3:
              //pm_selectedChannel = button;
              noteOn(button, pm_selectedNote + button, pm_selectedVelocity, button, true);
              break;
            case 4:
              break;
          }

          break;
        }
        break;
      //sequencer m_mode
      case 1:
        int evaluator = 0x1 << button;
        if (frameHasNote(button)) {
          sequence[button][0] = 0x00;
        } else {
          sequence[button][0] = 0x90;
        }
        break;
        //jumper1
        //jumper2
    }
  }
}
//actions to take once a button is released
void onMatrixButtonReleased(byte button) {
  graph_fingers &= ~(0x1 << button);
  //if this button has generated a note on, send a note off.
  if (MIDI_NoteOns[button][0]) {
    sendMidi(0x80 | (MIDI_NoteOns[button][1] & 0xf), MIDI_NoteOns[button][2], 0);
  }
  //for debug
  switch (m_mode) {
    case 0:
      if (selector_b) {
       // pm_selectedNote = (pressedMatrixButtonsBitmap); //works as binary input
       // lcdPrintB("note now " + String(pressedMatrixButtonsBitmap, DEC));
      } else {
        switch (pm_current) {
        }
      }
      break;
    case 1:
      break;
  }
}
//
void onSelectorButtonPressed(byte button) {

  String selectorName = "-";
  //set the selector to active (to be detected in other places) and set default names to print on screen
  if (button == 0) {
    selector_mode = true;
    selectorName = "Mode";
  } else if (button == 1) {
    selector_a = true;
    selectorName = "A";
  } else if (button == 2) {
    selector_b = true;
    selectorName = "B";
  } else if (button == 3) {
    selector_c = true;
    selectorName = "C";
  }
  switch (m_mode) {
    case 0:
      switch (button) {
        case 1:
          selectorName = "Perform type";
          break;
        case 2:
          selectorName = "Note";
          binaryInputActiveBitmap = pm_selectedNote;
          break;
        case 3:
          selectorName = "Channel";
          break;
      }

      break;
  }
  lcdPrintB(selectorName + " selector");
}
//
void onSelectorButtonReleased(byte button) {
  lcdPrintB("-");
  if (button == 0) {
    selector_mode = false;
  } else if (button == 1) {
    selector_a = false;
  } else if (button == 2) {
    selector_b = false;
  } else if (button == 3) {
    selector_c = false;
  }
}
void onSelectorButtonHold(byte button) {}
//send a midi event to the midi output
void sendMidi(byte a, byte b, byte c) {
  mySerial.write(a);
  mySerial.write(b);
  mySerial.write(c);
}
void sendMidi(byte a, byte b, byte c, bool debug) {
  sendMidi(a, b, c);
  if (debug)
    lcdPrintB(String( a, HEX) + "," + String( b, HEX) + "," + String( c, HEX) + "");
}
void noteOn(byte channel, byte b, byte c, byte button, bool debug) {
  byte a = (0x0f & channel) | 0x90;
  MIDI_NoteOns[button][0] = 0xFF;
  MIDI_NoteOns[button][1] = channel;
  MIDI_NoteOns[button][2] = b;
  MIDI_NoteOns[button][3] = c;
  sendMidi(a, b, c, debug);
}
//change mode to and perform all necessary operations with respect to that.
//avoid setting up many variables here because it gets messy. instead the program should check the currentmode and act accordingly
void changeMode(byte to) {
  m_mode = to;
  lcdPrintA(m_list[to]);
};
void changePerformanceLayer(byte to) {
  pm_current = to;
  lcdPrintB("PM_" + pm_layerList[to]);
}
//update one pixel on one of the color channels behind the mux. Be aware that redPixel function exists
void updatePixel(byte currentPixel) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;
  if ((layers[currentLayer] >> currentPixel % 16) & 0x0001) {

    //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
    nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
    nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

    nibbleB += 8;
    //ground & power the led. strangely still works without these lines
    /*PORTC |= 0b10;
      PORTC &= ~0b1;*/

    PORTD = (nibbleB << 4) | (nibbleA);

  }
}

//just draw a pixel disregarding the layer information
void turnPixelOn(byte currentPixel) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  byte currentLayer = currentPixel >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentPixel % 4) + (currentPixel >> 2 & 12); //[0-15]=0,[16-31]=4,[32-47]=8,[48-63]=12
  nibbleB &= (currentPixel / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop

  nibbleB += 8;
  //ground & power the led
  /*PORTC |= 0b1;
    PORTC &= ~0b10;*/
  PORTD = (nibbleB << 4) | (nibbleA);
}

//read one button behind the multiplexor to check whether is pressed or not.
int readMatrixButton(byte currentButton) {
  //nibble A is connected to the mux address for the anodes / btn inputs
  byte nibbleA = 0xF;
  //nibble B is connected to the mux for the cathodes / btn outputs
  byte nibbleB = 0xF;
  //byte currentLayer = currentButton >> 4;
  //(currentPixel>>2)&12 is the same than doing floor(currentPixel/16)*4. try it  in codechef
  nibbleA &= (currentButton % 4);
  nibbleB &= (currentButton / 4) % 4; //~0x10 << ((currentPixel / 4) % 4); //0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3, will happen 4 times within 64 loop
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  pinMode(analogB, INPUT);
  digitalWrite(analogA, HIGH);
  //PORTC |= 0b10;
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}

bool readMuxB(byte address) {
  //nibbleA in this case is only to avoid writing to muxA
  byte nibbleA = PORTD & 0xF;
  //nibbleB will contain the address for the mux B
  byte nibbleB = address & 0xF;
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  //now that we are connected to the mux, read the input
  pinMode(analogB, INPUT);
  bool ret = digitalRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}

//untested
int analogReadMuxB(byte address) {
  //nibbleA in this case is only to avoid writing to muxA
  byte nibbleA = PORTD & 0xF;
  //nibbleB will contain the address for the mux B
  byte nibbleB = address & 0xF;
  //PORTD is connected to both muxes address inputs
  PORTD = (nibbleB << 4) | (nibbleA);
  //now that we are connected to the mux, read the input
  pinMode(analogB, INPUT);
  int ret = analogRead(analogB);
  pinMode(analogB, OUTPUT);
  return ret;
}
//read encoder. sourced from http://playground.arduino.cc/Main/RotaryEncoders#Example2
void doEncoder() {
  /* If pinA and pinB are both high or both low, it is spinning
     forward. If they're different, it's going backward.

     For more information on speeding up this process, see
     [Reference/PortManipulation], specifically the PIND register.
  */
  if (digitalRead(encoder0PinA) == digitalRead(encoder0PinB)) {
    encoder0Pos++;
  } else {
    encoder0Pos--;
  }
  lcdPrintB(String(encoder0Pos));


}



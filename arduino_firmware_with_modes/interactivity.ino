

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
          lcdPrintB("note now " + String(binaryInputActiveBitmap, DEC) + "(" + noteNameArray[binaryInputActiveBitmap % 12] + ")");
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
              noteOn(button, pm_selectedNote, pm_selectedVelocity, button, true);
              break;
            case 4:
              break;
          }

          break;
        }
        break;
      //sequencer m_mode
      case 1:
        if (frameHasNote(button)) {
          sequence[button][0] = 0x00;
        } else {
          sequence[button][0] = 0x90;
        }
        break;
      //jumper1 m_mode
      case 2:
        break;
      //jumper2 m_mode
      case 3:
        break;
      //scale m_mode
      case 4:
        {
          int evaluator = 0x1 << button;
          if (button < 12)
            if (structure_scales[se_selectedScale][2] & evaluator) {
              structure_scales[se_selectedScale][2] &= ~evaluator;
            } else {
              structure_scales[se_selectedScale][2] |= evaluator;
            }

        } break;
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
          selectorName = "Set";
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

//change mode to and perform all necessary operations with respect to that.
//avoid setting up many variables here because it gets messy. instead the program should check the currentmode and act accordingly
void changeMode(byte to) {
  m_mode = to;
  lcdPrintA(m_list[to]);
};
void changePerformanceLayer(byte to) {
  pm_current = to;
  lcdPrintB( pm_layerList[to] + " set");
}



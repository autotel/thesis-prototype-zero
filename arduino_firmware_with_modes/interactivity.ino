

//actions to take while a button is held, taking the pressure into account
void onMatrixButtonHold(byte button, byte buttonPressure) {
  switch (m_mode) {
    //performer m_mode
    case 0:
      switch (pm_current) {
        case 4:
          //only one button should ride the cc, otherwise chaos
          if (button == lastMatrixButtonPressed)
            sendMidi(0xB0 | button, pm_selectedNote, buttonPressure / 2, true);
          break;
        //test
        case 5:
          //only one button should ride the cc, otherwise chaos
          if (button == lastMatrixButtonPressed)
            sendMidi(0xB0 | pm_selectedChannel, 0x4A, buttonPressure / 2);
          break;
        case 6:
          //only one button should ride the cc, otherwise chaos
          if (button == lastMatrixButtonPressed)
            sendMidi(0xB0 | pm_selectedChannel, 0x50, buttonPressure / 2);
          break;
      }
  }
}
//actions to take while a button is pressed
void onMatrixButtonPressed(byte button) {
  onMatrixButtonPressed(button, 127);
}


//this function is used to override behaviour of a current mode, when a selector button is pressed
bool doSelectors1(byte button) {
  //check wether we are engaged in a selector mode
  if (selector_a) {
    changePerformanceLayer(button);// channels, chords, grades, notes, velocities
    return true;
  } else if (selector_b) {
    if ((0x1 << button)&binaryInputActiveBitmap) {
      binaryInputActiveBitmap &= ~(0x1 << button);
    } else {
      binaryInputActiveBitmap |= 0x1 << button;
    }
    pm_selectedNote = (byte) binaryInputActiveBitmap; //works as binary input
    lcdPrintB("note: " + String(binaryInputActiveBitmap, DEC) + "(" + noteNameArray[binaryInputActiveBitmap % 12] + ")");
    return true;
  } else if (selector_c) {
    pm_selectedChannel = button;
    lcdPrintB("channel: " + String(button, DEC));
    return true;
  } else {
    return false;
  }
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
      case MODE_PERF:
        if (!doSelectors1(button)) {
          //we are not in selector mode, therefore we just perform
          //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
          switch (pm_current) {
            //grades
            case 0:
              noteOn(pm_selectedChannel, getNoteFromScale(se_selectedScale, button, 4), pm_selectedVelocity, button, false);
              break;
            //notes
            case 1:
              //pm_selectedNote = button;
              noteOn(pm_selectedChannel, pm_selectedNote + button, pm_selectedVelocity, button, false);
              break;
            //channels
            case 2:
              //pm_selectedChannel = button;
              noteOn(button, pm_selectedNote, pm_selectedVelocity, button, true);
              break;
            //CC/n
            case 3:
              break;
            //CC/ch
            case 4:
              break;
            //Note+A
            case 5:
              //pm_selectedNote = button;
              noteOn(pm_selectedChannel, pm_selectedNote + button, pm_selectedVelocity, button, true);
              break;
            //note+B
            case 6:
              //pm_selectedNote = button;
              noteOn(pm_selectedChannel, pm_selectedNote + button, pm_selectedVelocity, button, true);
              break;
          }
        }
        break;
      //sequencer m_mode
      case MODE_SEQ:
        if (!doSelectors1(button)) {
          if (seq_frameHasNote(button, true)) {
            seq_removeNote(button, pm_selectedChannel, pm_selectedNote);
          } else {
            seq_addNote(button, pm_selectedChannel, pm_selectedNote, pm_selectedVelocity, 1);
          }
          break;
        }
      //jumper1 m_mode
      case MODE_JMP1:
        break;
      //scale m_mode
      case MODE_SCALE:
        {
          int evaluator = 0x1 << button;

          if (button < 12) {
            if (structure_scales[se_selectedScale][2] & evaluator) {
              structure_scales[se_selectedScale][2] &= ~evaluator;
            } else {
              structure_scales[se_selectedScale][2] |= evaluator;
            }
            byte gradesInScale = countOnes(structure_scales[se_selectedScale][2]);
            structure_scales[se_selectedScale][0] = gradesInScale;
            //lcdPrintB(String(gradesInScale, DEC));
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
    sendMidi(0x80 | (MIDI_NoteOns[button][0] & 0xf), MIDI_NoteOns[button][1], 0);
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
void onEncoderScroll(int absolute, int delta) {
  switch (m_mode) {
    //performer m_mode
    case MODE_PERF:
      //check wether we are engaged in a selector mode
      if (selector_a) {
        changePerformanceLayer(pm_current + delta); // channels, chords, grades, notes, velocities
      } else if (selector_b) {
        binaryInputActiveBitmap += delta;
        pm_selectedNote = (byte) binaryInputActiveBitmap; //works as binary input
        lcdPrintB("note: " + String(binaryInputActiveBitmap, DEC) + "(" + noteNameArray[binaryInputActiveBitmap % 12] + ")");
      } else if (selector_c) {
        pm_selectedChannel += delta;
        pm_selectedChannel %= 16;
        lcdPrintB("note: " + String(pm_selectedChannel, DEC));
      } else {
        //we are not in selector mode, therefore we just perform
        scrollAccordingToPm(delta);
      }
      break;
    //sequencer m_mode
    case MODE_SEQ:
      //check wether we are engaged in a selector mode
      if (selector_a) {
        changePerformanceLayer(pm_current + delta); // channels, chords, grades, notes, velocities
      } else if (selector_b) {
        binaryInputActiveBitmap += delta;
        pm_selectedNote = (byte) binaryInputActiveBitmap; //works as binary input
        lcdPrintB("note: " + String(binaryInputActiveBitmap, DEC) + "(" + noteNameArray[binaryInputActiveBitmap % 12] + ")");
      } else if (selector_c) {
        pm_selectedChannel += delta;
        pm_selectedChannel %= 16;
        lcdPrintB("note: " + String(pm_selectedChannel, DEC));
      } else {
        //we are not in selector mode, therefore we just perform
        scrollAccordingToPm(delta);
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
      break;
    //DEATH
    case 9:
      lcdPrintB(String(absolute) + "-" + (char)absolute);
      break;
  }
}
void scrollAccordingToPm(int delta) {
  //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
  switch (pm_current) {
    //grades
    case POV_GRADE:
      pm_selectedChannel += delta;
      lcdUpdateStatus();
      break;
    //notes
    case POV_NOTE:
      pm_selectedNote += delta;
      lcdUpdateStatus();
      //pm_selectedNote = button;
      break;
    //channels
    case POV_CHAN:
      pm_selectedChannel += delta;
      lcdUpdateStatus();
      //pm_selectedChannel = button;
      break;
    //CC/n
    case POV_CCN:
      pm_selectedNote += delta;
      lcdUpdateStatus();
      break;
    //CC/ch
    case POV_CCCH:
      pm_selectedNote += delta;
      lcdUpdateStatus();
      break;
    //note+A
    case POV_NOTEA:
      pm_selectedNote += delta;
      lcdUpdateStatus();
      //pm_selectedNote = button;
      break;
    //note+B
    case POV_NOTEB:
      pm_selectedNote += delta;
      lcdUpdateStatus();
      //pm_selectedNote = button;
      break;
  }
}
void onEncoderPressed() {}
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
  } else if (button == 4) {
    selector_c = true;
    selectorName = "ENC";
  }
  switch (m_mode) {
    case MODE_PERF:
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
    case MODE_SEQ:
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
  lcdPrintB("sel " + selectorName);
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
  } else if (button == 4) {
    selector_c = false;
  }
  lcdUpdateStatus();
}
void onSelectorButtonHold(byte button) {}

//change mode to and perform all necessary operations with respect to that.
//avoid setting up many variables here because it gets messy. instead the program should check the currentmode and act accordingly
void changeMode(byte to) {
  m_mode = to;
  lcdUpdateMode();
};
void changePerformanceLayer(byte to) {
  pm_current = to;
  lcdUpdateMode();// pm_POVList[to] + " set"
}



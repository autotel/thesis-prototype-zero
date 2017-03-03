

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
  if (selector_current == SELECTOR_NONE) {
    return false;
  } else {
    switch (selector_current) {
      case SELECTOR_MODE:
        break;
      case SELECTOR_POV:
        changePerformanceLayer(button);// channels, chords, grades, notes, velocities
        
        activePadInput = button%POVS_COUNT;
        pm_current = button;
        
        return true;
        break;
      case SELECTOR_CHANNEL:
        pm_selectedChannel = button;
        activePadInput = button;
        lcdPrintB("channel: " + String(button, DEC));
        return true;
        break;
      case SELECTOR_NOTE:
        if ((0x1 << button)&activePadInput) {
          activePadInput &= ~(0x1 << button);
        } else {
          activePadInput |= 0x1 << button;
        }
        pm_selectedNote = (byte) activePadInput; //works as binary input
        pm_selectedNote%=128;
        lcdPrintB("note: " + String(activePadInput, DEC) + "(" + noteNameArray[activePadInput % 12] + ")");
        return true;
        break;
      case SELECTOR_NUMBER:
        if ((0x1 << button)&activePadInput) {
          activePadInput &= ~(0x1 << button);
        } else {
          activePadInput |= 0x1 << button;
        }
        pm_selectedNote = (byte) activePadInput; //works as binary input
        pm_selectedNote%=128;
        lcdPrintB("note: " + String(activePadInput, DEC) + "(" + noteNameArray[activePadInput % 12] + ")");
        return true;
        break;
      case SELECTOR_MODULUS:
        if ((0x1 << button)&activePadInput) {
          activePadInput &= ~(0x1 << button);
        } else {
          activePadInput |= 0x1 << button;
        }
        seq_modulus = (byte) activePadInput; //works as binary input
        lcdPrintB("Modulus: " + String(activePadInput, DEC));
        return true;
        break;
      case SELECTOR_RECORD:
        if (button == 0) {
          m_recording = true;
        } else {
          m_recording = false;
        }
        lcdUpdateMode();
        return true;
        break;
      case SELECTOR_GRADE:
        break;
    }
  }
}

//actions to take once a button is pressed

void onMatrixButtonPressed(byte button, int buttonPressure) {
  lastMatrixButtonPressed = button;
  graph_fingers |= 0x1 << button;
  if (selector_current == SELECTOR_MODE) {
    activePadInput = button;
    changeMode(button);
  } else {
    switch (m_mode) {
      //performer m_mode
      case MODE_PERF:
        //pendant: does this structure make sense? selector mode check should be in the outermost
        if (!doSelectors1(button)) {
          //we are not in selector mode, therefore we just perform
          //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
          switch (pm_current) {
            //grades
            case POV_GRADE:
              /*if(m_recording)
                seq_addGrade(currentStep16, pm_selectedChannel, button, pm_selectedVelocity, 1)*/
              noteOn(pm_selectedChannel, getNoteFromScale(se_selectedScale, button, 4), pm_selectedVelocity, button, false);
              break;
            //notes
            case POV_NOTE:
              if (m_recording)
                seq_addNote(seq_currentStep16x2, pm_selectedChannel, pm_selectedNote +  button, pm_selectedVelocity, 1);
              //pm_selectedNote = button;
              noteOn(pm_selectedChannel, pm_selectedNote + button, pm_selectedVelocity, button, false);
              break;
            //channels
            case POV_CHAN:
              if (m_recording)
                seq_addNote(seq_currentStep16x2, button, pm_selectedNote, pm_selectedVelocity, 1);
              //pm_selectedChannel = button;
              noteOn(button, pm_selectedNote, pm_selectedVelocity, button, true);
              break;
            //CC/n
            case POV_CCN:
              break;
            //CC/ch
            case POV_CCCH:
              break;
            //Note+A
            case POV_NOTEA:
              //pm_selectedNote = button;
              noteOn(pm_selectedChannel, pm_selectedNote + button, pm_selectedVelocity, button, true);
              break;
            //note+B
            case POV_NOTEB:
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
            seq_removeNote(button, pm_current);
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
      case MODE_DEATH:
        for (int a = 0; a < SQLN; a++) {
          seq_ence[a][0] = 0;
        }
        break;
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

}
void onEncoderScroll(int absolute, int delta) {
  switch (selector_current) {
    case SELECTOR_POV:
      //if (selector_a) {
      activePadInput = pm_current + delta;
      changePerformanceLayer(activePadInput); // channels, chords, grades, notes, velocities
      break;
    case SELECTOR_NOTE:
      //} else if (selector_b) {
      activePadInput += delta;
      activePadInput %= 128;
      pm_selectedNote = (byte) activePadInput; //works as binary input
      lcdPrintB("Note: " + String(activePadInput, DEC) + "(" + noteNameArray[activePadInput % 12] + ")");
      break;
    case SELECTOR_NUMBER:
      //} else if (selector_b) {
      activePadInput += delta;
      pm_selectedNote = (byte) activePadInput; //works as binary input
      lcdPrintB("Num: " + String(activePadInput, DEC) + "(" + noteNameArray[activePadInput % 12] + ")");
      break;
    case SELECTOR_CHANNEL:
      activePadInput = pm_selectedChannel + delta;
      activePadInput %= 16;
      pm_selectedChannel = (byte)activePadInput;
      lcdPrintB("Channel: " + String(activePadInput, DEC));
      break;
    case SELECTOR_MODULUS:
      activePadInput += delta;
      activePadInput %= 128;
      seq_modulus = (byte) activePadInput; //works as binary input
      lcdPrintB("Modulus: " + String(activePadInput, DEC));
      break;
    default:
      //we are not in selector mode. does the current mode do something special with the encoder?
      switch (m_mode) {
        case 9:
          lcdPrintB(String(absolute) + "-" + (char)absolute);
          break;
        default:
          //there is no current selector, and the current mode doesn't do anything special with the encoder scroll
          scrollAccordingToPm(delta);
      }
  }

}
void scrollAccordingToPm(int delta) {
  //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
  switch (pm_current) {
    //grades
    case POV_GRADE:
      pm_selectedChannel += delta;
      activePadInput = pm_selectedChannel;
      lcdUpdateStatus();
      break;
    //notes
    case POV_NOTE:
      pm_selectedNote += delta;
      activePadInput = pm_selectedNote;
      lcdUpdateStatus();
      //pm_selectedNote = button;
      break;
    //channels
    case POV_CHAN:
      pm_selectedChannel += delta;
      activePadInput = pm_selectedChannel;
      lcdUpdateStatus();
      //pm_selectedChannel = button;
      break;
    //CC/n
    case POV_CCN:
      pm_selectedNote += delta;
      activePadInput = pm_selectedNote;
      lcdUpdateStatus();
      break;
    //CC/ch
    case POV_CCCH:
      pm_selectedNote += delta;
      activePadInput = pm_selectedNote;
      lcdUpdateStatus();
      break;
    //note+A
    case POV_NOTEA:
      pm_selectedNote += delta;
      activePadInput = pm_selectedNote;
      lcdUpdateStatus();
      //pm_selectedNote = button;
      break;
    //note+B
    case POV_NOTEB:
      pm_selectedNote += delta;
      activePadInput = pm_selectedNote;
      lcdUpdateStatus();
      //pm_selectedNote = button;
      break;
  }
}
void onEncoderPressed() {
  pm_current++;
  pm_current%=POVS_COUNT;
  lcdUpdateStatus();
}

//
void onSelectorButtonPressed(byte button) {
  String selectorName = "-";
  //set the selector to active (to be detected in other places) and set default names to print on screen
  if (button == 3) {
    selector_current = SELECTOR_MODE;
  } else {
    switch (m_mode) {
      case MODE_PERF:
        switch (button) {
          case 2:
            selector_current = SELECTOR_POV;
            activePadInput = pm_current;
            break;
          case 1:
            switch (pm_current) {
              case POV_NOTE:
                selector_current = SELECTOR_CHANNEL;
                activePadInput = pm_selectedChannel;
                break;
              case POV_CHAN:
                selector_current = SELECTOR_NOTE;
                activePadInput = pm_selectedNote;
                break;
            }
            break;
          case 0:
            selector_current = SELECTOR_RECORD;
            break;
        }
        break;
      case MODE_SEQ:
        switch (button) {
          case 2:
            selector_current = SELECTOR_POV;
            activePadInput = pm_current;
            break;

          case 1:
            switch (pm_current) {
              case POV_NOTE:
                selector_current = SELECTOR_CHANNEL;
                activePadInput = pm_selectedChannel;
                break;
              case POV_CHAN:
                selector_current = SELECTOR_NOTE;
                activePadInput = pm_selectedNote;
                break;
            }
            break;
          case 0:
            selector_current = SELECTOR_MODULUS;
            activePadInput = seq_modulus;
            break;
        }
        break;
      default:
        selector_current = SELECTOR_NONE;
    }
  }
  lcdPrintB("sel " + getString_SELECTOR(selector_current));
}
//
void onSelectorButtonReleased(byte button) {
  lcdPrintB("-");
  //pendant: when a selector button is released, other selector button may be remaining on.
  //this should read the selectorbutton pressed bitmap and then change into other selector mode accordingly
  selector_current = SELECTOR_NONE;
  lcdUpdateStatus();
}
void onSelectorButtonHold(byte button) {}

//change mode to and perform all necessary operations with respect to that.
//avoid setting up many variables here because it gets messy. instead the program should check the currentmode and act accordingly
void changeMode(byte to) {
  to %= MODES_COUNT;
  m_mode = to;
  lcdUpdateMode();
};
void changePerformanceLayer(byte to) {
  to %= POVS_COUNT;
  pm_current = to;
  lcdUpdateMode();// pm_POVList[to] + " set"
}



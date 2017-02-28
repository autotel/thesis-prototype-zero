/**
  Check if a given frame has a note on it or not.
  a frame is the smallest unit of time in the sequencer memory. All event data is quantized into these frames.
  @method seq_frameHasNote
  @return {boolean} true if there is a note, false if there is not.
  @example seq_frameHasNote(32);
*/

void evaluateSequence() {
  // lcdPrintA("EVA" + String(seq_currentStep16, DEC));
  for (byte a = 0; a < seq_enceLength; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the 0x80 mask
    if ((seq_ence[a][0]) == (seq_currentStep16x2 | 0x80)) {
      sendMidi(0x90 | seq_ence[a][1], seq_ence[a][2], seq_ence[a][3]);
      // lcdPrintA("HAS"+String(seq_currentStep16x2,DEC));
    }
    //find note off events from lengths. replace function with one more optimized
    if (seq_ence[a][0] & 0x80) {
      if (((seq_ence[a][0] & 0x7F) + seq_ence[a][4]) == seq_currentStep16x2)
        sendMidi(0x80 | seq_ence[a][1], seq_ence[a][2], 0);
      // lcdPrintA("HAS"+String(seq_currentStep16x2,DEC));
    }
  }
}

bool seq_frameHasNote(byte frame, bool contextSensitive) {

  for (byte a = 0; a < seq_enceLength; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the 0x80 mask
    //the rest 7 lsb's indicate the time.
    if ((seq_ence[a][0]) == (frame | EVNT_ACTIVEFLAG))
      if (contextSensitive) {
        //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
        switch (pm_current) {
          //grades
          case POV_GRADE:
            // seq_ence[frame][(active+time),(type+channel),(number),(velocity or value)]
            if ((seq_ence[a][1]) == pm_selectedChannel | EVNTYPE_GRADE<<4) {
              return true;
            }
            break;
          //notes
          case POV_NOTE:
            if (((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE<<4))) && (seq_ence[a][2] == pm_selectedNote)) {
              return true;
            }
            break;
          //channels
          case POV_CHAN:
            if ((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE<<4))) {
              return true;
            }
            break;
        }
      } else {
        return true;
      }
  }
  return false;
  //return (seq_ence[frame][0]) != 0x0;
}



byte seq_nextEmptyFrame() {
  for (byte a = 0; a < seq_enceLength; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the EVNT_ACTIVEFLAG mask
    if (!(seq_ence[a][0] & EVNT_ACTIVEFLAG))
      return a;
  }
  lcdPrintB(F("MEMORY OVERFLOW"));
  return 0;
}
byte seq_findEvent(byte frame, byte head, byte number) {
  for (byte a = 0; a < seq_enceLength; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the EVNT_TIME_MASK mask
    if ((seq_ence[a][0] & EVNT_TIME_MASK) == frame)
      return a;
  }
  return -1;
}
void seq_addNote(byte frame, byte channel, byte note, byte velo, byte len) {
  byte ef = seq_nextEmptyFrame();
  //set the event to active
  seq_ence[ef][0] = frame | EVNT_ACTIVEFLAG;
  //set the event type to note
  seq_ence[ef][1] = (channel & 0xF)| EVNTYPE_NOTE<<4;
  seq_ence[ef][2] = note;
  seq_ence[ef][3] = velo;
  seq_ence[ef][4] = len;
}
void seq_addNote(byte frame, byte channel, byte note, byte velo) {
  seq_addNote(frame, channel, note, velo, 1);
}
void seq_removeNote(byte frame, byte channel, byte note) {
  byte ff = seq_findEvent(frame, 0x90 | channel, note);
  if (ff)
    seq_ence[ff][0] = 0;
}



byte getNoteFromScale(byte scalenumber, byte grade, byte octave) {
  byte ret = 0;
  //grade may warp around scale
  octave += grade / structure_scales[scalenumber][0];

  //fix grade if is larger than scale length
  grade = grade % structure_scales[scalenumber][0];

  ret = octave * 12 + structure_scales[scalenumber][1]; //put ret to the base note on current octave;

  //count 1's until we get to the grade
  byte count = 0;
  byte found = 0;
  while (found <= grade) {
    if ((structure_scales[scalenumber][2] ) & (0x1 << count)) {
      found++;
    }
    count++;
  }
  //lcdPrintA(String(count, DEC) + "," + String(octave, DEC) + "," + String(found, DEC));
  ret += count;

  /*
    int structure_scales[16][3] = {
    //chromatic c
    {
      12, 0,
      0b111111111111//all 12 notes are used in chromatic
    }
    }*/
  return ret;
}
/*byte getNoteFromScale() {
  return getNoteFromScale(se_selectedScale);
  }*/
byte countOnes(int i) {
  //  +((i>>16)&1)
  return ((i >> 15) & 1)
         + ((i >> 14) & 1)
         + ((i >> 13) & 1)
         + ((i >> 12) & 1)
         + ((i >> 11) & 1)
         + ((i >> 10) & 1)
         + ((i >> 9) & 1)
         + ((i >> 8) & 1)
         + ((i >> 7) & 1)
         + ((i >> 6) & 1)
         + ((i >> 5) & 1)
         + ((i >> 4) & 1)
         + ((i >> 3) & 1)
         + ((i >> 2) & 1)
         + ((i >> 1) & 1)
         + (i & 1);
}
//recalculate all the modulus of currentStep128x12
void recalculateSeqSteps() {
  seq_currentStep128 = seq_currentStep128x12 / 12;
  seq_currentStep128x2 = seq_currentStep128x12 / 6;
  seq_currentStep16 = seq_currentStep128 % 16;
  seq_currentStep16x2 = seq_currentStep128x2 % 16;
}


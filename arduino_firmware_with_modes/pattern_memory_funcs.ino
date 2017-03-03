/**
  Check if a given frame has a note on it or not.
  a frame is the smallest unit of time in the sequencer memory. All event data is quantized into these frames.
  @method seq_frameHasNote
  @return {boolean} true if there is a note, false if there is not.
  @example seq_frameHasNote(32);
*/

void evaluateSequence() {
  // lcdPrintA("EVA" + String(seq_currentStep16, DEC));
  for (byte a = 0; a < SQLN; a++) {
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
  if (contextSensitive) {
    return seq_findEvent(frame, pov_current) != -1;
  } else {
    return seq_findEvent(frame, POV_ANY);
  }
  /*
    for (byte a = 0; a < SQLN; a++) {
      //the first bit in seq_ence index 0 indicates wether this event is active, hence the 0x80 mask
      //the rest 7 lsb's indicate the time.
      if ((seq_ence[a][0]) == (frame | EVNT_ACTIVEFLAG))
        if (contextSensitive) {
          //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
          switch (pov_current) {
            //grades
            case POV_GRADE:
              // seq_ence[frame][(active+time),(type+channel),(number),(velocity or value)]
              if ((seq_ence[a][1]) == pm_selectedChannel | EVNTYPE_GRADE << 4) {
                return true;
              }
              break;
            //notes
            case POV_NOTE:
              if (((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE << 4))) && (seq_ence[a][2] == pm_selectedNote)) {
                return true;
              }
              break;
            //channels
            case POV_CHAN:
              if ((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE << 4))) {
                return true;
              }
              break;
          }
        } else {
          return true;
        }
    }
    return false;*/
  //return (seq_ence[frame][0]) != 0x0;
}



byte seq_nextEmptyFrame() {
  for (byte a = 0; a < SQLN; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the EVNT_ACTIVEFLAG mask
    if (!(seq_ence[a][0] & EVNT_ACTIVEFLAG))
      return a;
  }
  lcdPrintB(F("MEMORY OVERFLOW"));
  return 0;
}

byte seq_findEventsUnderButton(byte button, byte * output, byte maxResults) {
  //teh call of the function should provide with an array to fill with the results,
  //and a maximum amount of results to find, to ensure that the array is never overflows
  //this function returns the amount of results found, and fills the output array with the
  //indexes of the events that match the search criteria. these indexes are to be used
  //in the seq_ence. The search criteria is according to the current context (POV/MODULUS/pov_current)
  byte frame=button % seq_modulus;
  byte results = 0;
  for (byte a = 0; (a < SQLN) && results < maxResults; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the 0x80 mask
    //the rest 7 lsb's indicate the time.
    if ((seq_ence[a][0]) == ((frame) | EVNT_ACTIVEFLAG))
      //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
      switch (pov_current) {
        //grades
        case POV_GRADE:
          // seq_ence[frame][(active+time),(type+channel),(number),(velocity or value)]
          if ((seq_ence[a][1]) == pm_selectedChannel | EVNTYPE_GRADE << 4) {
            *(output + results) = a;
            results++;
          }
          break;
        //notes
        case POV_NOTE:
          if (((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE << 4))) && (seq_ence[a][2] == pm_selectedNote)) {
            *(output + results) = a;
            results++;
          }
          break;
        //channels
        case POV_CHAN:
          if ((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE << 4))) {
            *(output + results) = a;
            results++;
          }
          break;
        case POV_ANY:
          *(output + results) = a;
          results++;
          break;
      }
  }
  return results;
}
int seq_findEvent(byte frame, byte pov) {
  for (byte a = 0; a < SQLN; a++) {
    //the first bit in seq_ence index 0 indicates wether this event is active, hence the 0x80 mask
    //the rest 7 lsb's indicate the time.
    if ((seq_ence[a][0]) == (frame | EVNT_ACTIVEFLAG))
      //"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
      switch (pov) {
        //grades
        case POV_GRADE:
          // seq_ence[frame][(active+time),(type+channel),(number),(velocity or value)]
          if ((seq_ence[a][1]) == pm_selectedChannel | EVNTYPE_GRADE << 4) {
            return a;
          }
          break;
        //notes
        case POV_NOTE:
          if (((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE << 4))) && (seq_ence[a][2] == pm_selectedNote)) {
            return a;
          }
          break;
        //channels
        case POV_CHAN:
          if ((seq_ence[a][1]) == (pm_selectedChannel | (EVNTYPE_NOTE << 4))) {
            return a;
          }
          break;
        case POV_ANY:
          return a;
          break;
      }
  }
  return -1;
  //return (seq_ence[frame][0]) != 0x0;
}
//find event aware of POV
byte seq_findEventPOV() {
}
void seq_addNote(byte frame, byte channel, byte note, byte velo, byte len) {
  byte ef = seq_nextEmptyFrame();
  //set the event to active
  seq_ence[ef][0] = frame | EVNT_ACTIVEFLAG;
  //set the event type to note
  seq_ence[ef][1] = (channel & 0xF) | (EVNTYPE_NOTE << 4);
  seq_ence[ef][2] = note;
  seq_ence[ef][3] = velo;
  seq_ence[ef][4] = len;

}
void seq_addNote(byte frame, byte channel, byte note, byte velo) {
  seq_addNote(frame, channel, note, velo, 1);
}
void seq_removeNote(byte frame, byte pov) {
  byte ff = seq_findEvent(frame, pov);
  if (ff != -1)
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
  //pendant: there should be a clearer naming system for all these steps cycles
  seq_currentStep128 = seq_currentStep128x12 / 12;
  seq_currentStep128x2 = seq_currentStep128x12 / 6;
  seq_currentStep16 = seq_currentStep128 % 16;
  seq_currentStep16x2 = seq_currentStep128x2 % 16;
  seq_currentMicroStep12 = seq_currentStep128x12 % 12;
}
byte seq_getCurrentStepQuantized() {
  if (seq_currentMicroStep12>6) {
    return seq_currentStep16x2+1;
  } else {
    return seq_currentStep16x2;
  }
}

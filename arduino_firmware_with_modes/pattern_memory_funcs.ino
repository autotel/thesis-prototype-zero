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
    if ((structure_scales[scalenumber][2] ) & (0x1<<count)) {
      found++;
    }
    count++;
  }
  lcdPrintA(String(count,DEC)+","+String(octave,DEC)+","+String(found,DEC));
  ret+=count;

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


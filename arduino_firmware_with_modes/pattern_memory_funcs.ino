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

#ifndef LedMatrix_h
#define LedMatrix_h

#include "WProgram.h"

class LedMatrix
{
  public:
    LedMatrix();
    void setup();
    void change();
    void refresh();
    void sum(int,int);
    void diff(int,int);
    void sett(int,int);
  private:
    int _pin;
    long lastchange;
    int byteMapRed;
    int byteMapBlue;
    int registerOffset;
    int clockpin;
    int latchpin;
    int serialpin;

};

#endif



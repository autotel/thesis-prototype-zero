#ifndef LedMatrix_h
#define LedMatrix_h

#include "Arduino.h"

class LedMatrix
{
  public:
    LedMatrix();
    void setup();
    void change();
    void refresh();
    int refresh(byte);
    void sum(int,int,int);
    void diff(int,int,int);
    void sett(int,int,int);
    int buttonPressed(byte);
    int analogA;
    int analogB;
  private:
    int _pin;
    long lastchange;
    int  byteMaps [4];
    int registerOffset;
    int clockpin;
    int latchpin;
    int serialpin;

};

#endif



#ifndef IntPattern_h
#define IntPattern_h

#include "WProgram.h"

class IntPattern
{
  public:
    IntPattern();
    void setup();
    void addEvent(int time,int event);
    void removeEvent(int time);
    int getEvent(int time);
    int getBitmap();
  private:
    int events [];
    int eventBitMap;
};

#endif



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
    void sum(int, int, int);
    void diff(int, int, int);
    void sett(int, int, int);
    int buttonPressed(byte);
    int analogA;
    int analogB;
    
    //functions the programmer can use to attach function handlers to button pad events
    //is afunction that takes as arguments a function, that return void and is called passing a byte as argument
    //in the future the callback will be called with two values; the second being the pressure intensity
    void onButtonPressed(void (*cbk)(byte)) {
      _buttonPressedCallback = cbk;
    }
    void (*_buttonPressedCallback)(byte);
    //is afunction that takes as arguments a function, that return void and is called passing a byte as argument
    void onButtonReleased(void (*cbk)(byte)) {
      _buttonReleasedCallback = cbk;
    }
    void (*_buttonReleasedCallback)(byte);
    byte pixelRefresh;
    void refreshNextPixel();
  private:
    
    int _pin;
    long lastchange;
    /*bitmaps is an array of four bitmaps:
      [0] contains 16 bits representing the pressed state of each button (is like a cheaper array of booleans)
       The buttons could potentially be pressure sensitive, and thus use a byte per button
      [1-3] contain 16 bits representing which leds to turn on and off.
       A future implementation should be a byte per pixel for more colors
    */
    int  byteMaps [4];
    
};


extern LedMatrix lem;
#endif



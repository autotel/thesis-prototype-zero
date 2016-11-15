/*library for writing to a led screen through two 4051 multiplexors */
#include "WProgram.h"
#include "IntPattern.h"

//should be hashmap in the future
int events[]={0,0,0,0,
0,0,0,0,
0,0,0,0,
0,0,0,0};
int eventBitMap=0x0000;
IntPattern::IntPattern(){

}
void IntPattern::addEvent(int time,int event) {
  int modularTime=time%96;
  events[modularTime]=event;
  eventBitMap|=0x0001<<modularTime;
}
void IntPattern::removeEvent(int time){
  int modularTime=time%96;
  //eventBitMap&=~(0x0001<<modularTime);
}
int IntPattern::getEvent(int time) {
  int modularTime=time%96;
  if((0x0001<<modularTime)&eventBitMap!=0){
    return events[modularTime];
  }
  return 0;
}
int IntPattern::getBitmap() {
  return eventBitMap;
}

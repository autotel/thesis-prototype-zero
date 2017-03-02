/*encoder is conected to a muxb addr*/
/*may be able to reduce dynamic memory by using https://www.arduino.cc/en/Reference/PROGMEM progmem */

#define COMPENSATE_R 200
#define COMPENSATE_G 0
#define COMPENSATE_B 0
// seq_ence[frame][(active+time),(type+channel),(number),(velocity or value)]

//PENDIENTE: reemplazar en todos los cases por estas variables:
//"grade", "note", "channel", "CC/n", "CC/ch", "Note+A", "Note+B"
#define POV_GRADE 0
#define POV_NOTE 1
#define POV_CHAN 2
#define POV_CCN 3
#define POV_CCCH 4
#define POV_NOTEA 5
#define POV_NOTEB 6
#define POV_ANY 254
#define POV_NULL 255

#define POVS_COUNT 7

#define MODE_PERF 0
#define MODE_SEQ 1
#define MODE_JMP1 2
#define MODE_JMP2 3
#define MODE_SCALE 4
#define MODE_CHRD 5
#define MODE_MIX1 6
#define MODE_MIX2 7
#define MODE_ARP 8
#define MODE_DEATH 9

#define MODE_TSX2 10
#define MODE_TSX3 11
#define MODE_TSX4 12
#define MODE_TSX5 13
#define MODE_TSX6 14
#define MODE_ERR_ 15

#define MODES_COUNT 10

#define SELECTORGRAPH_MODE 15
#define SELECTORGRAPH_POV 16
#define SELECTORGRAPH_POINT 0
#define SELECTORGRAPH_BINARY 1
#define SELECTORGRAPH_CALCULATOR 2
#define SELECTORGRAPH_RECORD 3

//keep correspondance with selectors names array
#define SELECTOR_NONE 0
#define SELECTOR_MODE 1
#define SELECTOR_POV 2
#define SELECTOR_CHANNEL 3
#define SELECTOR_NOTE 4
#define SELECTOR_GRADE 5
#define SELECTOR_RECORD 6

#define EVNTYPE_GRADE 0
#define EVNTYPE_NOTE 1
#define EVNTYPE_SEQ 2
#define EVNTYPE_CHOR 3

#define EVNT_ACTIVEFLAG 0X80
#define EVNT_TIME_MASK 0x7f





///make sequence memory longer, but optimize finding algorhythms *after*

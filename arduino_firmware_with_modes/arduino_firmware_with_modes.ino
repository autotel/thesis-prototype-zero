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

#define MODE_PERF 0
#define MODE_SEQ 1
#define MODE_JMP1 2
#define MODE_JMP2 3
#define MODE_SCALE 4
#define MODE_CHRD 5
#define MODE_MIX1 6
#define MODE_MIX2 7
#define MODE_ARP 8
#define TSX1 9
#define TSX2 10
#define TSX3 11
#define TSX4 12
#define TSX5 13
#define TSX6 14
#define ERR_ 15

#define EVNTYPE_GRADE 0
#define EVNTYPE_NOTE 1
#define EVNTYPE_SEQ 2
#define EVNTYPE_CHOR 3

#define EVNT_ACTIVEFLAG 0X80
#define EVNT_TIME_MASK 0x7f





///make sequence memory longer, but optimize finding algorhythms *after*

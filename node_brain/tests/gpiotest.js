var device='/dev/ttyS0';
var baudrate=9600;
var count=0;
// import wiringpi2 as wiringpi
var wpi = require('wiring-pi');
// wiringpi.wiringPiSetup()
wpi.wiringPiSetup();
// serial = wiringpi.serialOpen('/dev/ttyAMA0',9600)
var serial=-1;
var tryCount=0;
serial=wpi.serialOpen(device, baudrate);
// while(serial==-1){
  serial=wpi.serialOpen(device, baudrate);
  console.log("trying connect to serial "+device+"@"+baudrate+" status:",serial);
// }
setInterval(function(){
  // wiringpi.serialPuts(serial,'hello world!')
  wpi.serialPuts(serial,'hi there\n');
  console.log("sent serial "+String(count));
  var rStr="";
  while(wpi.serialDataAvail(serial)){
    rStr+=wpi.serialGetchar(serial);
  }
  console.log("r:"+rStr);
  count++;
},2000);


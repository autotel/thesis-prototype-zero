const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
var question=require('./components/interactive-console.js');
raspi.init(() => {
  var serial = new Serial({baudRate:115200});
  serial.open(() => {
    /**/console.log("serial opened");
    serial.write('Hello from raspi-serial');
    serial.on('data', (data) => {
      /**/console.log("<<",data);
      // serial.write('ack '+String.from(data));
    });

    function ask(){
      question('>>:',function(a){
        serial.write(a,function(error){if (error) console.error("message not sent: ",e)});
        ask();
      });
    }


    ask();


  });
});


const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

raspi.init(() => {
  var serial = new Serial();
  serial.open(() => {
    serial.write('Hello from raspi-serial');
    serial.on('data', (data) => {
      process.stdout.write(data);
    });
  });
});
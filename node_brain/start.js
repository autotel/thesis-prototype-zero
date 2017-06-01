// var shell = require('shelljs');
const spawn  = require('child_process').spawn;
// var child=cp.fork('./startSound');
// const ls = spawn('fluidsynth',["--server","--audio-driver=alsa","-o","audio.alsa.device=hw:2","/home/pi/sounfonts/hqorch.sf2"]);//,"&"///usr/share/soundfonts/FluidR3_GM.sf2  /home/pi/sounfonts/hqorch.sf2

var timeoutSet=false;
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  if(!timeoutSet){
    timeoutSet=true;
    setTimeout(function(){
      const ss = spawn('forever',["start","/home/pi/repositories/thesis-prototype-zero/node_brain/index.js"]);//,"&"
      ss.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      ss.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      ss.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
    },5000);
  }
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// child.on('message', function(m) {
//   console.log('received: ' + m);
//   setTimeout(function(){
//     shell.echo(shell.exec('node index'));
//   },3000);
// });
// Send child process some work
// child.send('init');

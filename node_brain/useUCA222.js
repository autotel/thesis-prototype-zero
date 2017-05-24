var shell = require('shelljs');

shell.exec('fluidsynth --server --audio-driver=alsa -o audio.alsa.device=hw:2 /usr/share/sounds/sf2/FluidR3_GM.sf2 &');
//

shell.exec('node index');
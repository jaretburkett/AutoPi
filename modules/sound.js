const { exec } = require('child_process');
const tools = require('./tools');

function setVolume(percent){
    if(tools.isPi()){
        exec(`pactl set-sink-volume 0 ${percent}%`, (err, stdout, stderr) => {
            // ignore
        });
    }
}

module.exports.setVolume = setVolume;
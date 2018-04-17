const { exec } = require('child_process');
const tools = require('./tools');
// todo find a way to detect hardware for backlight. Assume official display for now

function setBrightness(percent){
    if(tools.isPi()){
        // value of 0 - 255. Don't lower below 10
        // map percent to byte value.
        const backlightValue = tools.map(percent,0,100,20,255).toFixed(0);
        exec(`echo ${backlightValue} > /sys/class/backlight/rpi_backlight/brightness`, (err, stdout, stderr) => {
            // ignore
        });
    }
}

module.exports.setBrightness = setBrightness;
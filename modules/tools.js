const os = require('os');

module.exports.map = ( x,  in_min,  in_max,  out_min,  out_max) => {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

module.exports.isPi = ()=> {
    // todo add a check for any sbc. For now, linux = yes.
    return os.platform() === 'linux';
};
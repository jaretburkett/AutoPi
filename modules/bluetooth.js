const blue = require("bluetoothctl");
const tools = require("./tools");
const log = require("./logger");
function startBluetoothService(io){
    // only do bluetooth if is pi
    if(tools.isPi()){
        // activate bluetooth
        console.log('Starting Bluetooth');
        blue.Bluetooth();

        console.log('Making Bluetooth Device Discoverable');
        blue.discoverable(true);

        log('Paired Devices');
        log(blue.getPairedDevices());

        blue.on(blue.bluetoothEvents.Controller, (controllers) =>{
            log('Controllers:' + JSON.stringify(controllers,null,2))
        });

        blue.on(blue.bluetoothEvents.DeviceSignalLevel, function(devices,mac,signal){
            log('signal level of:' + mac + ' - ' + signal);
        });

        blue.on(blue.bluetoothEvents.Device, (devices) => {
            log('devices:' + JSON.stringify(devices,null,2))
        });

        blue.on(blue.bluetoothEvents.PassKey, (passkey) => {
            log('Confirm passkey:' + passkey);
            blue.confirmPassKey(true);
        });

        const hasBluetooth=blue.checkBluetoothController();
        log('system has bluetooth controller:' + hasBluetooth);

        // if(hasBluetooth) {
        //     log('isBluetooth Ready:' + blue.isBluetoothReady);
        //     blue.scan(true);
        //     setTimeout(function(){
        //         log('stopping scan');
        //         blue.scan(false);
        //         blue.info('00:0C:8A:8C:D3:71')
        //     },20000)
        // }
    } else {
        log('This device does not have proper bluetooth hardware. No bluetooth enabled')
    }
}

module.exports = startBluetoothService;

if (require.main === module) {
    startBluetoothService(null);
}
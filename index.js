

/***************************************  Includes *********************************************/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require("fs");
var os = require('os');
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var watch = require('node-watch');
var nmea = require('node-nmea');
var SerialPort = require("serialport");


/***************************************  Vars *********************************************/

// gps config
var pid = 'ea60';
var vid = '10c4';
var baud = 115200;
var attached = false;
var gpsdevice;
var device;
var gpsdata = {};


var datadump = {};


/***************************************  Setup *********************************************/

// Open port and start listning
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// setup static files directory
app.use(express.static(__dirname + '/html'));


/*****************************  Process Web Interface ************************************/

/* Websocket */
io.on('connection', function (socket) {
    // send info to all clients
    io.emit('update', datadump);
    /* Websocket */
    // socket.on('sayEverywhere', function (say) {
    //     console.log('Got say Everywhere');
    //     io.emit('say', say);
    // });
});
/* end websocket */

/*****************************  Timers and Routines ************************************/
/* Timer  runs every 1/10th seconds*/
setInterval(function () {
    sendDump();
}, 100);

/* Timer  runs every 1 seconds*/
setInterval(function () {
    // sendDump();
}, 1000);

/* Timer runs every hour */
setInterval(function () {

}, 60 * 60 * 1000);

/****************************** Functions **********************************************/

function sendDump() {
    io.emit('update', datadump); // send update to connected websockets
}

function sendGPS(){
    io.emit('gps', gpsdata); // send update to connected websockets
}
function isDevice(port) {
    try{
        if (typeof port.pnpId !== "undefined") {
            // windows 10 fix
            if (port.pnpId.indexOf(vid.toUpperCase()) != -1 && port.pnpId.indexOf(pid.toUpperCase()) != -1) {
                return true;
            }
        }
        if (port.vendorId.indexOf(vid) != -1 && port.productId.indexOf(pid) != -1) {
            return true;
        }
        // not our device
        else {
            return false;
        }
    }
    catch(e){
        return false;
    }

}

/****************************** Serial Scanner *************************************/

var serialscanner = setInterval(function () {
    try {
        if (!attached) {
            var found = false;
            SerialPort.list(function (err, ports) {

                ports.forEach(function (port) {
                    if (isDevice(port)) {
                        found = true;
                        gpsdevice = port;
                        console.log("Device Found:");
                        console.log(JSON.stringify(gpsdevice));
                        attached = true;
                        device = new SerialPort(gpsdevice.comName, {
                            baudrate: baud,
                            parser: SerialPort.parsers.readline('\n'),
                            dataBits: 8,
                            parity: 'none',
                            stopBits: 1,
                            flowControl: false
                        });

                        device.on('error', function (err) {
                            console.log('Error: ', err);
                            console.log('Device Error');
                            attached = false;
                            device.close(function(){

                            });
                        });
                        device.on('data', function (data) {
                            try {
                                // clean data
                                data = data.replace(/(\r\n|\n|\r|\\r)/gm, "");
                                data = data.trim();
                                //console.log(data);
				// only parse good data
                                if (data.indexOf('$GPRMC') != -1) {
                                    gpsdata = nmea.parse(data.toString());
                                    if(gpsdata.valid){
				        // add mph
                                        gpsdata.speed.mph = gpsdata.speed.kmh * 0.621371192;
                                        // round
                                        gpsdata.speed.mph = Math.round(gpsdata.speed.mph * 100) / 100;
                                        // console.log(gpsdata);
				    }
                                    sendGPS();
                                }

                                // console.log(data);

                                // parseSerial(data);
                                // console.log(data);
                            } catch(e){
                                console.log(e);
                            }
                        });
                        device.on('disconnect', function () {
                            console.log("Device Disconnected");
                            console.log("Looking for Device");
                            attached = false;
                        });
                        // device.readTimeout(1000);


                    } // if found device

                });
            }); // find ports
        } // if not attached
    }
    catch (e) {
        console.log('cant connect');
        console.log(e);
        attached = false;
    }
}, 1000); // - Serial Scanner


/****************************** Filechange Watcher *************************************/


watch(__dirname + '/html/', function (filename) {
    console.log(filename, ' changed.');
    // brodcast refresh to browsers
    io.emit('refresh', 1);
});


/****************************** Main code **********************************************/

console.log('View at http://localhost:8080');

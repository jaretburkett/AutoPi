var isDev = true;

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
const Readline = require('parser-readline');


/***************************************  Vars *********************************************/

// gps config
var pid = ['ea60', '01a7'];
var vid = ['10c4', '1546'];
var baud = 115200;
var attached = false;
var gpsdevice;
var device;
var gpsdata = {};


//todo populate with real data
var datadump = {
};


/***************************************  Setup *********************************************/

// Open port and start listning
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// setup static files directory
app.use(express.static(__dirname + '/build'));


/*****************************  Process Web Interface ************************************/

/* Websocket */
io.on('connection', function (socket) {
    // send info to all clients
    sendDump(socket);
});
/* end websocket */

/*****************************  Timers and Routines ************************************/
/* Timer  runs every 1/10th seconds*/
setInterval(function () {
    // sendDump();
    // if(isDev){getRandomData();}
    // sendDump(io);
}, 100);

/* Timer  runs every 1 seconds*/
setInterval(function () {
    if (isDev) {
        // getRandomData();
    }
    sendDump(io);
}, 1000);

/* Timer runs every hour */
setInterval(function () {

}, 60 * 60 * 1000);

/****************************** Functions **********************************************/

function sendDump(socket) {
    // io.emit('update', datadump); // send update to connected websockets
    socket.emit('store', datadump);
}

function sendGPS() {
    io.emit('store', gpsdata); // send update to connected websockets
}

function setGpsStatus(strength){
    io.emit('store', {gpsSignalStrength:strength});
}
function isDevice(port) {
    try {
        if (typeof port.pnpId !== "undefined") {
            // windows 10 fix
            for (let i = 0; i < vid.length; i++) {
                for (let x = 0; x < pid.length; x++) {
                    if (port.pnpId.indexOf(vid[i].toUpperCase()) !== -1 && port.pnpId.indexOf(pid[x].toUpperCase()) !== -1) {
                        return true;
                    }
                }
            }
        }

        if (vid.includes(port.vendorId) && pid.includes(port.productId)) {
            return true;
        }
        // not our device
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }

}

/****************************** Serial Scanner *************************************/

var serialscanner = setInterval(function () {
    try {
        if (!attached) {
            setGpsStatus(-1);
            var found = false;
            SerialPort.list(function (err, ports) {
                console.log('err', err);
                console.log('ports', ports);

                ports.forEach(function (port) {
                    if (isDevice(port)) {
                        found = true;
                        gpsdevice = port;
                        console.log("Device Found:");
                        console.log(JSON.stringify(gpsdevice));
                        attached = true;
                        device = new SerialPort(gpsdevice.comName, {
                            baudRate: baud,
                            // parser: SerialPort.parsers.readline('\n'),
                            dataBits: 8,
                            parity: 'none',
                            stopBits: 1,
                            flowControl: false
                        });
                        const parser = device.pipe(new Readline({delimiter: '\n'}));
                        // parser.on('data', console.log);

                        device.on('error', function (err) {
                            console.log('Error: ', err);
                            console.log('Device Error');
                            attached = false;
                            device.close(function () {

                            });
                        });
                        parser.on('data', function (data) {
                            try {
                                // clean data
                                data = data.replace(/(\r\n|\n|\r|\\r)/gm, "");
                                data = data.trim();
                                //console.log(data);
                                // only parse good data
                                if (data.indexOf('$GPRMC') !== -1) {
                                    gpsdata = nmea.parse(data.toString());
                                    console.log(gpsdata);
                                    if (gpsdata.valid) {
                                        // add mph
                                        gpsdata.kmh = gpsdata.speed.kmh;
                                        let mph = gpsdata.speed.kmh * 0.621371192;
                                        // round
                                        gpsdata.mph = Math.round(mph * 100) / 100;
                                        gpsdata.coordinates = {
                                            latitude:data.loc.geojson.coordinates[0],
                                            longitude:data.loc.geojson.coordinates[1]
                                        };
                                        // console.log(gpsdata);
                                        sendGPS();
                                        setGpsStatus(1); // set to signal strength
                                    } else {
                                        // connected but no signal
                                        setGpsStatus(0);
                                    }
                                }

                                // console.log(data);

                                // parseSerial(data);
                                // console.log(data);
                            } catch (e) {
                                console.log(e);
                            }
                        });
                        //todo this doenst work anymore
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


/********************************* GPS *************************************************/
//
/****************************** Main code **********************************************/

console.log('View at http://localhost:8080');

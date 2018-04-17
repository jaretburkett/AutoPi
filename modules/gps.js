"use strict";
const nmea = require('node-nmea');
const fs = require("fs");
const os = require('os');
const SerialPort = require("serialport");
const Readline = require('parser-readline');
const pid = ['ea60', '01a7'];
const vid = ['10c4', '1546'];
const baud = 115200;
const log = require('./logger');

class GPS {
    constructor(io) {
        this.io = io;
        this.interval = null;
        this.isAttached = false;
        this.gpsData = {};
        this.gpsDevice = null;
    }

    isDevice(port) {
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
    } //isDevice

    setGpsStatus(strength) {
        this.io.emit('store', {gpsSignalStrength:strength});
    }//setGpsStatus

    sendGPS() {
        const self = this;
        this.io.emit('store', self.gpsData); // send update to connected websockets
    } // sendGPS

    parseGpsData(data){
        const self = this;
        try {
            // clean data
            data = data.replace(/(\r\n|\n|\r|\\r)/gm, "");
            data = data.trim();
            // only parse good data
            if (data.indexOf('$GPRMC') !== -1) {
                let parsedData = nmea.parse(data.toString());
                // log(parsedData);
                if (parsedData.valid) {
                    // add mph
                    self.gpsData.kmh = parsedData.speed.kmh;
                    let mph = parsedData.speed.kmh * 0.621371192;
                    // round
                    self.gpsData.mph = Math.round(mph * 100) / 100;
                    self.gpsData.coordinates = {
                        latitude:parsedData.loc.geojson.coordinates[0],
                        longitude:parsedData.loc.geojson.coordinates[1]
                    };
                    self.sendGPS();
                    self.setGpsStatus(1); // set to signal strength
                } else {
                    // connected but no signal
                    self.setGpsStatus(0);
                }
            }
        } catch (e) {
            log(e);
        }
    } // parseGpsData

    start(){
        const self = this;
        this.interval = setInterval(function () {
            try {
                if (!self.isAttached) {
                    self.setGpsStatus(-1);
                    let found = false;
                    SerialPort.list((err, ports) => {
                        if(err){
                            log('err', err);
                        }
                        log('ports', ports);

                        ports.forEach(function (port) {
                            if (self.isDevice(port)) {
                                found = true;
                                log(`Device Found: ${JSON.stringify(port)}`);
                                self.gpsDevice = new SerialPort(port.comName, {
                                    baudRate: baud,
                                    // parser: SerialPort.parsers.readline('\n'),
                                    dataBits: 8,
                                    parity: 'none',
                                    stopBits: 1,
                                    flowControl: false
                                });
                                self.isAttached = true;
                                const parser = self.gpsDevice.pipe(new Readline({delimiter: '\n'}));

                                // todo check if this was removed from version
                                self.gpsDevice.on('error',(err) => {
                                    log('Error: ', err);
                                    log('Device Error');
                                    self.isAttached = false;
                                    self.gpsDevice.close(function () {

                                    });
                                });

                                //parse gps data
                                parser.on('data', (data) => {
                                    self.parseGpsData(data)
                                });

                                //todo this doenst work anymore
                                self.gpsDevice.on('disconnect', () => {
                                    log("Device Disconnected");
                                    log("Looking for Device");
                                    self.isAttached = false;
                                });
                            } // if found device
                        });
                    }); // find ports
                } // if not attached
            } catch (e) {
                log('Cannot connect to GPS device');
                log(e);
                self.isAttached = false;
            }
        }, 1000); // - Serial Scanner
    }
}

module.exports = GPS;
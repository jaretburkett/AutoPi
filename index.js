const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const GPS = require('./modules/gps');
const gps = new GPS(io);
const log = require('./modules/logger');
const tools = require('./modules/tools');
const backlight = require('./modules/backlight');
const sound = require('./modules/sound');

// setup static files directory
app.use(express.static(__dirname + '/build'));

// websocket interface
io.on('connection', function (socket) {
    log('Client Connected');

    // let the client know if we have pi hardware
    socket.emit('store', {isPi:tools.isPi()});

    // backlight
    socket.on('backlight', (percent)=>{
        log(`Setting backlight to ${percent}%`);
        backlight.setBrightness(percent);
    });
    // volume
    socket.on('volume', (percent)=>{
        log(`Setting volume to ${percent}%`);
        sound.setVolume(percent);
    });

    socket.on('disconnect', ()=>{
        log('Client Disconnected');
    });
});

// start gps service
gps.start();

// Open port and start listning
server.listen(port, function () {
    log('Server listening at port %d', port);
});

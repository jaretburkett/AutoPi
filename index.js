const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const GPS = require('./modules/gps');
const gps = new GPS(io);
const log = require('./modules/logger');

// setup static files directory
app.use(express.static(__dirname + '/build'));

// websocket interface
io.on('connection', function (socket) {
    log('Client Connected');
    socket.on('disconnect', ()=>{
        log('Client Disconnected');
    })
});

// start gps service
gps.start();

// Open port and start listning
server.listen(port, function () {
    log('Server listening at port %d', port);
});

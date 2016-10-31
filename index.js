/***************************************  Includes *********************************************/
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require("fs");
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var watch = require('node-watch');

/***************************************  Vars *********************************************/
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
    getCalendar();
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

}, 60*60*1000);

/****************************** Functions **********************************************/

function sendDump() {
    io.emit('update', datadump); // send update to connected websockets
}



/****************************** Filechange Watcher *************************************/


watch(__dirname + '/html/', function(filename) {
    console.log(filename, ' changed.');
    // brodcast refresh to browsers
    io.emit('refresh', 1);
});


/****************************** Main code **********************************************/

console.log('View at http://localhost:8080');
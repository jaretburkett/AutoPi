var socket = io();
var datadump;

socket.on('update', function (data) {
    datadump = data;
});

// look for filechangge refresh signal
socket.on('refresh', function (msg) {
    location.reload();
});


$(document).ready(function(){

});

var socket = io();
var datadump;
var gpsdata = {};

socket.on('update', function (data) {
    datadump = data;
});
socket.on('gps', function (data) {
    gpsdata = data;
    showSpeed();
    console.log(gpsdata);
});

// look for filechangge refresh signal
socket.on('refresh', function (msg) {
    location.reload();
});

var speedometerGauge;
$(document).ready(function(){
    speedometerGauge = new JustGage({
        id: "speedometer",
        value: 0,
        min: 0,
        max: 100,
        label: "MPH",
        shadowOpacity: .9,
        shadowSize: 5,
        shadowVerticalOffset: 5,
        relativeGaugeSize: true,
        showMinMax: false,
        labelFontColor:"#000"
    });

});

function showSpeed(){
    try{
        speedometerGauge.refresh(Math.round(gpsdata.speed.mph));
    } catch(e){

    }

}

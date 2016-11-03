var socket = io();
var datadump;
var gpsdata = {};

socket.on('update', function (data) {
    datadump = data;
});
socket.on('gps', function (data) {
    gpsdata = data;
    showSpeed();
    // console.log(gpsdata);
});

// look for filechangge refresh signal
socket.on('refresh', function (msg) {
    location.reload();
});

var speedometerGauge;
var fuelgauge;
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
        valueFontFamily: 'Open Sans',
        showMinMax: false,
        valueMinFontSize: 40,
        labelFontColor:"#000"
    });
    fuelgauge = new fuelGauge({
        target: "#fuelgauge",
        value: 30,
        height: 200,
        width: 40,
        rounded: true
    });

});

function showSpeed(){
    try{
        speedometerGauge.refresh(Math.round(gpsdata.speed.mph));
    } catch(e){

    }

}

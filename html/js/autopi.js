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
var tmpgauge;
var rpmgauge;
var oilgauge;
var batgauge;

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
        labelFontColor:"#000",
        titlePosition:'below',
        titleMaxFontSize:0
    });
    rpmgauge = new JustGage({
        id: "rpmgauge",
        value: 50,
        min: 0,
        max: 7000,
        label: "RPM",
        shadowOpacity: .9,
        shadowSize: 5,
        shadowVerticalOffset: 5,
        relativeGaugeSize: true,
        valueFontFamily: 'Open Sans',
        showMinMax: false,
        valueMinFontSize: 20,
        labelFontColor:"#000",
        titlePosition:'below',
        titleMaxFontSize:0
    });
    fuelgauge = new fuelGauge({
        target: "#fuelgauge",
        value: 30,
        height: 300,
        width: 50,
        rounded: true,
        title: 'FUEL',
        showVal: false,
        shadow:true,
        titleBottom: true
    });
    batgauge = new fuelGauge({
        target: "#batgauge",
        value: 30,
        height: 150,
        width: 50,
        rounded: true,
        title: '<i class="fa fa-battery-half" aria-hidden="true"></i>',
        showVal: false,
        shadow:true,
        titleBottom: true
    });
    tmpgauge = new fuelGauge({
        target: "#tmpgauge",
        value: 30,
        height: 150,
        width: 50,
        rounded: true,
        title: '<i class="fa fa-thermometer-full" aria-hidden="true"></i>',
        showVal: false,
        shadow:true,
        titleBottom: true
    });
    oilgauge = new fuelGauge({
        target: "#oilgauge",
        value: 30,
        height: 150,
        width: 50,
        rounded: true,
        title: 'OIL',
        showVal: false,
        shadow:true,
        titleBottom: true
    });

});

function showSpeed(){
    try{
        speedometerGauge.refresh(Math.round(gpsdata.speed.mph));
    } catch(e){

    }
}

function nightMode(){
    $('.FGbox1').css('background-color', '#5A5A5A');
    $('body').css('background-color', '#151515');
    $('svg path:nth-child(3)').css({ fill: "#5A5A5A" });
}
function dayMode(){
    $('.FGbox1').css('background-color', '#edebeb');
    $('body').css('background-color', '#a7a7a7');
    $('svg path:nth-child(3)').css({ fill: "#edebeb" });
}

import {autorun, observable} from 'mobx';
import openSocket from 'socket.io-client';
import {startWorkers} from './tools/workers';
import moment from 'moment';
const socketURL = process.env.NODE_ENV === 'development'? 'http://localhost:8080':'/';
const socket = openSocket(socketURL);

class Store {
    // connection
    @observable history = null;
    @observable gpsSignalStrength = -1; // -1 no device, 0 no signal, 1 connected
    @observable time = moment();
    @observable connected = false;
    @observable coordinates = { // just the vegas strip for now
        latitude:36.112657,
        longitude:-115.172803
    };
    @observable mapZoom = 17;
    @observable mph = null;
    @observable kmh = null;
    @observable speed = 0;
    @observable speedFormat = 'mph';

    @observable brightness = 100;
    @observable volume = 80;
}

let store = window.store = new Store();

export default store;

autorun(()=>{
});

// start workers
startWorkers(store);

window.socket = socket;
// store updater
socket.on('connect', function() {
    console.log(`Connected to ${socketURL}`);
    store.connected = true;
});

socket.on('disconnect', function () {
    console.log('Disconnected');
    store.connected = false;
});
socket.on('update', function (data) {
    // console.log('update', data);
});

socket.on('gps', function (data) {
    console.log('gps', data);
});

socket.on('store', function (data) {
    for(let key in data){
        store[key] = data[key];
        // save speed based on setting
        if(key === store.speedFormat){
            store.speed = data[key];
        }
    }
});
import {autorun, observable} from 'mobx';
import openSocket from 'socket.io-client';
import {startWorkers} from './tools/workers';
import moment from 'moment';
const socketURL = process.env.NODE_ENV === 'development'? 'http://localhost:8080':'/';
const socket = openSocket(socketURL);

class Store {
    // connection
    @observable history = null;
    @observable time = moment();
    @observable connected = false;
    @observable coordinates = null;
    @observable mapZoom = 17;
    @observable speed = 12;
    @observable speedFormat = 'mph';
    @observable showMap = false;
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
    }
});
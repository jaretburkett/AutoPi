import {observable} from 'mobx';
import openSocket from 'socket.io-client';
import moment from 'moment';
// set socket url for development since react dev is on a separate port
const socketURL = process.env.NODE_ENV === 'development'? 'http://localhost:8080':'/';
const socket = openSocket(socketURL);

class Store {
    // connection
    @observable isPi = false;
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

// attach store to window for development purposes
let store = window.store = new Store();

export default store;
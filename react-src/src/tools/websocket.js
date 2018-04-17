import openSocket from 'socket.io-client';
const socketURL = process.env.NODE_ENV === 'development'? 'http://localhost:8080':'/';
const socket = openSocket(socketURL);

export function startWebsocket(store){
    // assign to the window object for development
    window.socket = socket;
    socket.on('connect', () => {
        console.log(`Connected to ${socketURL}`);
        store.connected = true;
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from websocket');
        store.connected = false;
    });

    socket.on('store', (data) => {
        for(let key in data){
            store[key] = data[key];
            // save speed based on setting
            if(key === store.speedFormat){
                store.speed = data[key];
            }
        }
    });
}
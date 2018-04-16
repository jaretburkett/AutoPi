let isFirstRun = true;
let isRunning = false;
let isWatching = false;


function onError(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
}

export function updateLocation(store) {
    if (navigator.geolocation) {
        // due to this being an interval function, only run it if it is not running
        // to prevent stack overflow
        const options = {
            enableHighAccuracy: false,
            maximumAge: 1000 * 60 * 60 *24 // allow up to 24 hour cache for fast first load
        };
        if (!isRunning) {
            console.log('Getting cordinates');
            isRunning = true;
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                store.cordinates = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                };
                isRunning = false;
            }, onError,options);
        }
    } else {
        if (isFirstRun) {
            console.log('Geolocation is not supported by this browser');
            isFirstRun = false;
        }
    }
}

export function watchLocation(store) {
    if(!isWatching){
        if (navigator.geolocation) {
            console.log('Watching cordinates');
            isWatching = true;
            navigator.geolocation.watchPosition(function (position) {
                console.log('position update',position);
                store.cordinates = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                };
            });
        } else {
            if (isFirstRun) {
                console.log('Geolocation is not supported by this browser');
                isFirstRun = false;
            }
        }
    }
}
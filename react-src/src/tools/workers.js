import moment from 'moment';
import {watchLocation, updateLocation} from './location';

function startUp(store){
    // updateLocation(store);
    // watchLocation(store);
}
function everySecond(store){
    store.time = moment();
}
function everyTenSeconds(store){
}
function everyThirtySeconds(store){
}
function everyMinute(store){
}


// start all the workers
export function startWorkers(store){
    setInterval(()=>{
        everySecond(store);
    },1000);

    setInterval(()=>{
        everyTenSeconds(store);
    },10000);

    setInterval(()=>{
        everyThirtySeconds(store);
    },30000);

    setInterval(()=>{
        everyMinute(store);
    },60000);

    // call all first
    everySecond(store);
    everyTenSeconds(store);
    everyThirtySeconds(store);
    everyMinute(store);
    startUp(store);
}
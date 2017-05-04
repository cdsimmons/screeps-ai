// Required files
var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: helpers/timeout');

// Used to perform a task every certain number of ticks...

var mod = {};
mod.private = {};
mod.public = {};

// delayed('key', 10);... return true if delayed, false if not...
mod.public.waiting = function(key, delay = 5) {
    if(!Memory.timeout) {
        Memory.timeout = {};
    }

    // If the delay exists and we've waited long enough then it's not delayed
	if(Memory.timeout[key] !== undefined) {
        if(Game.time > Memory.timeout[key].delayedUntil) {
            delete Memory.timeout[key];
            return false;
        }
    } else {
        // Otherwise create it
        Memory.timeout[key] = {};
        Memory.timeout[key].delayedUntil = Game.time + delay;
        Memory.timeout[key].delayedAt = Game.time;
    }

    // And return that it is delayed
    return true;
}


// debounce...
// Basically keep creating timeout even if it exists... return true if timeout ever reached

module.exports = mod.public;
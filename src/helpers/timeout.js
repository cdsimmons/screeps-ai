// Log
log('Loading: helpers/timeout');

// Used to perform a task every certain number of ticks...
global.timeout = function() {
    // Init the module
    var mod = {};
    mod.private = {};
    mod.public = {};

    if(!Memory.timeout) {
    	Memory.timeout = {};
    }

    // delayed('key', 10);... return true if delayed, false if not...
    mod.public.waiting = function(key, delay = 5) {
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

    return mod.public;
}();


// Required files
var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: helpers/cache');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// If current tick is greater or equal to when the cache was going to expire...
mod.private.expired = function(key) {
	return (Game.time >= Memory.cache[key].expiresAt);
}

// Idea being that we want to spread out when we recalc a cache value...
// Eg. tick 120 has 2 object expirations, 121 has 1, 123 as 3, but 124 as 0... this makes 124 the best time to expire this data
// Instead of getting 10 methods bunched up at once, we get something like 1 or 2 at a time...
// This isn't actually necessary because of CPU bucket... just wanted to do it :P
mod.private.spread = function(expiry) {
    var currentTime = Game.time;
    var bestExpiry = 0;
    var bestExpiryCount;

    // Count all of the current expiration dates...
    var expiries = _.countBy(Memory.cache, function(cache) {
        return cache.expiresAt;
    });

    // Add missing counts... add 5 from expiry... 5 is our offset window
    for(var i = expiry; i < (expiry + 5); i++) {
        // Fill in missing numbers...
        if(!expiries[i]) {
            expiries[i] = 0;
        }

        // Init best expiry...
        if(bestExpiry === 0) {
            bestExpiry = i;
            bestExpiryCount = expiries[i];
        }

        // If the number of expiries is less than our best count, then set this position to be the best expiry time
        if(expiries[i] < bestExpiryCount) {
            bestExpiry = i;
            bestExpiryCount = expiries[i];
        }
    }

    return bestExpiry;
}

mod.public.store = function(key, value, expiry = 5, offset = true) {
    let expiresAt = Game.time + expiry;

    if(!Memory.cache) {
        Memory.cache = {};
    }

    if(Memory.cache[key]) {
        delete Memory.cache[key];
    }

    // Trying to spread out the cache... make it expire at a different time than others, so that we can even out the demand
    if(offset) {
        //expiresAt = mod.private.spread(expiresAt);
    }

	Memory.cache[key] = {};
	Memory.cache[key].value = value;
	Memory.cache[key].expiresAt = expiresAt;

	return value;
}

mod.public.retrieve = function(key) {
    if(!Memory.cache) {
        Memory.cache = {};
    }

	if(Memory.cache[key]) {
		// If not expired then get it and return! Otherwise delete and fall to returning null
		if(!mod.private.expired(key)) {
			return Memory.cache[key].value;
		} else {
			delete Memory.cache[key];
		}
	}

	return null;
}

// Return for testing...
mod.public.private = mod.private;

module.exports = mod.public;
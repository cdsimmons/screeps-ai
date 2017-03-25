// Log
log('Loading: helpers/cacher');

// Use tick counts, called by the getter I suppose?
global.cacher = function() {
    // Init the module
    var mod = {};
    mod.private = {};
    mod.public = {};

    if(!Memory.cacher) {
    	Memory.cacher = {};
    }

    // If current tick is greater or equal to when the cache was going to expire...
    mod.private.expired = function(key) {
    	return (Game.time >= Memory.cacher[key].expiresAt);
    }

    mod.public.store = function(key, value, expiry = 5) {
        if(Memory.cacher[key]) {
            delete Memory.cacher[key];
        }

    	Memory.cacher[key] = {};
    	Memory.cacher[key].value = value;
    	Memory.cacher[key].createdAt = Game.time;
    	Memory.cacher[key].expiresAt = Game.time + expiry;

    	return value;
    }

    mod.public.retrieve = function(key) {
    	if(Memory.cacher[key]) {
    		// If not expired then get it and return! Otherwise delete and fall to returning null
    		if(!mod.private.expired(key)) {
    			return Memory.cacher[key].value;
    		} else {
    			delete Memory.cacher[key];
    		}
    	}

    	return null;
    }

    return mod.public;
}();


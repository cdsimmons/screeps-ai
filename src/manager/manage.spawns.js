// Required modules
var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: manager/manage_spawns');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// Limiting spawns to hubs, since every spawn should be in a hub really, and we need to check against haulers/miners for that hub...
// When it comes to spawning combat creeps, I don't think it should make a big difference
mod.public = function() {
    log.cpu('manage.spawns', 'start');

    // Loop all spawns...
    for(let spawn of Game.spawns) {
    	// If not already spawning...
    	if(!spawn.spawning) {
	        // If we don't have any miners or haulers, and spawner is not regenerating energy anymore... then we're forced to create whatever we can by trimming...
	        if(!spawn.willRecoverEnergy()) {
	        	spawn.createCreepInQueue(true);
	        } else {
	        	// Otherwise we'll just keep checking if we can create it, and create it when we can...
	    		spawn.createCreepInQueue();
	        }
    	}
    }

    log.cpu('manage.spawns', 'end');
}

module.exports = mod.public;
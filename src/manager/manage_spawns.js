// Log
log('Loading: manager/manage_spawns');

// Limiting spawns to hubs, since every spawn should be in a hub really, and we need to check against haulers/miners for that hub...
// When it comes to spawning combat creeps, I don't think it should make a big difference
global.manage.spawns = function(hub) {
    log.cpu('manage.spawns', 'start');

	// === Spawns
    if(hub.spawns.length > 0) {
        // Check for energy... regenerating, can create, etc... hmm, can't check can create here I think as I don't know the queue... I suppose leave it in createCreeps for now
        // Check for war mode, renewal queue, etc...

        for(let spawn of hub.spawns) {
        	// If not already spawning...
        	if(!spawn.spawning) {
		        // If we don't have any miners or haulers, and spawner is not regenerating energy anymore... then we're forced to create whatever we can by trimming...
		        if((hub.haulerCreeps.length === 0 || hub.minerCreeps.length === 0) && !spawn.isRegenerating()) {
		        	spawn.createCreepInQueue(true);
		        } else {
		        	// Otherwise we'll just keep checking if we can create it, and create it when we can...
		    		spawn.createCreepInQueue();
		        }
        	}
        }
    }

    log.cpu('manage.spawns', 'end');
}
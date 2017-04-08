// Log
log('Loading: manager/assignmentsForExternal');

global.manage.assignmentsForExternal = function() {
	log.cpu('manage.assignmentsForExternal', 'start');

	const world = new World();

	// Nuke defence!
	if(world.imminentNukes.length > 0) {
		// Make sure to add in tick filter again for nukes... otherwise they aren't imminent...
		Game.notify('IMMINENT NUKE');
		let assignments = world.imminentNukes;

		if(assignments.length > 0) {
			for(const assignment of assignments) {
				Game.notify('IMMINENT NUKE from '+assignment.launchRoomName+' landing at '+assignment.pos.roomName);
			}
		}
		// If I have pos.roomName, then hub filter should actually be working, and I could activate safe mode from hub...
	}

	// Manage node flags... prioritizing flags since I don't always have view of node
	if(world.eyeballFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.sourceFlags;
		assignments = filter.byNotHasAssignee(assignments);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			// Loop through each assignment
			for(const assignment of assignments) {
				// Using an if clause to define scope for assignees let variable... I think you can just open and close brackets, but this is easier to read imo
				if(true) {
					// Get unassigned workers for the hub...
					let assignees = hub.eyeballCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'moveTo',
							sticky: true, // Do not ever clear assignment? Do we want to do that? Hmm...
							steps: false // Only when we need to do multiple things
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				if(true) {
					// Get free miners
					let assignees = hub.minerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we don't have a free miner, make one!
					if(assignees.length === 0) {
						// Need to check if any creeps in the world are assigned to the assignment, if so migrate them into hub...

						// Otherwise spawn them...
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'miner',
			    			'hub': hub.id
			    		}
			    		// Spawn it...
			    		spawn.smartQueueCreation(memory);
			    	}
			    }
			}
		}
	}

	// Reserver...

	// Guards... 4 different positions (spot, room, hub, creep), 3 different builds (ranged, mellee, and healer)... 
	// spot = mellee? any?
	// room = ranged
	// hub = ranged
	// creep = mellee/healer (not a flag)
	log.cpu('manage.assignmentsForExternal', 'end');
}
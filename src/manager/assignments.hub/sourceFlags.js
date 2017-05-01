// Required modules
var config = require('config');
var log = require('helpers/log');
var sort = require('helpers/sort');
var filter = require('helpers/filter');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function(hub) {
	if(hub.sourceFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.sourceFlags;
		assignments = filter.byNotHasAssignee(assignments);
		// Get nearest to main spawn...
		assignments = sort.byNearest(assignments, hub.spawns[0]);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			// Loop through each assignment
			for(const assignment of assignments) {
				// Using an if clause to define scope for assignees let variable... I think you can just open and close brackets, but this is easier to read imo
				if(true) {
					// Get unassigned workers for the hub...
					let assignees = hub.minerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'sourceFlags',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'harvest',
							type: 'source', // I think only used in flags?
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

			    		let priority = 5;
			    		if(hub.minerCreeps.length === 0) {
			    			priority = 1;
			    		}


			    		// Spawn it...
			    		spawn.smartQueueCreation(memory, priority);
			    	}
			    }

				break;
			}
		}
	}
}

module.exports = mod.public;
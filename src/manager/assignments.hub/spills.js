// Required modules
var config = require('config');
var log = require('helpers/log');
var sort = require('helpers/sort');
var filter = require('helpers/filter');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// I had thought there would be a purpose to completing spill assignments, but if all the banks are full, then no point in spills?? No point in fulfulling...
// The purpose of spills is to fill banks, therefore banks are the assignment, not spills...
mod.public = function(hub) {

	if(hub.spills && hub.spills.length > 0) {
		// Get unassigned node flags
		let assignments = hub.spills;
		// Filter by amount...
		assignments = filter.byAmount(spills, 1000, 1000001);
		// Filter by already assigned...
		assignments = filter.byAssignedLimit(assignments, 2);
		// Get nearest to main spawn...
		assignments = sort.byNearest(assignments, hub.spawns[0]);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			for(const assignment of assignments) {

				if(true) {
					// Get unassigned workers for the hub...
					let assignees = hub.haulerCreeps;
					// Only get unassigned creeps...
					assignees = filter.byNotHasAssignment(assignees);
					// Only use creeps with some space...
					assignees = filter.byCapacityPercentage(assignments, 0, 99);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'spills',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'pickup',
							steps: true // Does it need to drop off before? Confused...
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				// Since no structures are in demand, I won't even try to spawn anything actually...
				// If our banks are maxed out then haulers will do nothing anyway
				// We'll probably never get to 0 haulers though, since haulers have to refill the spawn :P

				if(true) { 
					// Just get the total number of haulers now...
					let assignees = hub.haulerCreeps;

					// This is just making it spawn every time we don't have a free hauler... hmm
					if(assignees.length < hub.config.creeps.hauler.count) {
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'hauler',
			    			'hub': hub.id
			    		}

			    		let priority = 5;
			    		if(hub.haulerCreeps.length === 0) {
			    			priority = 2;
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
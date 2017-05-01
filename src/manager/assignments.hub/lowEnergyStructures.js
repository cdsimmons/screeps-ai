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
	if(hub.lowEnergyStructures.length > 0) {
		// Get unassigned node flags
		let assignments = hub.lowEnergyStructures;
		assignments = filter.byNotHasAssignee(assignments);
		// Get nearest to main spawn...
		assignments = sort.byNearest(assignments, hub.spawns[0]);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			for(const assignment of assignments) {
				if(true) { // Entering a new scope... could call a function later I suppose
					// Get unassigned workers for the hub...
					let assignees = hub.haulerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'lowEnergyStructures',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'transfer',
							params: ['energy'], //resourceType
							type: 'structure',
							steps: false // Only when we need to do multiple things
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				if(true) { 
					// Just get the total number of haulers now...
					let assignees = hub.haulerCreeps;

					// Have to manually be aware of how many haulers we need for a hub... probably best way to do it...
					if(assignees.length < hub.config.creeps.hauler.count) {
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'hauler',
			    			'hub': hub.id
			    		}

			    		let priority = 4;
			    		if(hub.haulerCreeps.length === 0) {
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
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
	if(hub.controllers.length > 0) {
		// Get unassigned node flags
		let assignments = hub.controllers;
		// Order by level...
		assignments = sort.byLowestLevel(assignments);

		if(assignments.length > 0) {
			for(const assignment of assignments) {

				// Try to assign...
				if(true) {
					// Get unassigned workers for the hub...
					let assignees = hub.commonerCreeps;
					assignees = filter.byBodyPart(assignees, WORK);
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'controllers',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'upgradeController'
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				// Spawn if needed...
				if(true) { 
					// Just get the total number of commoners now...
					let assignees = hub.commonerCreeps;

					// This is just making it spawn every time we don't have a free hauler... hmm
					if(assignees.length < hub.config.creeps.commoner.count) {
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'commoner',
			    			'hub': hub.id
			    		}
			    		// Spawn it...
			    		spawn.smartQueueCreation(memory);
					}
				}

				break;
			}
		}
	}
}

module.exports = mod.public;
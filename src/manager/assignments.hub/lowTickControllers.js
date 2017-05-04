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
	if(hub.lowTickControllers) {
		if(hub.lowTickControllers.length > 0) {
			// Get unassigned node flags
			let assignments = hub.lowTickControllers;
			// Only 1 is needed to go there...
			assignments = filter.byNotHasAssignee(assignments);
			// assignments = filter.byWithout(lowEnergyBanks, assignments);

			// If we got some unassigned node flags, best get to work
			if(assignments.length > 0) {
				for(const assignment of assignments) {

					// Try to assign...
					if(true) {
						// Get unassigned workers for the hub...
						let assignees = hub.commonerCreeps;
						assignees = filter.byNotHasAssignment(assignees);

						// If we have some assignees... then assign
						if(assignees.length > 0) {
							// Get closest one to assignment...
							assignees = sort.byNearest(assignees, assignment);
							// Get first in array...
							let assignee = assignees[0];

							// Set the assignment for this assignee
							assignee.memory.assignment = {
								name: 'lowTickControllers',
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
						const hasMinimum = hub.hasMinimum('commoner');
						const hasMaximum = hub.hasMaximum('commoner');

						// No real blockers... very important we meet demand for low tick controllers quickly... we just delay because another commoner will probably go and tick it up before 150 ticks...
						if(!hasMinimum || (!hub.hasMaximum && hub.meetDemand('lowTickControllers', 150))) {
							// If we still have some assignments, then we fall to here since continues haven't been hit...
							const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
							// Build the creep we want
				    		const memory = {
				    			'origin': 'commoner',
				    			'hub': hub.id
				    		}

				    		let priority = 5;
				    		if(hub.commonerCreeps.length === 0) {
				    			priority = 1;
				    		}

				    		// Spawn it...
				    		spawn.smartQueueCreation(memory);
						}
					}

					break;
				}
			}
	    } else {
	    	hub.supplyDemand('lowTickControllers');
	    }
	}
}

module.exports = mod.public;
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

	if(hub.constructionSites && hub.constructionSites.length > 0) {
		// Get unassigned node flags
		let assignments = hub.constructionSites;

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
							name: 'constructionSites',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'build'
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				// Spawn if needed...
				if(true) { 
					// In some cases a hub might not have a bank at all, in which case we need to look at high spills...
					const spillMean = hub.getSpillMean();
					const hasMinimum = hub.hasMinimum('commoner');
					const hasMaximum = hub.hasMaximum('commoner');

					// If minimum not met OR not have maximum and, we have high energy structures or  no bankds but high spills, and we are ready to meet demand...
					if(!hasMinimum || (!hasMaximum && (hub.highEnergyBanks.length >= 1 || (hub.banks.length === 0 && spillMean > 1500)) && hub.meetDemand('constructionSites', 300))) {
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
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
	if(hub.lowEnergyBanks) {

		if(hub.lowEnergyBanks.length > 0) {
			// Get unassigned node flags
			let assignments = hub.lowEnergyBanks;
			// Get nearest to main spawn...
			assignments = sort.byNearest(assignments, hub.spawns[0]);
			// assignments = filter.byHasAssignee(assignments);
			// assignments = filter.byWithout(lowEnergyBanks, assignments);

			// If we got some unassigned node flags, best get to work
			if(assignments.length > 0) {
				for(const assignment of assignments) {

					if(true) {
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
								name: 'lowEnergyBanks',
								target: {
									id: assignment.id || assignment.name,
									pos: assignment.pos
								},
								method: 'transfer',
								params: ['energy'], //resourceType
								type: 'bank',
								steps: false // Only when we need to do multiple things
							}

							// Continue past this assignment, since it's been assigned and doesn't need any further action...
							continue;
						}
					}

					// Since no structures are in demand, I won't even try to spawn anything actually...
					// If our banks are maxed out then haulers will do nothing anyway
					// We'll probably never get to 0 haulers though, since haulers have to refill the spawn :P

					if(true) { 
						// Get spill mean...
						const spillMean = hub.getSpillMean();
						const hasMinimum = hub.hasMinimum('hauler');
						const hasMaximum = hub.hasMaximum('hauler');

						// If not have minimum or have high spills and not have demand... should only demand if we have high spills, and then it will take 200 ticks of demanding to succeed request
						if(!hasMinimum || (!hasMaximum && spillMean > 1500 && hub.meetDemand('lowEnergyBanks', 300))) {//assignees.length < hub.config.creeps.hauler.count) {
							// If we still have some assignments, then we fall to here since continues haven't been hit...
							const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
							// Build the creep we want
				    		const memory = {
				    			'origin': 'hauler',
				    			'hub': hub.id
				    		}

				    		let priority = 5;
				    		if(!hasMinimum) {
				    			priority = 2;
				    		}

				    		// Spawn it...
				    		spawn.smartQueueCreation(memory, priority);
						}
					}

					break;
				}
			}
		} else {
			hub.supplyDemand('lowEnergyBanks');
		}
	}
}

module.exports = mod.public;
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
	if(hub.guardHubFlags) {
		if(hub.guardHubFlags.length > 0) {
			// Get unassigned node flags
			let assignments = hub.guardHubFlags;
			assignments = filter.byNotHasAssignee(assignments);

			// If we got some unassigned node flags, best get to work
			if(assignments.length > 0) {
				// Loop through each assignment
				for(const assignment of assignments) {
					// Using an if clause to define scope for assignees let variable... I think you can just open and close brackets, but this is easier to read imo
					if(true) {
						// Get unassigned workers for the hub...
						let assignees = hub.guardCreeps;
						assignees = filter.byNotHasAssignment(assignees);

						// As soon as enemy appears, all guards get assigned to enemy I think, leaving flag unassigned...
						// Okay, I can either make moveTo assignment not clear...
						//log(assignments.length, assignees.length);

						// If we have some assignees... then assign
						if(assignees.length > 0) {
							// Get closest one to assignment...
							assignees = sort.byNearest(assignees, assignment);
							// Get first in array...
							let assignee = assignees[0];

							// Set the assignment for this assignee
							assignee.memory.assignment = {
								name: 'guardHubFlags',
								target: {
									id: assignment.id || assignment.name,
									pos: assignment.pos
								},
								method: 'moveTo',
								sticky: true
							}

							// Continue past this assignment, since it's been assigned and doesn't need any further action...
							continue;
						}
					}

					if(true) {
						// Get free miners
						let assignees = hub.guardCreeps;
						
						// If we are short of a guard to fill assignments after commotion...
						if(assignees.length < (hub.guardSpotFlags.length + hub.guardRoomFlags.length + hub.guardHubFlags.length)) {
							log('spawning guard for hub!');

							const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
							// Build the creep we want
				    		const memory = {
				    			'origin': 'guard',
				    			'hub': hub.id
				    		}

				    		// Spawn it...
				    		spawn.smartQueueCreation(memory);
				    	}
				    }

					break;
				}
			}
		} else {

		}
	}
}

module.exports = mod.public;
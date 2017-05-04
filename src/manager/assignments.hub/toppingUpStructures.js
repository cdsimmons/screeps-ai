// Required modules
var config = require('config');
var log = require('helpers/log');
var sort = require('helpers/sort');
var filter = require('helpers/filter');
var cache = require('helpers/cache');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function(hub) {
	if(hub.toppingUpStructures) {

		if(hub.toppingUpStructures.length > 0) {
			// Get unassigned node flags
			let assignments = hub.toppingUpStructures;
			assignments = filter.byNotHasAssignee(assignments);

			// If we have some assignments, then find them assignees!
			if(assignments.length > 0) {
				for(const assignment of assignments) {
					// Try to assign...
					if(true) {
						// Get unassigned workers for the hub...
						let assignees = hub.towers; // Only want towers to do the topping up
						// Filter by those not already busy with an assignment...
						assignees = filter.byNotHasAssignment(assignees);
						// Filter by tower in the same room
						assignees = filter.bySameRoom(assignees, assignment.pos.roomName);
						// Only use them to top up structures if they have at least 50% energy...
						assignees = filter.byCapacityPercentage(assignees, 50, 100);

						// If we have some assignees... then assign
						if(assignees.length > 0) {
							// Get closest one to assignment...
							assignees = sort.byNearest(assignees, assignment);
							// Get first in array...
							let assignee = assignees[0];

							// Set the assignment for this assignee
							assignee.memory.assignment = {
								name: 'toppingUpStructures',
								target: {
									id: assignment.id || assignment.name,
									pos: assignment.pos
								},
								method: 'repair'
							}

							// Update the cache as we might have it for a while...
							cache.removeObjectFromArray('toppingUpStructures', assignment);

							// Continue past this assignment, since it's been assigned and doesn't need any further action...
							continue;
						}
					}

					// If we have run out of towers to assign, break...
					// This is because we limit our assignees too much
					if(filter.byNotHasAssignment(hub.towers).length === 0) {
						break;
					}
				}
			}
		} else {

		}
	}
}

module.exports = mod.public;
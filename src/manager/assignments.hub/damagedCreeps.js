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

	if(hub.damagedCreeps && hub.damagedCreeps.length > 0) {
		// Get unassigned node flags
		let assignments = hub.damagedCreeps;
		assignments = filter.byNotHasAssignee(assignments);

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

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'damagedCreeps',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'heal'
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				// If any assignments remain here, oh well!
				if(filter.byNotHasAssignment(hub.towers).length === 0) {
					break;
				}
			}
		}
	}
}

module.exports = mod.public;
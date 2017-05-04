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
	if(hub.hostiles) {
		if(hub.hostiles.length > 0) {
			// First check that we have towers... each tower is worth about 2k hp... if assignment HP is more than towers in same room, then look at guards and spawning those 
			// TODO - Calc myStrength better...
			let myStrength = 0;//_.reduce(hub.guardCreeps, (memo, creep) => (memo + creep.hits), 0); // Get total strength of my guard...
			let hostileStrength = _.reduce(hub.hostiles, (memo, creep) => (memo + creep.hits), 10); // Get total strength of enemy...

			// Get all towers in same room as assignees and make them attack...
			if(true) {
				// Get unassigned workers for the hub...
				let assignees = hub.towers; // Only want towers to do the topping up
				// Filter by those not already busy with an assignment...
				assignees = filter.byNotHasAssignment(assignees);

				// Loop through all the assignees, filter assignments by having same roomName as assignee?
				for(let assignee of assignees) {
					if(!assignee.isEmpty()) {
						let assignments = hub.hostiles;
						// Filter by tower in the same room
						assignments = filter.bySameRoom(assignments, assignee.pos.roomName);

						// If we have some assignees... then assign
						if(assignments.length > 0) {
							// Get first in array since we should have already sorted by now
							let assignment = assignments[0];

							// Set the assignment for this assignee
							assignee.memory.assignment = {
								name: 'hostiles',
								target: {
									id: assignment.id || assignment.name,
									pos: assignment.pos
								},
								method: 'attack',
								sticky: true
							}

							log(assignee.memory);

							// Add to attack power...
							myStrength = myStrength + 5001;
						}
					}
				}
			}

			// Get all guards, sort hostiles by nearest, loop through guards and assign up to 3 for each hostile
			if(true) {
				// Get unassigned workers for the hub...
				let assignees = hub.guardCreeps; // Only want towers to do the topping up
				// Assign unassigned guards to attack...
				assignees = filter.byNotHasAssignment(assignees);

				// Loop through all the assignees, filter assignments by having same roomName as assignee?
				for(let assignee of assignees) {
					let assignments = hub.hostiles;
					// 3 max for each assignment... removing limit for now since this doesn't work well with spawn at low level
					//assignments = filter.byAssignedLimit(assignments, 3);

					// If we have some assignees... always attack, since guards would be useless anyway
					if(assignments.length > 0) {
						// Get first in array since we should have already sorted by now
						let assignment = assignments[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'hostiles',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'attack'
						}
					}
				}
			}

			// Add strength of guards that are attacking
			if(true) {
				let assignees = hub.attackingGuardCreeps;

				log(assignees);

				if(assignees !== undefined && assignees.length > 0) {
					// Calc strength for guards...
					for(let assignee of assignees) {
						myStrength = myStrength + assignee.hits;
					}
				}
			}

			log('raaa', hub.creeps, hub.guardCreeps, hub.creeps); // undefined... wtf??

			// // Check that our strength is greater than hostile strength in the hub...
			if(true) {
				const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						
				// If we are weaker, than get a guard up
				if(myStrength < hostileStrength) {
					hub.memory.alertLevel = hub.memory.alertLevel + 1;

					// If we are at level 3 alert mode, then spawn!
					// This mainly serves as a delay for the guard destinations to be attack for accurate strength check...
					if(hub.memory.alertLevel > 3) {
						const expectedGuardStrength = spawn.getExpectedGuardStrength();
						// Average strength of each individual unit...
						let myMedianStrength = (myStrength / hub.guardCreeps.length) || 0; 
						let hostileMedianStrength = (hostileStrength / hub.hostiles.length) || 0;

						// Make sure that if we are going to make a guard, it is atleast 60% as strong as average hostile strength, otherwise we will get raped
						if(expectedGuardStrength > (hostileMedianStrength * 0.6)) {
							// Build the creep we want
				    		const memory = {
				    			'origin': 'guard',
				    			'hub': hub.id
				    		}
				    		// If more hostiles than guards, make guards a priority!
				    		let priority = 7;
				    		// if(attackingGuardCreeps !== undefined && hub.hostiles.length > hub.attackingGuardCreeps.length) {
				    		// 	priority = 3
				    		// }

				    		// Spawn it...
				    		spawn.smartQueueCreation(memory, priority);
						}
					}
				} else {
					hub.memory.alertLevel = 0;
					// Remove guard from spawn queue...
				    spawn.removeCreation({'origin': 'guard'});
				}
			}
		} else {
			const spawn = hub.spawns[0];
			hub.memory.alertLevel = 0;
			// Remove guard from spawn queue...
		    spawn.removeCreation({'origin': 'guard'});
		}
	}
}

module.exports = mod.public;
// Log
log('Loading: manager/assignmentsForHub');

global.manage.assignmentsForHub = function(hub) {
	log.cpu('manage.assignmentsForHub', 'start');

	// === Assignments
	// Manage node flags... prioritizing flags since I don't always have view of node
	if(hub.sourceFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.sourceFlags;
		assignments = filter.byNotHasAssignee(assignments);
		// Get nearest to main spawn...
		assignments = sort.byNearest(assignments, hub.spawns[0]);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			// Loop through each assignment
			for(const assignment of assignments) {
				// Using an if clause to define scope for assignees let variable... I think you can just open and close brackets, but this is easier to read imo
				if(true) {
					// Get unassigned workers for the hub...
					let assignees = hub.minerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'sourceFlags',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'harvest',
							type: 'source', // I think only used in flags?
							sticky: true, // Do not ever clear assignment? Do we want to do that? Hmm...
							steps: false // Only when we need to do multiple things
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				if(true) {
					// Get free miners
					let assignees = hub.minerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we don't have a free miner, make one!
					if(assignees.length === 0) {
						// Need to check if any creeps in the world are assigned to the assignment, if so migrate them into hub...

						// Otherwise spawn them...
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'miner',
			    			'hub': hub.id
			    		}

			    		let priority = 5;
			    		if(hub.minerCreeps.length === 0) {
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
	log.cpu('sourceFlags');

	// Manage low energy structures...
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

			    		let priority = 5;
			    		if(hub.minerCreeps.length === 0) {
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
	log.cpu('lowEnergyStructures');

	// Manage low energy banks
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
	log.cpu('lowEnergyBanks');

	// Controller low...
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
    }
	log.cpu('lowTickControllers');

    // Hub defence... assigning towers and guards, and spawning new guards if our strength is less
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

			// Calc strength for guards...
			for(let assignee of assignees) {
				myStrength = myStrength + assignee.hits;
			}
		}

		// Check that our strength is greater than hostile strength in the hub...
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
			    		if(hub.hostiles.length > hub.attackingGuardCreeps) {
			    			priority = 3
			    		}

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
		hub.memory.alertLevel = 0;
	}
	log.cpu('hostiles');

	// Spot guards...
	if(hub.spotGuardFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.spotGuardFlags;
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

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'spotGuardFlags',
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

					// If we don't have a free miner, make one!
					if(assignees.length < (hub.spotGuardFlags.length + hub.roomGuardFlags.length + hub.hubGuardFlags.length)) {
						log('spawning guard for spot!');
						// Need to check if any creeps in the world are assigned to the assignment, if so migrate them into hub...

						// Otherwise spawn them...
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
	}
	log.cpu('spotGuardFlags');

	// Room guards...
	if(hub.roomGuardFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.roomGuardFlags;
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
							name: 'roomGuardFlags',
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
					if(assignees.length < (hub.spotGuardFlags.length + hub.roomGuardFlags.length + hub.hubGuardFlags.length)) {
						log('spawning guard for room!');

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
	}
	log.cpu('roomGuardFlags');

	// Hub guards...
	if(hub.hubGuardFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.hubGuardFlags;
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
							name: 'hubGuardFlags',
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
					if(assignees.length < (hub.spotGuardFlags.length + hub.roomGuardFlags.length + hub.hubGuardFlags.length)) {
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
	}
	log.cpu('hubGuardFlags');

	// Decaying structures that need topping up by towers... basically roads and ramparts
	// CPU spikes... 
	if(hub.decayingStructures.length > 0) {
		// Get unassigned node flags
		let assignments = hub.decayingStructures;

		// Get unassigned workers for the hub...
		let assignees = hub.towers; // Only want towers to do the topping up
		// Filter by those not already busy with an assignment...
		assignees = filter.byNotHasAssignment(assignees);

		//log(assignees);
		log.cpu('aaa p1');
		// Filter by tower in the same room
		assignments = filter.bySameRooms(assignments, _.pluck(_.pluck(assignees, 'room'), 'name'));
		// Filter by those that need topping up...
		assignments = filter.byNeedsRepairingTopup(assignments);
		log.cpu('aaa p2');

		// Looping through assignees and then giving assignment...
		// Making it assignee oritened by better 
		if(assignees.length > 0) {
			for(const assignee of assignees) {
				// Only those that haven't been assigned yet...
				assignments = filter.byNotHasAssignee(assignments);

				// If we have some assignees... then assign
				if(assignments.length > 0) {
					// Get closest one to assignment...
					//assignments = sort.byNearest(assignments, assignee);
					// Get first in array...
					let assignment = assignments[0];

					// Set the assignment for this assignee
					assignee.memory.assignment = {
						name: 'decayingStructures',
						target: {
							id: assignment.id || assignment.name,
							pos: assignment.pos
						},
						method: 'repair'
					}

					// Continue past this assignment, since it's been assigned and doesn't need any further action...
					continue;
				}
			}
		}
	}
	log.cpu('decayingStructures');

	// Damaged creeps...
	if(hub.damagedCreeps.length > 0) {
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
	log.cpu('damagedCreeps');

	// Repair up roads, walls, and structures
	if(hub.damagedStructures.length > 0) {
		// Get unassigned node flags
		let assignments = hub.damagedStructures;
		// Only get unassigned structures
		assignments = filter.byNotHasAssignee(assignments);

		if(assignments.length > 0) {
			for(const assignment of assignments) {
				// Try to assign...
				if(true) {
					// Get unassigned workers for the hub...
					let assignees = hub.commonerCreeps;
					assignees = filter.byBodyPart(assignees, WORK);
					assignees = filter.byNotHasAssignment(assignees);

					// Leaving 1 behind to do other things... construct, upgrade, etc...
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'damagedStructures',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'repair'
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

	log.cpu('damagedStructures');

	// Buildings
	if(hub.constructionSites.length > 0) {
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
	log.cpu('constructionSites');

	// Controller upgrade for all unassigned creeps?
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
	log.cpu('controllers');

	// Reserving controllers...
	if(hub.reserveFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.reserveFlags;
		assignments = filter.byNotHasAssignee(assignments);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			// Loop through each assignment
			for(const assignment of assignments) {
				// Using an if clause to define scope for assignees let variable... I think you can just open and close brackets, but this is easier to read imo
				if(true) {
					// Get unassigned reservers for the hub...
					let assignees = hub.claimerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'reserveFlags',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'reserveController',
							type: 'structure', // I think only used in flags?
							sticky: true, // Do not ever clear assignment on completion? Nah
							steps: false // Only when we need to do multiple things
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				if(true) {
					// Get free reservers
					let assignees = hub.claimerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we don't have a free reserver, make one!
					if(assignees.length === 0) {
						// Need to check if any creeps in the world are assigned to the assignment, if so migrate them into hub...

						// Otherwise spawn them...
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'claimer',
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
	log.cpu('reserveFlags');

	// Claiming controllers...
	if(hub.claimFlags.length > 0) {
		// Get unassigned node flags
		let assignments = hub.claimFlags;
		assignments = filter.byNotHasAssignee(assignments);
		
		//log('raa', hub.claimFlags.length, assignments.length, hub.reserverCreeps.length, hub.reserveFlags.length, hub.claimerCreeps.length);

		// If we got some unassigned node flags, best get to work
		if(assignments.length > 0) {
			// Loop through each assignment
			for(const assignment of assignments) {
				// Using an if clause to define scope for assignees let variable... I think you can just open and close brackets, but this is easier to read imo
				if(true) {
					// Get unassigned reservers for the hub...
					let assignees = hub.claimerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we have some assignees... then assign
					if(assignees.length > 0) {
						// Get closest one to assignment...
						assignees = sort.byNearest(assignees, assignment);
						// Get first in array...
						let assignee = assignees[0];

						// Set the assignment for this assignee
						assignee.memory.assignment = {
							name: 'claimFlags',
							target: {
								id: assignment.id || assignment.name,
								pos: assignment.pos
							},
							method: 'claimController',
							type: 'structure', // I think only used in flags?
							sticky: true, // Do not ever clear assignment on completion? Nah
							steps: false // Only when we need to do multiple things
						}

						// Continue past this assignment, since it's been assigned and doesn't need any further action...
						continue;
					}
				}

				if(true) {
					// Get free claimers
					let assignees = hub.claimerCreeps;
					assignees = filter.byNotHasAssignment(assignees);

					// If we don't have a free reserver, make one!
					if(assignees.length === 0) {
						// Need to check if any creeps in the world are assigned to the assignment, if so migrate them into hub...

						// Otherwise spawn them...
						// If we still have some assignments, then we fall to here since continues haven't been hit...
						const spawn = hub.spawns[0]; // Just get the first spawner... later we can figure out if spawner is busy or not...
						// Build the creep we want
			    		const memory = {
			    			'origin': 'claimer',
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
	log.cpu('claimFlags');

	// Guards... 4 different positions (spot, room, hub, creep), 3 different builds (ranged, mellee, and healer)... 
	// spot = mellee? any?
	// room = ranged
	// hub = ranged
	// creep = mellee/healer (not a flag)
	log.cpu('manage.assignmentsForHub', 'end');
}

// So before I spawned up creeps and I just found them stuff to do... creep oriented assignments...
// Now I'm looking at what assignments there are, and finding something to fill them... asignment oriented creeps...
// The advantage with this new method is that I get everything covered!
// Previously I would have to give creeps something to do, then see if there are things that still need doing to be spawned for
// Now I can do the checking and spawning at once
// The problem is it's kind of expensive... looking up decayingStructures and damagedStructures especially... sometimes it spikes to 20cpu!

// I need to somehow reduce this querying cost... perhaps I could get structures out of room, and then do a find for anything missing...
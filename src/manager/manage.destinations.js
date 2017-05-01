// Required modules
var config = require('config');
var log = require('helpers/log');
var filter = require('helpers/filter');
var sort = require('helpers/sort');

// Log
log('Loading: manager/manage_destinations');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function() {
	log.cpu('manage.destinations', 'start');

	let assignees = _.union(Game.creeps, Game.towers);

	// === Destinations
	// Idea being that assignments may take many destinations... to pick up energy first, to stand still then move and heal, etc
	// Get all creeps with assignments and without destinations...v
	if(assignees.length > 0) {
		// Filter creeps by having assignment
		assignees = filter.byHasAssignment(assignees);
		// Filter creeps by not having destination...
		assignees = filter.byNotHasDestination(assignees);

		if(assignees.length > 0) {
			// Could filter out the ones that have no destinations here and give destinations...
			for(let assignee of assignees) {
				// === Destinations setup
				// Get the assignment of the assignee/creep
				const assignment = assignee.memory.assignment;
				// Create a clone of assignment for now... underscore clone does not work jesus christ
				let destination = JSON.parse(JSON.stringify(assignee.memory.assignment));
				// Get the target...
				let target = Game.getObjectById(assignment.target.id) || Game.namedFlags[assignment.target.id];

				// Clearing the assignment if target is doesn't exist...
				if((target === undefined || target === null) && Game.namedRooms[assignment.target.pos.roomName] !== undefined) {
					log(assignee.name + ' had non-existant assignment');

					delete assignee.memory.assignment;
					continue;
				}

				// Always check for vision to the room... if no vision then go to the assignment... after we arrive it gets cleared in the actioning
				// This might not entirely work for pesterers vacating to heal, but we can put those before this I guess?
				if(Game.namedRooms[assignment.target.pos.roomName] === undefined) {
					log(assignment.target.pos.roomName + ' have no sight to so need to move to');

					assignee.memory.destination = destination;
					continue;
				}

				// === Destination definition

				// If destination is a flag, get what we want from under it using the passed type
				if(Game.namedFlags[destination.target.id] !== undefined && destination.type !== undefined) {
					let flag = Game.namedFlags[destination.target.id];
					// Get tiles at the flag
					let tiles = flag.pos.look();
	                // Filter tiles by type...
	                let matchingTiles = filter.byTypes(tiles, [destination.type]);
	                // Get the id of the matching tile...
	                let targetTileId = matchingTiles[0][destination.type].id;

	                destination.target.id = targetTileId;
				}

				// If we're empty and doing a task that requires energy and we're part of a hub then fill up...
				if(assignee.isEmpty() && _.contains(config.actions.decreasers, assignment.method) && assignee.memory.hub) {
					let hub = new Hub(assignee.memory.hub);

					// Get spills...
					let spills = hub.spills;
		            //spills = filter.byNotHasDestinee(spills);
		            // Instead of checking if they have destinee, we're only including spills which have double this capacity...
		            // TODO - Really we should check if it has enough for all destinees...
		            spills = filter.byAmount(spills, assignee.carryCapacity * 2, 100000);
		            spills = sort.byNearest(spills, assignee.pos);
					//let nearSpills = filter.byRange(spills, assignee.pos, 50);

					// Get banks...
					let highEnergyBanks = hub.highEnergyBanks;
		            highEnergyBanks = sort.byNearest(highEnergyBanks, assignee.pos);
					let nearHighEnergyBanks = filter.byRange(highEnergyBanks, assignee.pos, 50);

					//log(assignee.name, nearHighEnergyBanks.length, spills.length, nearSpills.length);

					// If we're assigned to fill up lowEnergyBanks, then just pickup spill
					// Or if we are too far from a high energy bank but good spills available...
					if(assignment.name === 'lowEnergyBanks' || (nearHighEnergyBanks.length === 0 && spills.length > 0)) {
						let target = spills[0];

			            // If we have a target, then let's update our destination and finish with this one :)
			            if(target) {
			                destination.target.id = target.id;
			                destination.target.pos = target.pos;
			                destination.method = 'pickup';

				            assignee.memory.destination = destination;
				            continue;
			            }
					} else {
						let target = highEnergyBanks[0];

			            // If we have a target, then let's update our destination and finish with this one :)
		                if(target) {
		                    destination.target.id = target.id;
		                    destination.target.pos = target.pos;
		                    destination.method = 'withdraw';
		                    destination.params = ['energy'];

			    			assignee.memory.destination = destination;
					        continue;
		                }
					}
				}

				// Handle destination for mobileGuardFlags assignment... has to move around
				if((assignment.name === 'guardSpotFlags' || assignment.name === 'guardRoomFlags' || assignment.name === 'guardHubFlags') && assignee.memory.hub) {
					let hub = new Hub(assignee.memory.hub);
					let hostiles = hub.hostiles;
					hostiles = sort.byNearest(hostiles, assignee.pos);

					// If we have hostiles...
					if(hostiles.length > 0) {
						// Just look for any hostiles within 1 range...
						if(assignment.name === 'guardSpotFlags') {
							hostiles = filter.byRange(hostiles, 1);
						}

						// Look for any hostiles within the same room...
						if(assignment.name === 'guardRoomFlags') {
							hostiles = filter.bySameRoom(hostiles, assignee.pos.roomName);
						}

						// Look for any hostiles within the same room...
						if(assignment.name === 'guardHubFlags') {
							// No filtering I guess...
						}

						// Assign the target to the guard...
						let target = hostiles[0];

						if(target) {
		                    destination.target.id = target.id;
		                    destination.target.pos = target.pos;
		                    destination.method = 'attack';

			    			assignee.memory.destination = destination;
					        continue;
		                }
					}
				}


				// No I think destination is best place for guard to do it's checks... I could give each assignment a unique name to identify it?
				// Then I can do destinations for this assignment, that, etc... a bit more easily


				// Guard creep...
				// Assignment is flag/enemy, if flag destination is flag if current room is not flag, if enemy destination is assigned enemy, destination is closest enemy
				// If in same room as flag...
					// look for nearest hostile and make destination that hostile...
				// Else it falls to destination is assignment (moveTo)


				// Attack creep...
				// Assignment is flag, destination is flag if current room is not flag, destination is nearest enemy creep or flag
				// Healer creep...
				// Assignment is creep, keep healing and moving to creep

				
				// Pester creep...
				// Assignment is flag, if not 100% then destination is out of room/away from flag? and heal, if 100% destination is flag

				// Eyeball creep...
				// Assignment is flag, destination is flag

				// Thief creep...
				// Assignment is spill/container under flag, destination is spill/container if empty, else transfer to it's nearest bank
				// If assignment is increaser and full then destination is bank, else destination is to go to target if not in room, if in room destination is under to pick/with
				// Can I make it heal itself and move to destination?... 


				// Update destination object after all our changes if we've made it this far...
				assignee.memory.destination = destination;
			}
		}
	}

	log.cpu('manage.destinations', 'end');
}

module.exports = mod.public;
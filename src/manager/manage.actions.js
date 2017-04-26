// Required modules
var config = require('config');
var log = require('helpers/log');
var filter = require('helpers/filter');

// Log
log('Loading: manager/manage_actions');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function() {
	log.cpu('manage.actions', 'start');

	var actioners = _.union(Game.creeps, Game.towers); // Need to combine creeps and structures/towers I think?

	//log(Game.creeps);

	if(actioners.length > 0) { 
		let destinees = actioners;
		// Get creeps that have destination
		destinees = filter.byHasDestination(destinees);

		// Try do 
		if(destinees.length > 0) {
			for(let destinee of destinees) {
		        //log.cpu('action start... '+destinee.name);
				// Get the assignment of the destinee
				let assignment = destinee.memory.assignment;
				// Get the destination of the destinee
				let destination = destinee.memory.destination;

				// Either it's an object of it's a flag
		        let target = Game.getObjectById(destination.target.id) || Game.namedFlags[destination.target.id];
		        // Have to turn into a room position... since if object out of view, then Game.object is undefined...
		        let targetPos = new RoomPosition(destination.target.pos.x, destination.target.pos.y, destination.target.pos.roomName);
		        // Getting the passed params...
		        let params = destination.params || [];

		        // Clearing destination since it doesn't exist...
		        // Even with room, sometimes targets just don't exist...
		        if((target === undefined || target === null) && Game.namedRooms[assignment.target.pos.roomName] !== undefined) { //) && Game.rooms[assignment.target.pos.roomName] !== undefined
					log(destinee.name + ' had non-existant destination');

					delete destinee.memory.destination;
					continue;
				}

		        //log.cpu('actioning... '+assignment.method);

		        // If we are in range and not just moving to, then do the action!
		        // Else moveTo and do idle action! :)
		        if(destinee.pos.inRangeTo(targetPos, destinee.getActionRange()) && destination.method !== 'moveTo') {
		        	
		        	//log.cpu('actioning... '+destination.method+'... '+destinee.name);
		        	let actioning = destinee[destination.method](target, params[0], params[1]);
		        	//log.cpu('actioning... '+destination.method+'... '+destinee.name);

		        	// Just covering off not in range just in case... should never be triggered though if the code is right
		        	if(actioning === ERR_NOT_IN_RANGE) {
		        		delete destinee.memory.destination;
		        		destinee.say('too far');
		        	}

					// If invalid target and not a flag and not sticky... or other things... (actioning === ERR_INVALID_TARGET && !Game.flags[destination.target.id])... actually we need to refresh destination every movement, sigh
			        if(actioning === ERR_INVALID_TARGET || actioning === ERR_NOT_ENOUGH_RESOURCES || actioning === ERR_NO_BODYPART || actioning === ERR_FULL) {
			            delete destinee.memory.destination;
			            destinee.say(actioning+'\'d');
			        }

			        // If the carry amount of this creep is the same and it shouldn't be, then it's stale for some reason and task is probably already complete...
			        if(_.contains(config.actions.work, destination.method) && actioning === OK && destinee.isStale() && !assignment.sticky) { // Also making sure it's not a sticky one?
			            delete destinee.memory.destination;
			            destinee.say('stale\'d');
			        }

			        // If it doesn't take a while to complete and it went fine and it's not sticky...
			        if(!_.contains(config.actions.work, destination.method) && actioning === OK && !assignment.sticky) {
			            delete destinee.memory.destination;
			            destinee.say('complete\'d');
			        }

			        // If we moved into another room and we were currently going after a flag, then clear destination so we can (hopefully) get the correct target this time
			        if(destinee.transitioned() && Game.namedFlags[destination.id] !== undefined) {
			            delete destinee.memory.destination;
			            destinee.say('redest\'d');
			        }

			        // If we're a tower repairing something, then clear...
			        if(destination.name === 'decayingStructures') {
			            delete destinee.memory.destination;
			            destinee.say('repair\'d');
			        }

			        // If we've deleted the destination... then check if we should clear the assignment...
			        if(destinee.memory.destination === undefined) {
			        	if(destination.method === assignment.method) { // Only clearing assignment if the destination method and assignment method are the same...
			        		delete destinee.memory.assignment;
			        	}
			        }
		        } else {
		        	// Move to...
		        	let opts = {
		            	reusePath: 25
		        	}
		        	// Move out!
		            let movement = destinee.moveTo(targetPos, opts);

					// Repair any structures if we aren't empty...
					if(!destinee.isEmpty()) {
			            // Find an idle assignment...
						let idleAssignments;
						idleAssignments = Game.toppingUpStructures;
						idleAssignments = filter.bySameRoom(idleAssignments);
						idleAssignments = filter.byRange(idleAssignments, 3);

						if(idleAssignments.length > 0) {
							destinee.repair(idleAssignments[0]);
						}
					}

					// If have part and damaged
						// Heal self
					if(destinee.hasBodyPart('heal')) {
						destinee.heal(destinee);
					}
		        }
			}
		}
	}

	log.cpu('manage.actions', 'end');
}

module.exports = mod.public;
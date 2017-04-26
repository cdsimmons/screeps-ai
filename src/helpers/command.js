var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: helpers/command');

// Idea being I can call commands within the console of screeps... eg. command.resetCreepsMemory, or command.recallSquads, etc

var mod = {};
mod.private = {};
mod.public = {};

mod.public.resetCreepsMemory = function() {
	let creeps = Game.creeps;

	for(let creep of creeps) {
        creep.memory.hub = creep.roomName;
		creep.memory.assignment = undefined;
		creep.memory.destination = undefined;
	}
}

module.exports = mod.public;
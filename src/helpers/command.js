var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: helpers/command');

// Idea being I can call commands within the console of screeps... eg. command.resetCreepsMemory, or command.recallSquads, etc
global.resetCreepsMemory = function() {
	let creeps = Game.creeps;

	for(let creep of creeps) {
        creep.memory.hub = creep.roomName;
		delete creep.memory.assignment;
		delete creep.memory.destination;
	}
}
// Log
log('Loading: helpers/command');

// Idea being I can call commands within the console of screeps... eg. command.resetCreepsMemory, or command.recallSquads, etc
global.command = function() {
    // Init the module
    var mod = {};
    mod.private = {};
    mod.public = {};

    mod.public.resetCreepsMemory = function() {
    	let creeps = find.creeps();

    	for(let creep of creeps) {
    		creep.memory.assignment = undefined;
    		creep.memory.destination = undefined;
    	}
    }

    return mod.public;
}();
global.Spawn = function(name) {
	this.memory = Memory.spawns[name];
    this.name = name;
	// A bit hacky just hard-coding this... Really we should be getting some vars from the object, but eh :P
	this.pos = new RoomPosition(25, 23, 'sim');
	this.spawning = {};

	// Not worth testing the different paths really...
	this.canCreateCreep = function(body) {
		if(body.length > 5) {
			return ERR_NOT_ENOUGH_ENERGY;
		} else {
			return OK;
		}
	}

	this.createCreep = function() {
		this.spawning = {
	        "name":"Alexis",
	        "needTime":9,
	        "remainingTime":7
	    };

		return OK;
	}
};
global.Spawn = function(name) {
	this.memory = Memory.spawns[name];
    this.name = name;
	// A bit hacky just hard-coding this... Really we should be getting some vars from the object, but eh :P
	this.pos = new RoomPosition(25, 23, 'sim');

	// Not worth testing the different paths really...
	this.canCreateCreep = function() {
		return OK;
	}
};
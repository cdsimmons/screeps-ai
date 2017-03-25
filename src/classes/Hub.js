// Log
log('Loading: classes/hub');

// Initially Hub was just the rooms and config for a hub... now each hub has all of it's creeps, flags, and structures on load...
// We're setting the hubs to Game instead of global, since Game is reset every tick, whereas global is not... global is better for functions and values that don't change
global.Hub = function(id) {
    log.cpu('Hub', 'start');

    // Initiate global hubs if undefined...
    if(Game.hubs === undefined) {
        Game.hubs = {};
    }

    // Initiate global Memory for hubs
    if(Memory.hubs === undefined) {
        Memory.hubs = {};
    }

    // If we have hub already then just return it...
    if(Game.hubs[id]) {
        log.cpu('Hub', 'end');
        return Game.hubs[id];
    } else {
        const world = new World();

        // Init memory if necessary
        if(!Memory.hubs[id]) {
            Memory.hubs[id] = {};
        }

        // Assign to this
        this.memory = Memory.hubs[id];
        this.memory.alertLevel = this.memory.alertLevel || 0;

        // Cap alert level...
        if(this.memory.alertLevel > 10) {
            this.memory.alertLevel = 10;
        }

        // Inital attributes
        this.id = id;
        this.config = config.hubs[this.id];
        this.rooms = this.config.rooms;

        // Copying world properties and limiting to hub...
        for(var property in world) {
            this[property] = filter.byHub(world[property], this);
        }

        // Storing in memory for later...
        Game.hubs[id] = this;
    }
    
    log.cpu('Hub', 'end');
}

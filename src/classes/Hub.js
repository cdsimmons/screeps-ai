// Required modules
var log = require('helpers/log');
var config = require('config');
var filter = require('helpers/filter');

// Log
log('Loading: classes/hub');

// Initially Hub was just the rooms and config for a hub... now each hub has all of it's creeps, flags, and structures on load...
// We're setting the hubs to Game instead of global, since Game is reset every tick, whereas global is not... global is better for functions and values that don't change
global.Hub = function(id) {
    // Initiate global hubs if undefined...
    if(!Game.hubs) {
        Game.hubs = {};
    }

    // Initiate global Memory for hubs
    if(!Memory.hubs) {
        Memory.hubs = {};
    }

    // If we have hub already then just return it...
    if(Game.hubs[id]) {
        return Game.hubs[id];
    } else {
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
        this.demanded = [];

        log.cpu('gameToHub properties', 'start');
        // Copying world properties and limiting to hub...
        for(let property in Game) {
            // We only want the arrays...
            if(Array.isArray(Game[property])) {
                try {
                    this[property] = filter.byHub(Game[property], this);
                } catch(e) {
                    // We are trying to filter the Game object items by roomName, but if that fails (such as it has no roomName), oh well
                }
            }
        }
        log.cpu('gameToHub properties', 'end');

        // Storing in memory for later...
        Game.hubs[id] = this;
    }
}

Hub.prototype.getSpillMean = function() {
    var spills = this.spills;

    if(spills) {
        var spillTotals = _.pluck(this.spills, 'amount');
        var spillTotal = _.reduce(spillTotals, (memo, num) => { return memo + num; }, 0);

        return spillTotal / spills.length;
    }
}

Hub.prototype.hasMinimum = function(origin) {
    var creeps = []; //filter.byMemory(this.creeps, 'origin', origin); // To really cut down on the work, I'll just use some if statements instead...
    if(origin === 'hauler') {
        creeps = this.haulerCreeps;
    }
    if(origin === 'commoner') {
        creeps = this.commonerCreeps;
    }

    var minimum = this.config.creeps[origin].minimum;

    return creeps.length >= minimum;
}

Hub.prototype.hasMaximum = function(origin) {
    var creeps = [];
    if(origin === 'hauler') {
        creeps = this.haulerCreeps;
    }
    if(origin === 'commoner') {
        creeps = this.commonerCreeps;
    }

    var maximum = this.config.creeps[origin].maximum;

    // If greater than maximum...
    return creeps.length >= maximum;
}

// Extend hub proto for equalizer
Hub.prototype.meetDemand = function(assignment, triggerSupply) {
    // Init demand memory...
    if(!this.memory.demand) {
        this.memory.demand = {};
    }

    // If we don't have the maximum for this type of creep...
    //if(!this.hasMaximum(assignment)) {
        // Remember which one has been demanded...
        this.demanded.push(assignment);

        // Increase demand...
        var demand = this.memory.demand[assignment] || 0;

        // If our demand is less than the limit...
        if(demand < triggerSupply) {
            this.memory.demand[assignment] = demand + 1;

            return false;
        } else {
            this.memory.demand[assignment] = 0;

            return true;
        }
    // } else {
    //     return false;
    // }
}

Hub.prototype.supplyDemand = function() {
    if(this.memory.demand) {
        for(let assignment in this.memory.demand) {
            // If we haven't demanded this item for this tick, then reduce demand...
            if(!_.contains(this.demanded, assignment)) {
                // Only reduce if greater than 0
                if(this.memory.demand[assignment] > 0) {
                    log('Reducing demand for '+assignment);
                    this.memory.demand[assignment] = this.memory.demand[assignment] - 10;
                }
            }
        }
    }
}
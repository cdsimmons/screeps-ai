// Required modules
var log = require('helpers/log');
var config = require('config');

// Log
log('Loading: classes/spawn');

// Should be moved somewhere else... not sure where... perhaps into manage.js itself...
Spawn.prototype.cleanup = function() {
    for(var i in Memory.creeps) {
        if(!Game.namedCreeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

// This would basically tell me if the spawn can afford the body we pass...
// This is different to canCreateCreep, which tells me if it's busy/low on energy, etc
// canAfford however, will tell me if it has the eventual capacity to do so...
Spawn.prototype.canAffordBody = function(body) {
    let capacity = this.room.energyCapacityAvailable;

    for(let part of body) {
        capacity = capacity - BODYPART_COST[part];
    }

    return (capacity >= 0);
}

// Check if the spawn is regenerating it's energy...
Spawn.prototype.isRegenerating = function() {
    // We need to either define it, or update it if it's out of date by a tick
    if(this.memory.regenerating === undefined || this.memory.regeneratingTimestamp !== Game.time) {
        // If the energy is the same as the energy in previous (previous)
        if(this.memory.energy === this.energy) {
            this.memory.regenerating = false;
        } else {
            this.memory.regenerating = true;
        }
        
        // Update the energy
        this.memory.energy = this.energy;
        // Update when it last checked it was regenerating...
        this.memory.regeneratingTimestamp = Game.time;
    }

    // Should probably check for haulers and miners for the hub this spawn belongs to...

    return this.memory.regenerating;
}

// Create the creeps in the queue... this will try to create it no matter what
Spawn.prototype.createCreepInQueue = function(forced = false) {
    // Sort the array so we have the highest priority creep first...
    if(this.memory.creationQueue && this.memory.creationQueue.length > 0) {
        //log('creating...', this.room.name);
        // Sortby priority
        this.memory.creationQueue = _.sortBy(this.memory.creationQueue, (creep) => (creep.priority));

        // Get first creep...
        var creep = this.memory.creationQueue[0];
        // Check if we can create the creep...
        let cando = this.canCreateCreep(creep.body);

        // If not enough energy, trim it down then since at this point we have to force the creation of the creep... also if we have to make it fit...
        if(cando === ERR_NOT_ENOUGH_ENERGY && forced) {
            creep.body = this.trimBody(creep.body);
            cando = this.canCreateCreep(creep.body);
        }

        // Check if we can create before we create it and remove it... this should be done before createCreeps is called from manger, but one final check here just in case!
        if(cando === OK) {
            this.memory.creationQueue.shift();
            return this.createCreep(creep.body, undefined, creep.memory);
        }

        // When bugged get rid of it...
        if(cando === ERR_INVALID_ARGS) {
            this.memory.creationQueue.shift();
        }
    }
}

// Add creep to queue...
Spawn.prototype.queueCreation = function(body, memory, priority = 5) {
    if(!this.memory.creationQueue) {
        this.memory.creationQueue = [];
    }

    // Add the body, memory, and priority values to the spawn queue
    this.memory.creationQueue.push({body,memory,priority});
}

// Add creep to queue... will check if it exists in queue already, if not then it will assemble body and push :)
Spawn.prototype.smartQueueCreation = function(memory, priority = 5) {
    if(!this.memory.creationQueue) {
        this.memory.creationQueue = [];
    }
    
    if(!this.isCreationQueued(memory) && !this.isCreating(memory)) {
        const body = this.dynamicAssemble(memory.origin);

        // Add the body, memory, and priority values to the spawn queue
        this.memory.creationQueue.push({body,memory,priority});
    }
}

Spawn.prototype.isCreationQueued = function(memory) {
    // If no queue, we know it's not in there...
    if(typeof this.memory.creationQueue === undefined || this.memory.creationQueue.length === 0) {
        return false;
    }

    // If we're over the queue capacity, then return true so we don't keep adding to the spawn and flood our memory... also flag ourselves so we know there is a problem with queueing...
    if(this.memory.creationQueue.length > 20) {
        Game.notify('ERROR: Spawn has reached capacity');
        return true;
    }

    // Get the memories...
    let memories = _.pluck(this.memory.creationQueue, 'memory');

    // Stringify to do a string search... I wish I didn't have to do this, _.where was working before, and it's working in my jsfiddle...
    memories = JSON.stringify(memories);
    memory = JSON.stringify(memory);

    // Check if the creep exists...
    if(memories.includes(memory)) {
        return true;
    } else {
        return false;
    }
}

// 
Spawn.prototype.isCreating = function(memory) {
    if(this.spawning) {
        const name = this.spawning.name;
        const creep = Game.namedCreeps[name];

        //log(creep.memory.hub, creep.memory.origin, _.where(creep.memory, memory).length);

        // Wasn't sure how to compare the memory objects, so just comparing origin instead...
        if(creep && creep.memory.origin === memory.origin) {
            return true;
        } else {
            return false;
        }
    }
}

// Calculate expected strength of creep...
Spawn.prototype.getExpectedGuardStrength = function() {
    var body = this.dynamicAssemble('guard');
    var strength = body.length * 100;
    return strength;
}

// This will dynamically create the creep body depending on how much energy the room/spawn has...
Spawn.prototype.dynamicAssemble = function(origin) {
    var capacity = this.room.energyCapacityAvailable;
    var parts = [];
    var conf = config.hubs[this.pos.roomName];
    // Used later...
    var costs;
    var numberOfParts = 0;

    // We don't want godlike creeps for small hubs, so we're putting in a hub limiter... not applicable to guards, we want those hench :P
    // Really what I should probably do is have hench dudes and less creeps... hmm...
    if(capacity > conf.spawn.energyLimit && origin !== 'guard') {
        capacity = conf.spawn.energyLimit;
    }
    
    // Every body needs 1 MOVE
    capacity = capacity - BODYPART_COST.move;
    
    // Commoner type
    if(origin === 'commoner') {
        // Add 1 WORK atleast
        capacity = capacity - BODYPART_COST.work;
        // Add 1 CARRY atleast
        capacity = capacity - BODYPART_COST.carry;
        
        // If we can get 1 of everything, let's do it!
        costs = (BODYPART_COST.carry + BODYPART_COST.move + BODYPART_COST.work);
        numberOfParts = Math.floor(capacity / costs);

        // Limiting to 50...
        const numberOfTypes = 3;
        const extraParts = 3;
        if((numberOfTypes * numberOfParts) > (MAX_CREEP_SIZE - extraParts)) {
            numberOfParts = Math.floor((MAX_CREEP_SIZE-extraParts) / numberOfTypes);
        }

        if(numberOfParts >= 1) {
            parts.push.apply(parts, this.buildNumberOfParts(WORK, numberOfParts));
            parts.push.apply(parts, this.buildNumberOfParts(MOVE, numberOfParts));
            parts.push.apply(parts, this.buildNumberOfParts(CARRY, numberOfParts));
            capacity = capacity - (costs*numberOfParts);
        }

        // End so we always have these...
        parts.push(WORK);
        parts.push(CARRY);
    }
    
    // Miner type
    if(origin === 'miner') {
        // Try to get 5 works, but settle for less... later it might be good to determine if a spawn can make a miner and if not spawn from elsewhere
        costs = (BODYPART_COST.work);
        numberOfParts = Math.floor(capacity / costs);

        // Limit to 5
        if(numberOfParts > 5) {
            numberOfParts = 5;
        }

        if(numberOfParts >= 1) {
            parts.push.apply(parts, this.buildNumberOfParts(WORK, numberOfParts));
            capacity = capacity - (costs*numberOfParts);
        }
    }
    
    // Hauler type
    if(origin === 'hauler') {
        // Add 1 CARRY atleast
        capacity = capacity - BODYPART_COST.carry;
        // Add 1 WORK atleast, so that they can repair roads as they move
        capacity = capacity - BODYPART_COST.work;
        
        // Double work over carry
        costs = (BODYPART_COST.carry + BODYPART_COST.move);
        numberOfParts = Math.floor(capacity / costs);

        // Limiting to 50...
        const numberOfTypes = 2;
        const extraParts = 3;
        if((numberOfTypes * numberOfParts) > (MAX_CREEP_SIZE - extraParts)) {
            numberOfParts = Math.floor((MAX_CREEP_SIZE-extraParts) / numberOfTypes);
        }

        if(numberOfParts >= 1) {
            parts.push.apply(parts, this.buildNumberOfParts(MOVE, numberOfParts));
            parts.push.apply(parts, this.buildNumberOfParts(CARRY, numberOfParts));
            capacity = capacity - (costs*numberOfParts);
        }

        // End so we always have these
        parts.push(CARRY);
        parts.push(WORK);
    }
    
    // Guard type
    if(origin === 'guard') {
        //parts.push(HEAL); // I want this last
        capacity = capacity - BODYPART_COST.heal;

        // All tough, move, and attack...
        costs = (BODYPART_COST.tough + BODYPART_COST.move + BODYPART_COST.attack);
        numberOfParts = Math.floor(capacity / costs);

        // Limiting to 50...
        const numberOfTypes = 3;
        const extraParts = 2;
        if((numberOfTypes * numberOfParts) > (MAX_CREEP_SIZE - extraParts)) {
            numberOfParts = Math.floor((MAX_CREEP_SIZE-extraParts) / numberOfTypes);
        }

        if(numberOfParts >= 1) {
            parts.push.apply(parts, this.buildNumberOfParts(TOUGH, numberOfParts));
            parts.push.apply(parts, this.buildNumberOfParts(MOVE, numberOfParts));
            parts.push.apply(parts, this.buildNumberOfParts(ATTACK, numberOfParts));
            capacity = capacity - (costs*numberOfParts);
        }

        parts.push(HEAL);
    }
    
    // Reserver type
    if(origin === 'claimer') {
        // Just have 2 claim body parts... to build up a surplus of ticks
        capacity = capacity - BODYPART_COST.claim;
        parts.push(CLAIM);
        capacity = capacity - BODYPART_COST.move;
        parts.push(MOVE);
        capacity = capacity - BODYPART_COST.claim;
        parts.push(CLAIM);
    }

    // Adding movement to the end, so we always have 1 movement no matter what...
    parts.push(MOVE);
    
    return parts;
}

Spawn.prototype.buildNumberOfParts = function(part, count) {
    var parts = Array(count+1).join(part+','); // We're adding 1 here, it's because join basically connects the array middle bits, if we just have 1 item in an array, no middle bits!
    parts = parts.substring(0, parts.length - 1).split(',');
    return parts;
}

Spawn.prototype.removeCreation = function(memory) {
    if(!this.memory.creationQueue) {
        this.memory.creationQueue = [];
    }

    this.memory.creationQueue = _.reject(this.memory.creationQueue, (creation) => (creation.memory.origin === memory.origin));
}

Spawn.prototype.trimBody = function(body) {
    if(this.canCreateCreep(body) !== ERR_NOT_ENOUGH_ENERGY) {
        return body;
    } else {
        // Still can't afford, so get rid of the first in list of body parts... this is because we have prioritized how the body is built...
        body.shift();
        return this.trimBody(body);
    }
}

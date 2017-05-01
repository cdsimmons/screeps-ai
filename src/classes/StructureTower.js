// Required modules
var log = require('helpers/log');
var config = require('config');

// Log
log('Loading: classes/tower');

StructureTower.prototype.actionIsWork = function() {
    // Currently harvest is marked as taking work... which is partly true, but a miner won't ever reach capacity so doesn't fit with logic later
    if(this.memory.destination && this.memory.destination.method) {
        return _.contains(config.actions.work, this.memory.destination.method);
    } else {
        return false;
    }
}

// Tower not limited to range
StructureTower.prototype.getActionRange = function() {
    return 50;
}

StructureTower.prototype.hasBodyPart = function(part) {
    return _.contains([ATTACK, RANGED_ATTACK, HEAL, WORK, CARRY], part);
}

StructureTower.prototype.isEmpty = function() {
    return (this.energy === 0);
}

StructureTower.prototype.isFull = function() {
    return (this.energy === this.energyCapacity);
}

StructureTower.prototype.isStale = function() {
    // We need to either define it, or update it if it's out of date by a tick
    if(this.memory.isStale === undefined || this.memory.carriedTimestamp !== Game.time) {
        //log(this.name, this.memory.carried, _.sum(this.carry), this.carryCapacity);
        // If the energy is the same as the energy in previous (previous)
        if(this.memory.carried !== this.energy || this.energyCapacity === 0) {
            this.memory.isStale = false;
        } else {
            this.memory.isStale = true;
        }
        
        // Update the energy
        this.memory.carried = this.energy;
        // Update when it last checked it was regenerating...
        this.memory.carriedTimestamp = Game.time;
    }

    return this.memory.isStale;
}

StructureTower.prototype.moveTo = function(string) {
    // Just patching for Creep treatment...
    // Tower is nuts if it tries to move, so clear it's assignment and destination...
    delete this.memory.assignment;
    delete this.memory.destination;
}

StructureTower.prototype.say = function(string) {
    return log('Tower says... '+string);
}

StructureTower.prototype.transitioned = function() {
    return false;
}
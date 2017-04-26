// Required modules
var log = require('helpers/log');
var config = require('config');

// Log
log('Loading: classes/creep');

Creep.prototype.actionIsWork = function() {
    // Currently harvest is marked as taking work... which is partly true, but a miner won't ever reach capacity so doesn't fit with logic later
    if(this.memory.destination && this.memory.destination.method) {
        return _.contains(config.actions.work, this.memory.destination.method);
    }
    
    return false;
}

Creep.prototype.getActionRange = function() {
    // Currently harvest is marked as taking work... which is partly true, but a miner won't ever reach capacity so doesn't fit with logic later
    if(this.memory.destination && this.memory.destination.method) {
        if(_.contains(config.actions.ranged, this.memory.destination.method)) {
            return 3;
        }
    }

    return 1;
}

Creep.prototype.isFull = function() {
    return (_.sum(this.carry) === this.carryCapacity);
}

Creep.prototype.isEmpty = function() {
    return (_.sum(this.carry) === 0);
}

Creep.prototype.hasBodyPart = function(part) {
    return _.contains(_.pluck(this.body, 'type'), part);
}

Creep.prototype.getBodyCounts = function() {
    return _.countBy(creep.body, function(obj){
        return obj.type;
    });
}

Creep.prototype.transitioned = function() {
    // We need to either define it, or update it if it's out of date by a tick
    if(this.memory.transitioned === undefined || this.memory.transitionedTimestamp !== Game.time) {
        // If the energy is the same as the energy in previous (previous)
        if(this.memory.room === this.pos.roomName) {
            this.memory.transitioned = false;
        } else {
            this.memory.transitioned = true;
        }
        
        // Update the energy
        this.memory.room = this.pos.roomName;
        // Update when it last checked it was regenerating...
        this.memory.transitionedTimestamp = Game.time;
    }

    return this.memory.transitioned;
}

Creep.prototype.isStale = function() {
    // We need to either define it, or update it if it's out of date by a tick
    if(this.memory.isStale === undefined || this.memory.carriedTimestamp !== Game.time) {
        //log(this.name, this.memory.carried, _.sum(this.carry), this.carryCapacity);
        // If the energy is the same as the energy in previous (previous)
        if(this.memory.carried !== _.sum(this.carry) || this.carryCapacity === 0) {
            this.memory.isStale = false;
        } else {
            this.memory.isStale = true;
        }
        
        // Update the energy
        this.memory.carried = _.sum(this.carry);
        // Update when it last checked it was regenerating...
        this.memory.carriedTimestamp = Game.time;
    }

    return this.memory.isStale;
}

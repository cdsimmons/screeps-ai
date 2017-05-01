// Required files
var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: helpers/sort');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// Return target with lowest hits percentage
mod.public.byLowestHitsPercentage = function(targets) {
    var result = _.sortBy(targets, (target) => {
        // Making sure we only look at config cap, not the 300m eventual cap...
        if(_.contains([STRUCTURE_WALL, STRUCTURE_RAMPART], target.structureType)) {
            return target.hits / config.structures.walls.minHits;
        } else {
            return target.hits / target.hitsMax;
        }
    });

    return result;
}

// Return target nearest to target...
// http://support.screeps.com/hc/en-us/articles/203016382-Game#getObjectById - has reference to creep.pos.findClosestByRange(FIND_SOURCES)
// TODO - Add in room distance too (just add 20 for each distance)
mod.public.byNearest = function(targets, pos) {
    // Step into pos if it's there...
    if(pos.pos) {
        pos = pos.pos;
    }

    // Turn into roomPosition object, since it fails sometimes otherwise... strange screeps
    pos = new RoomPosition(pos.x, pos.y, pos.roomName);

    // TODO - Could actually calculate distance with x and y
    var result = _.sortBy(targets, (target) => {
        if(pos.roomName !== target.pos.roomName) {
            return 51 + (Game.map.getRoomLinearDistance(pos.roomName, target.pos.roomName) * 50);
        } else {
            // I am so confused... getRangeTo returns null if target is in another room, but I can't check if it's null! It fails all checks! Wut??
            return pos.getRangeTo(target);
        }
    });

    //log((pos.getRangeTo(result[result.length - 1]) || 51), pos, result[result.length - 1]);

    return result;
}

// Sort by amount... eg spills
mod.public.byAmount = function(targets) {
	var result = _.sortBy(targets, (target) => (target.amount)).reverse();

	return result;
}

// Sort by lowest level... eg spills
mod.public.byLowestLevel = function(targets) {
    var result = _.sortBy(targets, (target) => (target.level));

    return result;
}

module.exports = mod.public;
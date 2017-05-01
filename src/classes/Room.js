// Required modules
var log = require('helpers/log');

// Log
log('Loading: classes/room');

// Pass back tiles
Room.prototype.getSurroundingArea = function(target) {
    var area = this.lookAtArea(target.pos.y-1, target.pos.x-1, target.pos.y+1, target.pos.x+1, true);
    return area;
}

// Calculate the slots physically available
Room.prototype.getSurroundingTerrain = function(target) { 
    var area = this.getSurroundingArea(target);
    var slots = _.filter(area, function(tile) {
        return tile.type === LOOK_TERRAIN;
    });
    
    return slots;
}

Room.prototype.isFull = function() {
	return (this.energyAvailable === this.energyCapacityAvailable);
}
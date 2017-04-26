// Required modules
var log = require('helpers/log');

// Log
log('Loading: classes/room');

Room.prototype.getSurroundingArea = function(point) { // Calculate the slots physically available
    var area = this.lookAtArea(point.pos.y-1, point.pos.x-1, point.pos.y+1, point.pos.x+1, true);
    
    return slots
}

Room.prototype.getSurroundingTerrain = function(point) { // Calculate the slots physically available
    var area = this.lookAtArea(point.pos.y-1, point.pos.x-1, point.pos.y+1, point.pos.x+1, true);
    var slots = _.countBy(area, function(area) {
        return area.terrain;
    });
    
    return slots
}

Room.prototype.isFull = function() {
	return (this.energyAvailable === this.energyCapacityAvailable);
}
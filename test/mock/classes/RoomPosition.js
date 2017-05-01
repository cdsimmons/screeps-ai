
global.RoomPosition = function(x, y, roomName) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;

    // Obviously not incredibly accurate, but good enough for a controlled/testing envrionment...
    this.getRangeTo = function(target) {
    	var origin = this.x + this.y;
    	var destination = target.x + target.y;

    	if(destination > origin) {
    		return destination - origin;
    	} else {
    		return origin - destination;
    	}
    }

    this.inRangeTo = function(target, range) {
        var origin = this.x + this.y;
        var destination = target.pos.x + target.pos.y;

        if(destination > origin) {
            return (destination - origin) <= range;
        } else {
            return (origin - destination) <= range;
        }
    }
};
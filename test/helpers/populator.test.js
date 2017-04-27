// Initialise environment...
require('mock/gameStateStart')();

// Object itself
var populator = require('helpers/populator');

// Tests
describe('helpers/populator', function() {
	it('exists', function(){
		expect(populator).to.exist;
	});

	it('reassigns', function(){
		populator.reassign();
		expect(Game.namedRooms).to.exist;
		expect(Game.namedFlags).to.exist;
		expect(Game.namedCreeps).to.exist;
	});

	// TODO - Have to polyfill room.find somehow...
	// We have room data, but they aren't set to room protos atm
	it('populates', function(){
		console.log('raaa', require('lodash'));
		//populator.populate();
		// expect(Game.rooms).to.exist;
		// expect(Game.creeps).to.exist;
		// expect(Game.flags).to.exist;
		// expect(Game.structures).to.exist;
		// expect(Game.controllers).to.exist;
		// expect(Game.spawns).to.exist;
		// expect(Game.banks).to.exist;
		// expect(Game.towers).to.exist;
	});
});
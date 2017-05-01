// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var populator = require('helpers/populator');

// Tests
describe('helpers/populator', function() {
	beforeEach(function (){
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(populator).to.exist;
	});

	it('should rereference', function(){
		populator.private.rereference();

		expect(Game.namedRooms).to.exist;
		expect(Game.namedCreeps).to.exist;
		expect(Game.namedFlags).to.exist;
	});

	it('should populate Game', function(){
		populator.private.game();

		expect(Game.spills).to.exist;
		expect(Game.hostiles).to.exist;
		expect(Game.controllers).to.exist;
	});

	it('should populate Game.hubs', function(){
		populator.private.hubs();

		expect(Game.hubs).to.exist;
		expect(Game.hubs['sim']).to.exist;
		expect(Game.hubs['bla']).to.not.exist;
		expect(Game.hubs['E53N45']).to.not.exist;
	});
});
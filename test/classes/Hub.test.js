// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// tests.js
describe('Hub', function() {
	beforeEach(function (){
		// Reset game state before every test...
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(Hub).to.exist;
		expect(Game.hubs['sim']).to.exist;
		expect(Game.hubs['sim'].memory).to.exist;
	});

	it('should have properties from Game', function(){
		expect(Game.hubs['sim'].flags).to.exist;
		expect(Game.hubs['sim'].structures).to.exist;
		expect(Game.hubs['sim'].creeps).to.exist;
		expect(Game.hubs['sim'].rooms).to.exist;
		expect(Game.hubs['sim'].spills).to.exist;
	});

	// Equalizer...
	// Can be increased
	// Can be decreased...
	// Can be greater than limit...
	// Can be triggered by hubAssignments?
});
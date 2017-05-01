// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var command = require('helpers/command');

// Tests
describe('helpers/command', function() {
	before(function (){
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(command).to.exist;
	});

	it('helps creeps to forget... shhh... everything will be okay... just forget', function(){
		expect(resetCreepsMemory).to.exist;

		var memories = _.pluck(Game.creeps, 'memory');

		// Make sure we have assignment and destination in some of the creeps memories...
		memories.should.contain.a.thing.with.property('assignment');
		memories.should.contain.a.thing.with.property('destination');

		resetCreepsMemory();

		// Just dreams now... shh...
		memories.should.not.contain.a.thing.with.property('assignment');
		memories.should.not.contain.a.thing.with.property('destination');
	});
});
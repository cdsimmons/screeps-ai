// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var timeout = require('helpers/timeout');

// Tests
describe('helpers/timeout', function() {
	before(function (){
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(timeout).to.exist;
	});

	it('should add a timeout with waiting()', function(){
		var waiting = timeout.waiting('timeoutAddTest', 10);

		expect(timeout.waiting('timeoutAddTest')).to.equal(true);
		expect(Memory.timeout['timeoutAddTest']).to.exist;
		expect(Memory.timeout['timeoutAddTest'].delayedAt).to.equal(Game.time);
		expect(Memory.timeout['timeoutAddTest'].delayedUntil).to.be.above(Game.time);
	});

	it('should know when a timeout expires with waiting()', function(){
		timeout.waiting('timeoutExpiredTest', 10);

		expect(timeout.waiting('timeoutExpiredTest')).to.equal(true);

		Game.time = Game.time + 20;

		expect(timeout.waiting('timeoutExpiredTest')).to.equal(false);
	});
});
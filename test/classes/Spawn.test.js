// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// tests.js
describe('Spawn', function() {
	before(function (){
		// Reset game state before every test...
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(Spawn).to.exist;
		expect(Game.namedSpawns['Spawn1']).to.exist;
		expect(Game.namedSpawns['Spawn1'].memory).to.exist;
	});

	it('should build an array of body parts equal to the number passed buildNumberOfParts()', function(){
		var parts = Game.namedSpawns['Spawn1'].buildNumberOfParts(WORK, 5);

		expect(parts.length).to.equal(5);
		expect(parts).to.include(WORK);
	});

	it('should know if it can afford to build a body or not using canAffordBody()', function(){
		expect(Game.namedSpawns['Spawn1'].canAffordBody([WORK, WORK])).to.equal(true);

		expect(Game.namedSpawns['Spawn1'].canAffordBody([WORK, WORK, WORK, WORK, WORK, HEAL, HEAL, HEAL])).to.equal(false); // Werk werk werk werk werk ye
	});

	it('should create the creep in queue using createCreepInQueue()', function(){
		// TODO... not worth testing the paths...
	});

	it('should know if it is regenerating energy or if its paused using isRegenerating()', function(){
		expect(Game.namedSpawns['Spawn1'].isRegenerating()).to.equal(true);
		Game.time = Game.time + 1;
		expect(Game.namedSpawns['Spawn1'].isRegenerating()).to.equal(false);
	});
});
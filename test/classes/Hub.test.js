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

	it('should have be able to provide us with the mean amount for spills using getSpillMean()', function(){
		expect(Game.hubs['sim'].getSpillMean()).to.equal(460);
	});

	it('should increase demand for a creep using demandCreep()', function(){
		var allowed = Game.hubs['sim'].meetDemand('hauler', 100);
		var demand = Game.hubs['sim'].memory.demand['hauler'];

		expect(demand).to.be.above(0);

		expect(allowed).to.equal(false);

	});

	it('should meet demand for a creep using demandCreep()', function(){
		var allowed = Game.hubs['sim'].meetDemand('hauler', 100);

		expect(allowed).to.equal(false);
		
		Game.hubs['sim'].memory.demand['hauler'] = 10000;

		allowed = Game.hubs['sim'].meetDemand('hauler', 100);

		expect(allowed).to.equal(true);
		expect(Game.hubs['sim'].memory.demand['hauler']).to.equal(0);
	});

	it('should reduce demand using supplyCreeps()', function(){
		var allowed = Game.hubs['sim'].meetDemand('hauler', 100);
		var demand = Game.hubs['sim'].memory.demand['hauler'];

		expect(Game.hubs['sim'].memory.demand['hauler']).to.be.above(0);

		Game.hubs['sim'].supplyDemand();

		expect(Game.hubs['sim'].memory.demand['hauler']).to.be.equal(demand);
	});
});
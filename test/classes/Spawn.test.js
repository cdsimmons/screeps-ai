// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();
var config = require('config');

// tests.js
describe('Spawn', function() {
	// If spawn is tested on its own, it's fine...
	// If I test it with something after it, then config variables are wrong...

	beforeEach(function (){
		// Reset game state before every test...
		require('mock/gameStateStart')();
		global.subject = Game.namedSpawns['Spawn1'];
	});

	it('exists', function(){
		expect(Spawn).to.exist;
		expect(subject).to.exist;
		expect(subject.memory).to.exist;
	});

	it('should build an array of body parts equal to the number passed buildNumberOfParts()', function(){
		var parts = subject.buildNumberOfParts(WORK, 5);

		expect(parts.length).to.equal(5);
		expect(parts).to.include(WORK);
	});

	it('should know if it can afford to build a body or not using canAffordBody()', function(){
		expect(subject.canAffordBody([WORK, WORK])).to.equal(true);
		expect(subject.canAffordBody([WORK, WORK, WORK, WORK, WORK, HEAL, HEAL, HEAL])).to.equal(false); // Werk werk werk werk werk ye
	});

	it('should create the creep in queue using createCreepInQueue()', function(){
		expect(subject.memory.creationQueue.length).to.equal(1);
		expect(subject.createCreepInQueue()).to.equal(OK);
		expect(subject.memory.creationQueue.length).to.equal(0);
	});

	it('should know how strong it will create a guard using getExpectedGuardStrength()', function(){
		expect(subject.getExpectedGuardStrength()).to.equal(1700);
	});

	it('should know if something is already queued for creation using isCreationQueued()', function(){
		expect(subject.isCreationQueued({'cat': 'meow'})).to.equal(false);
		subject.queueCreation([WORK], {'cat': 'meow'});
		expect(subject.isCreationQueued({'cat': 'meow'})).to.equal(true);
	});

	it('should know if something is already being created using isCreating()', function(){
		expect(subject.isCreating({'origin': 'commoner'})).to.equal(false);

		subject.queueCreation([WORK], {'origin': 'commoner'});
		expect(subject.createCreepInQueue()).to.equal(OK);

		expect(subject.isCreating({'origin': 'commoner'})).to.equal(true);
	});

	it('should know if it is regenerating energy or if its paused using isRegenerating()', function(){
		expect(subject.isRegenerating()).to.equal(true);
		Game.time = Game.time + 1;
		expect(subject.isRegenerating()).to.equal(false);
	});

	it('should be able to queue a creep using queueCreation()', function(){
		expect(subject.memory.creationQueue.length).to.equal(1);
		subject.queueCreation([WORK], {'origin': 'commoner'});
		expect(subject.memory.creationQueue.length).to.equal(2);
	});

	it('should be able to remove a creep from the queue using removeCreation()', function(){
		expect(subject.memory.creationQueue.length).to.equal(1);
		subject.queueCreation([WORK], {'origin': 'commoner'});
		expect(subject.memory.creationQueue.length).to.equal(2);
		subject.removeCreation({'origin': 'commoner'});
		expect(subject.memory.creationQueue.length).to.equal(1);
	});

	it('should not add a creep if it is already in the queue using smartQueueCreation()', function(){
		expect(subject.memory.creationQueue.length).to.equal(1);
		subject.smartQueueCreation([WORK], {'origin': 'commoner'});
		expect(subject.memory.creationQueue.length).to.equal(2);
		subject.smartQueueCreation([WORK], {'origin': 'commoner'});
		expect(subject.memory.creationQueue.length).to.equal(2);
	});

	it('should trim down a body until it can afford it using trimBody()', function(){
		expect(subject.trimBody([WORK, WORK, WORK, WORK, WORK, WORK]).length).to.equal(5);
	});

	it('should know if it will recover energy using willRecoverEnergy()', function(){
		expect(subject.willRecoverEnergy()).to.equal(true);
		Game.time = Game.time + 1;
		expect(subject.willRecoverEnergy()).to.equal(true);
		Game.hubs['sim'].highEnergyBanks = [];
		expect(subject.willRecoverEnergy()).to.equal(false);
	});

	it('should be able to put together a creep body using dynamicAssemble()', function(){
		var guard = subject.dynamicAssemble('guard');
		var miner = subject.dynamicAssemble('miner');

		expect(guard.length).to.equal(17);
		expect(guard).to.contain(TOUGH);
		expect(guard).to.contain(ATTACK);
		expect(guard).to.contain(MOVE);
		expect(guard).to.not.contain(WORK);

		expect(miner.length).to.equal(6);
		expect(miner).to.contain(WORK);
		expect(miner).to.contain(MOVE);
		expect(miner).to.not.contain(ATTACK);
	});
});
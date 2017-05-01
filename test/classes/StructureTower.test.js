// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// tests.js
describe('StructureTower', function() {
	beforeEach(function (){
		// Reset game state before every test...
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(StructureTower).to.exist;
		expect(Game.towers[0]).to.exist;
		expect(Game.towers[0].memory).to.exist;
	});

	it('should know whether its current destination action is work using actionIsWork()', function(){
		expect(Game.towers[0].actionIsWork()).to.equal(true);
	});

	it('should know that its range is an entire room getActionRange()', function(){
		expect(Game.towers[0].getActionRange()).to.equal(50);
	});

	it('should know what body parts it has using hasBodyPart()', function(){
		expect(Game.towers[0].hasBodyPart(MOVE)).to.equal(false);
		expect(Game.towers[0].hasBodyPart(CARRY)).to.equal(true);
		expect(Game.towers[0].hasBodyPart(ATTACK)).to.equal(true);
	});

	it('should know if it is empty of energy using isEmpty()', function(){
		expect(Game.towers[0].isEmpty()).to.equal(false);

		Game.towers[0].energy = 0;

		expect(Game.towers[0].isEmpty()).to.equal(true);
	});

	it('should know if it has reached its energy capacity using isFull()', function(){
		expect(Game.towers[0].isFull()).to.equal(false);

		Game.towers[0].energy = Game.towers[0].energyCapacity;

		expect(Game.towers[0].isFull()).to.equal(true);
	});

	it('should know if it has the same energy as before using isStale()', function(){
		expect(Game.towers[0].isStale()).to.equal(false);
		// Have to increase time and change his roomName...
		Game.time = Game.time + 1;
		// And check again...
		expect(Game.towers[0].isStale()).to.equal(true);
	});

	it('should wipe its assignment and destination if it gets told to move anywhere using moveTo()', function(){
		expect(Game.towers[0].memory.assignment).to.not.equal(undefined);

		Game.towers[0].moveTo(undefined);

		expect(Game.towers[0].memory.assignment).to.equal(undefined);
	});

	// TODO
	it('should log if it tries to say something using say()', function(){
		expect(Game.towers[0].say('ra ra will be logged')).to.equal(undefined);
	});

	it('should never changed room so it should never say it is transitioned using transitioned()', function(){
		expect(Game.towers[0].transitioned()).to.equal(false);
	});
});
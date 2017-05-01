// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

describe('Creep', function() {
	beforeEach(function (){
		// Reset game state before every test...
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(Creep).to.exist;
		expect(Game.namedCreeps['James']).to.exist;
		expect(Game.namedCreeps['James'].memory).to.exist;
		expect(Game.namedCreeps['Logan'].memory).to.exist;
	});

	it('should know whether its current destination action is work using actionIsWork()', function(){
		// James is working!
		expect(Game.namedCreeps['James'].actionIsWork()).to.equal(true);
		// Logan is not... lazy Logan
		expect(Game.namedCreeps['Logan'].actionIsWork()).to.equal(false);
	});

	it('should know the range of its destination action using getActionRange()', function(){
		// James has a long range action
		expect(Game.namedCreeps['James'].getActionRange()).to.equal(3);
		// Logan has a short ranged action... short armed Logan
		expect(Game.namedCreeps['Logan'].getActionRange()).to.equal(1);
	});

	it('should know if it has a certain body part using getBodyCounts()', function(){
		// James... of course he has carry body parts, he isn't empty
		expect(Game.namedCreeps['James'].hasBodyPart(CARRY)).to.equal(true);
		// Logan... as we thought he doesn't have any carry parts :)
		expect(Game.namedCreeps['Logan'].hasBodyPart(CARRY)).to.equal(false);
	});

	it('should know if it has reached its empty using isEmpty()', function(){
		// James is not empty or full...
		expect(Game.namedCreeps['James'].isEmpty()).to.equal(false);
		// Logan is empty... he can't carry any more, and he's empty... this is because he has no carry parts! :)
		expect(Game.namedCreeps['Logan'].isEmpty()).to.equal(true);
	});

	it('should know if it has reached its carry capacity using isFull()', function(){
		// James is not full, he can carry more!
		expect(Game.namedCreeps['James'].isFull()).to.equal(false);
		// Logan can't carry any more
		expect(Game.namedCreeps['Logan'].isFull()).to.equal(true);
	});

	it('should know if it has the same energy as before using isStale()', function(){
		expect(Game.namedCreeps['James'].isStale()).to.equal(false);
		// Have to increase time and change his roomName...
		Game.time = Game.time + 1;
		// And check again...
		expect(Game.namedCreeps['James'].isStale()).to.equal(true);
	});

	it('should know if it has changed rooms using transitioned()', function(){
		expect(Game.namedCreeps['James'].transitioned()).to.equal(false);
		// Have to increase time and change his roomName...
		Game.time = Game.time + 1;
		Game.namedCreeps['James'].pos.roomName = 'notsim';
		// And check again...
		expect(Game.namedCreeps['James'].transitioned()).to.equal(true);
	});

});
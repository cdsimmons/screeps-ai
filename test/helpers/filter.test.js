// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var filter = require('helpers/filter');

// Tests
describe('helpers/filter', function() {
	before(function (){
		require('mock/gameStateStart')();
	});

	beforeEach(function (){
		require('mock/gameStateStart')();
		Game.time = 10;
	});

	it('exists', function(){
		expect(filter).to.exist;
	});

	it('should filter objects to return one that matches id using byId()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byId(targets, 'Logan');

		expect(filteredTargets.name).to.equal('Logan');
	});

	it('should filter objects to return one that matches id using byId()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byId(targets, 'Logan');

		expect(filteredTargets.name).to.equal('Logan');
	});

	it('should filter objects by their property amount using byAmount()', function(){
	    var targets = Game.spills;
	    var filteredTargets = filter.byAmount(targets, 500, 1000);

	    expect(filteredTargets.length).to.equal(1);
	    _.pluck(filteredTargets, 'amount').should.all.be.above(500);
	    _.pluck(filteredTargets, 'amount').should.all.be.below(1000);
	});

	it('should filter objects by whether they are alive or not using byAlive()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byAlive(targets);

	    expect(targets.length).to.equal(5);
	    expect(filteredTargets.length).to.equal(4);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by what assignment is using byAssignmentId()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byAssignmentId(targets, '137e6c438abe9468e4d5a24e');

	    expect(filteredTargets.length).to.equal(2);
	});

	it('should filter objects by what assignment is not limited using byAssignedLimit()', function(){
	    var targets = Game.constructionSites;
	    var filteredTargets = filter.byAssignedLimit(targets, 1);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(2);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having body part using byBodyPart()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byBodyPart(targets, CARRY);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by already being busy using byBusy()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byBusy(targets);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by capacity property using byCapacityPercentage()', function(){
	    var targets = Game.structures;
	    var filteredTargets = filter.byCapacityPercentage(targets, 80, 100);

	    expect(filteredTargets.length).to.equal(2);
	    expect(targets.length).to.equal(50);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having colors using byColors()', function(){
	    var targets = Game.flags;
	    var filteredTargets = filter.byColors(targets, COLOR_ORANGE, COLOR_ORANGE);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(3);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects on whether they exist in game using byGameExistence()', function(){
	    var targets = ['sim', 'bla'];
	    var filteredTargets = filter.byGameExistence(targets, 'namedRooms');

		expect(filteredTargets.length).to.equal(1);
	});

	it('should filter objects by having an assignee using byHasAssignee()', function(){
	    var targets = Game.lowEnergyStructures;
	    var filteredTargets = filter.byHasAssignee(targets);

	    expect(filteredTargets.length).to.equal(2);
	    expect(targets.length).to.equal(15);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having an assignment using byHasAssignment()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byHasAssignment(targets);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);

	    filteredTargets = filter.byHasAssignment(targets, 'build');
	    expect(filteredTargets.length).to.equal(1);
	});

	it('should filter objects by having a controller in the roomName using byHasController()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byHasController(targets, 'sim');

	    expect(filteredTargets.length).to.equal(5);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having a destination using byHasDestination()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byHasDestination(targets);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having a destinee using byHasDestinee()', function(){
	    var targets = Game.lowEnergyStructures;
	    var filteredTargets = filter.byHasDestinee(targets);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(15);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by hits range using byHits()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byHits(targets, 10, 10000);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by hits percentage range using byHitsPercentage()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byHitsPercentage(targets, 10, 100);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by belonging to hub using byHub()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byHub(targets, {id: 'sim'});

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by being idle using byIdle()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byIdle(targets);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by memory key using byMemory()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byMemory(targets, 'origin', 'miner');

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	// TODO
	it('should filter objects by most suitable spawn using byMostSuitableSpawn()', function(){
		// Filter out those with less than 3 creeps in queue
		    // If we have 3 or greater... accept filter
		// Filter to nearest 3 (sort and union 1 2 and 3 I guess?)
		// sortBy one with most energyCapacityAvailable...
	});

	it('should filter objects by not having an assignee using byNotHasAssignee()', function(){
	    var targets = Game.lowEnergyStructures;
	    var filteredTargets = filter.byNotHasAssignee(targets);

	    expect(filteredTargets.length).to.equal(13);
	    expect(targets.length).to.equal(15);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by not having an assignment using byNotHasAssignment()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byNotHasAssignment(targets);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by not having a destination using byNotHasDestination()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byNotHasDestination(targets);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by not having a destination using byNotHasDestinee()', function(){
	    var targets = Game.lowEnergyStructures;
	    var filteredTargets = filter.byNotHasDestinee(targets);

	    expect(filteredTargets.length).to.equal(14);
	    expect(targets.length).to.equal(15);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by not having a destination using byNotHasDestinee()', function(){
	    var targets = Game.lowEnergyStructures;
	    var filteredTargets = filter.byNotHasDestinee(targets);

	    expect(filteredTargets.length).to.equal(14);
	    expect(targets.length).to.equal(15);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by needing repairs using byNeedsRepairing()', function(){
	    var targets = Game.structures;
	    var filteredTargets = filter.byNeedsRepairing(targets);

	    expect(filteredTargets.length).to.equal(12);
	    expect(targets.length).to.equal(50);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by needing a top-up using byNeedsRepairingTopup()', function(){
	    var targets = Game.structures;
	    var filteredTargets = filter.byNeedsRepairingTopup(targets);

	    expect(filteredTargets.length).to.equal(2);
	    expect(targets.length).to.equal(50);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by primary color using byPrimaryColor()', function(){
	    var targets = Game.flags;
	    var filteredTargets = filter.byPrimaryColor(targets, COLOR_ORANGE);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(3);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by being in range using byRange()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byRange(Game.creeps, Game.spawns[0].pos, 3);

	    expect(filteredTargets.length).to.equal(2);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by being in the passed roomName using bySameRoom()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.bySameRoom(Game.creeps, 'sim');

	    expect(filteredTargets.length).to.equal(5);
	    expect(targets.length).to.equal(5);

	    filteredTargets = filter.bySameRoom(Game.creeps, 'bla');

	    expect(filteredTargets.length).to.equal(0);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by being in the passed roomName array using bySameRooms()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.bySameRooms(Game.creeps, ['sim', 'bla']);

	    expect(filteredTargets.length).to.equal(5);
	    expect(targets.length).to.equal(5);

	    filteredTargets = filter.bySameRoom(Game.creeps, ['bla']);

	    expect(filteredTargets.length).to.equal(0);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having the secondary color using bySecondaryColor()', function(){
	    var targets = Game.flags;
	    var filteredTargets = filter.bySecondaryColor(targets, COLOR_ORANGE);

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(3);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having the structure type using byStructureTypes()', function(){
	    var targets = Game.structures;
	    var filteredTargets = filter.byStructureTypes(targets, STRUCTURE_WALL);

	    expect(filteredTargets.length).to.equal(11);
	    expect(targets.length).to.equal(50);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by having ticksToLive in a passed range using byTicksLeft()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byTicksLeft(targets, 0, 1000);

	    expect(filteredTargets.length).to.equal(2);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by property type using byTypes()', function(){
	    var targets = Game.flags[1].room.lookAt(Game.flags[1]);
        var filteredTargets = _.pluck(filter.byTypes(targets, ['structure']), 'structure');

	    expect(filteredTargets.length).to.equal(1);
	    expect(targets.length).to.equal(3);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});

	it('should filter objects by not having passed targets using byWithout()', function(){
	    var targets = Game.creeps;
	    var filteredTargets = filter.byWithout(targets, Game.minerCreeps);

	    expect(filteredTargets.length).to.equal(4);
	    expect(targets.length).to.equal(5);

	    expect(targets.length).to.be.at.least(filteredTargets.length);
	});
});
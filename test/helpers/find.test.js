// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var find = require('helpers/find');

// Tests
describe('helpers/find', function() {
	before(function (){
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(find).to.exist;
	});

	it('should find the bank with banks()', function() {
		var targets = find.banks();
		var target = targets[0];

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('storeCapacity');
		targets.should.all.have.property('structureType', 'storage');
	});

	it('should find the construction sites with constructionSites()', function() {
		var targets = find.constructionSites();

		expect(targets).to.have.lengthOf(2);
		targets.should.all.have.property('progress');
	});

	it('should find the controller with controllers()', function() {
		var targets = find.controllers();

		expect(targets).to.have.lengthOf(2);
		targets.should.all.have.property('ticksToDowngrade');
		targets.should.all.have.property('structureType', STRUCTURE_CONTROLLER);
	});

	it('should find the creeps with creeps()', function() {
		var targets = find.creeps();

		expect(targets).to.have.lengthOf(5);
		targets.should.all.have.property('name');
		targets.should.all.have.property('body');
		targets.should.all.have.property('memory');
	});

	it('should find the damaged structures with damagedStructures()', function() {
		var targets = find.damagedStructures();
		var target = targets[0];

		expect(targets).to.have.lengthOf(12);
		targets.should.all.have.property('hits');
		expect(target.hits).to.be.below(target.hitsMax);
	});

	it('should find the decaying structures with decayingStructures()', function() {
		var targets = find.decayingStructures();

		expect(targets).to.have.lengthOf(19);
		targets.should.all.have.property('ticksToDecay');
	});

	it('should find the imminent nukes with imminentNukes()', function() {
		var targets = find.imminentNukes();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('timeToLand');
	});

	it('should find the flags with flags()', function() {
		var targets = find.flags();

		expect(targets).to.have.lengthOf(3);
		targets.should.all.have.property('name');
	});

	it('should find the flags with flags()', function() {
		var targets = find.flags();

		expect(targets).to.have.lengthOf(3);
		targets.should.all.have.property('name');
		targets.should.all.have.property('color');
	});

	it('should find the hostiles with hostiles()', function() {
		var targets = find.hostiles();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('body');
		targets.should.all.have.property('my', false);
	});

	it('should find the hub configs with hubConfigs()', function() {
		var targets = find.hubConfigs();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('rooms');
		targets.should.all.have.property('creeps');
		targets.should.all.have.property('spawn');
	});

	// TODO - This hub stuff isn't really finding anything?... it's returning some IDs, but no targets/objects really...
	it('should find the hub id with hubId()', function() {
		// Have to pass in a target to get hub Id
		var target = find.creeps()[0];
		var id = find.hubId(target);

		expect(id).to.equal('sim');
	});
	it('should find the hub ids with hubIds()', function() {
		var targets = find.hubIds();

		expect(targets).to.have.lengthOf(1);
		expect(targets).to.include('sim');
	});
	it('should find the hub room ids with hubRoomIds()', function() {
		var targets = find.hubRoomIds();

		expect(targets).to.have.lengthOf(1);
		expect(targets).to.include('sim');
	});

	it('should find the low energy structures with lowEnergyStructures()', function() {
		var targets = find.lowEnergyStructures();
		var target = targets[0];

		expect(targets).to.have.lengthOf(15);
		targets.should.all.have.property('structureType');
		expect(target.energy).to.be.below(target.energyCapacity);
	});

	it('should find the nuke launchers with nukers()', function() {
		var targets = find.nukers();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('structureType', STRUCTURE_NUKER);
	});

	it('should find the roads with roads()', function() {
		var targets = find.roads();

		expect(targets).to.have.lengthOf(19);
		targets.should.all.have.property('ticksToDecay');
		targets.should.all.have.property('structureType', STRUCTURE_ROAD);
	});

	it('should find the rooms with rooms()', function() {
		var targets = find.rooms();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('name');
	});

	it('should find the rooms with spawns()', function() {
		var targets = find.spawns();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('name');
		targets.should.all.have.property('structureType', STRUCTURE_SPAWN);
	});

	it('should find the spills with spills()', function() {
		var targets = find.spills();

		expect(targets).to.have.lengthOf(2);
		targets.should.all.have.property('amount');
		targets.should.all.have.property('resourceType');
	});

	it('should find the structures with structures()', function() {
		var targets = find.structures();

		expect(targets).to.have.lengthOf(50);
		targets.should.all.have.property('pos');
		targets.should.all.have.property('structureType');
	});

	it('should find the toppingUpStructures with toppingUpStructures()', function() {
		var targets = find.toppingUpStructures();
		var target = targets[0];

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('structureType');
		targets.should.all.have.property('ticksToDecay');
		expect(target.hits).to.be.below(target.hitsMax);
	});

	it('should find the towers with towers()', function() {
		var targets = find.towers();

		expect(targets).to.have.lengthOf(1);
		targets.should.all.have.property('structureType', STRUCTURE_TOWER);
	});

	it('should find the walls with walls()', function() {
		var targets = find.walls();

		expect(targets).to.have.lengthOf(11);
		targets.should.all.have.property('structureType', STRUCTURE_WALL);
	});
});
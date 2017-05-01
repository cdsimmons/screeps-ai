// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var sort = require('helpers/sort');

// Tests
describe('helpers/sort', function() {
	before(function (){
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(sort).to.exist;
	});

	it('should sort targets by lowest hp with byLowestHitsPercentage()', function(){
		var targets = Game.structures;
		var sortedTargets = sort.byLowestHitsPercentage(targets);

		expect(targets.length).to.equal(sortedTargets.length);
		expect(targets).to.not.equal(sortedTargets);

		// Make sure the hits are below the max for the first item... it's damaged...
		expect(sortedTargets[0].hits).to.be.below(sortedTargets[0].hitsMax);
		// Make sure the 2nd item has the same or more hp than the 1st
		expect(sortedTargets[1].hits).to.be.at.least(sortedTargets[0].hits);
	});

	it('should sort targets by lowest hp with byLowestHitsPercentage()', function(){
		var origin = {x: 0, y: 0, roomName: 'sim'};
		var targets = Game.creeps;
		var sortedTargets = sort.byNearest(targets, origin);

		expect(targets.length).to.equal(sortedTargets.length);
		expect(targets).to.not.equal(sortedTargets);

		// Make sure that the 2nd item is further away from the origin than the first...
		expect(sortedTargets[1].pos.x + sortedTargets[1].pos.y).to.be.at.least(sortedTargets[0].pos.x + sortedTargets[0].pos.y);
	});

	it('should sort targets by amount property with byAmount()', function(){
		var targets = Game.spills;
		var sortedTargets = sort.byAmount(targets);

		expect(targets.length).to.equal(sortedTargets.length);
		expect(targets).to.not.equal(sortedTargets);

		// Make sure that the 1st item has more than the 2nd
		expect(sortedTargets[0].amount).to.be.at.least(sortedTargets[1].amount);
	});

	it('should sort targets by level property with byLowestLevel()', function(){
		var targets = Game.controllers;
		var sortedTargets = sort.byLowestLevel(targets);

		expect(targets.length).to.equal(sortedTargets.length);
		expect(targets).to.not.equal(sortedTargets);

		// Make sure that the 1st item is lower than the 2nd
		expect(sortedTargets[1].level).to.be.at.least(sortedTargets[0].level);
	});
});
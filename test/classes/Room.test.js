// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// tests.js
describe('Room', function() {
	before(function (){
		// Reset game state before every test...
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(Room).to.exist;
		expect(Game.namedRooms['sim']).to.exist;
		expect(Game.namedRooms['sim'].memory).to.exist;
	});

	it('should be able to look at an area around a target using getSurroundingArea()', function(){
		var target = Game.namedFlags['Flag1'];
		var room = Game.namedRooms['sim'];
		var area = room.getSurroundingArea(target);

		// 9 bits of terrain, plus 2 objects (source and flag)
		expect(area.length).to.equal(11);
	});

	it('should be able to look at the terrain around a target using getSurroundingTerrain()', function(){
		var target = Game.namedFlags['Flag1'];
		var room = Game.namedRooms['sim'];
		var area = room.getSurroundingTerrain(target);

		expect(area.length).to.equal(9);
	});

	it('should know whether it is full on energy using isFull()', function(){
		expect(Game.namedRooms['sim'].isFull()).to.equal(false);

		Game.namedRooms['sim'].energyAvailable = Game.namedRooms['sim'].energyCapacityAvailable;

		expect(Game.namedRooms['sim'].isFull()).to.equal(true);
	});
});
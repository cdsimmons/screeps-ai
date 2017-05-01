// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var cache = require('helpers/cache');

// Tests
describe('helpers/cache', function() {
	beforeEach(function (){
		require('mock/gameStateStart')();
	});
	
	it('exists', function(){
		expect(cache).to.exist;
	});

	it('should store object with store()', function(){
		var target = {cat: 'meow'};

		cache.store('storeTest', target, 10);

		var storeTarget = Memory.cache['storeTest'];

		expect(storeTarget).to.exist;
		expect(storeTarget.expiresAt).to.equal(10 + Game.time);
		expect(storeTarget.value.cat).to.equal('meow');
	});

	it('should retrieve object with retrieve()', function(){
		var target = {cat: 'meow'};

		cache.store('retrieveTest', target, 10);
		
		var retrieveTarget = cache.retrieve('retrieveTest');

		expect(retrieveTarget).to.exist;
		expect(retrieveTarget).to.equal(target);
	});

	it('should check expiration correctly with expired()', function(){
		var target = {cat: 'meow'};

		cache.store('expirationTest', target, 10);

		expect(cache.private.expired('expirationTest')).to.equal(false);
		Game.time = Game.time + 12;
		expect(cache.private.expired('expirationTest')).to.equal(true);
	});

	it('should spread out cache with spread()', function(){
		// Get to new time...
		Game.time = Game.time + 20;

		var target = {cat: 'meow'};

		cache.store('spreadTarget', target, 10);

		var spreadTarget = Memory.cache['spreadTarget'];

		// Make sure the spread is greater than the current expiry...
		// This is a bit odd since I've taken out the cache spreader... 
		// Really it should be used before the object is stored
		expect(cache.private.spread(Game.time + 10)).to.equal(spreadTarget.expiresAt + 1);

		// Add another object just after this one...
		cache.store('spreadTargetFiller', target, 11);

		// Cache is now a bit busier, so our next free gap is 2 spaces away...
		expect(cache.private.spread(Game.time + 10)).to.equal(spreadTarget.expiresAt + 2);

	});
});
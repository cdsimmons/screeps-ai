// Initialise environment...
require('mock/gameStateStart')();

// Object itself
var Creep = require('classes/Creep');

// tests.js
describe('Creep', function() {
	it('exists', function(){
		expect(Creep).to.exist;
	});

	it('knows what work is', function(){
		
	});
});
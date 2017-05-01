// Need globals constants and stuff (log relies on this)
require('mock/gameStateGlobals.js')();

// Object itself
var log = require('helpers/log');

// Tests
describe('helpers/log', function() {
	before(function (){
		require('mock/gameStateStart')();
	});

	it('exists', function(){
		expect(log).to.exist;
	});

	it('initialized private.indent', function(){
		expect(log.private.indent).to.equal(0);
	});

	it('should build the log string with buildLog()', function(){
		// String
		expect(log.private.buildLog('test')).to.have.string('Default:');
		expect(log.private.buildLog('test')).to.have.string('test');

		// Object
		expect(log.private.buildLog({'test': 'test'})).to.equal('{"test":"test"}'); //
	});

	it('should build the CPU string with buildCpu()', function(){
		expect(log.private.buildCpu('test')).to.have.string('CPU:');
		expect(log.private.buildCpu('test')).to.have.string('test');
	});

	it('should indent', function(){
		log.cpu('test', 'start');
		expect(log.private.indent).to.equal(1);
	});

	it('should de-indent', function(){
		log.cpu('test', 'end');
		expect(log.private.indent).to.equal(0);
	});

	it('should reset', function(){
		log.reset();
		expect(log.private.indent).to.equal(0);
		expect(log.private.previousCpu).to.equal(0);
	});
});
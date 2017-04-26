// Will just send out average CPU usage every 24 hours

// Eventual idea is to somehow expose the cpu logs in a way that isn't just console logs...
// One solution, would be to build up a CSV string to log, which I can read in the browser using a chrome extension
// Another solution, would be to somehow output the data into a file... 

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function() {
	// If the CPU Usage logging is not defined, populate it with the first sample
	var usedCpu = [];
	if( Memory.cpuUsage === undefined ) {
	    usedCpu = [ Game.cpu.getUsed(), (new Date()).getTime() ];
	    Memory.cpuUsage = {
	        subSum: usedCpu[0],
	        subSamples: [ usedCpu ],
	        samples: [], // 10 minute samples
	        average: 0,
	        tickDuration: 4.0, // Aproximate value taken from field measurement
	        lastSuperSample: 0,
	        lastMegaSample: 0
	    }
	} else {
	    var ticksFor5min = Math.round( 300 / Memory.cpuUsage.tickDuration );

	    // Sum the CPU Usage
	    usedCpu = [ Game.cpu.getUsed(), (new Date()).getTime() ];
	    Memory.cpuUsage.subSum += usedCpu[0];
	    Memory.cpuUsage.subSamples.push( usedCpu );

	    // Clear entries older than 5 minutes
	    while ( Memory.cpuUsage.subSamples.length > ticksFor5min ) {
	        Memory.cpuUsage.subSum -= Memory.cpuUsage.subSamples.shift()[0];
	    }

	    // Improve the average tick duration
	    Memory.cpuUsage.tickDuration = (new Date()).getTime() - Memory.cpuUsage.subSamples[0][1];
	    Memory.cpuUsage.tickDuration /= Memory.cpuUsage.subSamples.length * 1000;

	    // Log samples based on the average for every 5 minute subsamping intervals
	    if( Memory.cpuUsage.lastSuperSample + ticksFor5min <= Game.time ) {
	        Memory.cpuUsage.lastSuperSample = Game.time;

	        // Calculate new average
	        Memory.cpuUsage.average *= Memory.cpuUsage.samples.length;
	        var sample = Memory.cpuUsage.subSum / Memory.cpuUsage.subSamples.length;
	        Memory.cpuUsage.average += sample;
	        Memory.cpuUsage.samples.push( sample );

	        // Remove old samples
	        while ( Memory.cpuUsage.samples.length > 72 ) { // 6 hours
	            Memory.cpuUsage.average -= Memory.cpuUsage.samples.shift();
	        }

	        Memory.cpuUsage.average /= Memory.cpuUsage.samples.length;

	        // Reset subsamping
	        usedCpu = [ Game.cpu.getUsed(), (new Date()).getTime() ];
	        Memory.cpuUsage.subSum = usedCpu[0];
	        Memory.cpuUsage.subSamples = [ usedCpu ];

	        // Every 6 hours email the user with the average CPU Usage
	        var time = (new Date()).getTime();
	        if( Memory.cpuUsage.lastMegaSample + 6 * 14400 * 1000 <= time ) {
	            Memory.cpuUsage.lastMegaSample = time;
	            Game.notify('Average CPU Usage for the last 24h as of ' + new Date() + ' was ' + (Memory.cpuUsage.average).toFixed(2) + 'ms. Game speed at the moment is: ' + (1 / Memory.cpuUsage.tickDuration).toFixed(2) + ' ticks/s.');
	        }
	    }
	}
}


module.exports = mod.public;
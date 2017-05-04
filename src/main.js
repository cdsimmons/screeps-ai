// Require helpers...
//var _ = require('lodash');
var config = require('config');
var log = require('helpers/log');
var monitor = require('helpers/monitor');
var populator = require('helpers/populator');
var cache = require('helpers/cache');
var manage = require('manager/manage');

// Classes... just like with lodash, it might be worth refactoring these so they are not globals...
// Would do this by the classes as externals within webpack and then requiring...
// Reason to do this would be to make things a bit clearer and hopefully make unit testing a bit easier
require('classes/Room');
require('classes/Spawn');
require('classes/Creep');
require('classes/Hub');
require('classes/StructureTower');
// Include command...
require('helpers/command');

// Logging
log('State: main - Initialized');

// The looop
var loop = function () {
    // Cpu before
    log.cpu('///////////// start', 'start');

    // Clean up creep memory...
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    // First call to Memory makes the CPU spike... perhaps it is to do with the size of the Memory?
    log.cpu('Cleaned up memory');
    //cache.cleanup();
    //log.cpu('Cleaned up cache');

    // Prepare global variables every loop...
    populator.all();

    // Manage everything...
    manage.all();

    // if(Game.cpu.bucket !== undefined && Game.cpu.bucket < 1000) {
    //     Game.notify('Low on CPU in bucket!');
    //     log('Low cpu... '+Game.cpu.bucket);
    // }

    // Monitor CPU
    // Just realising, this would be massive... 21k entries in the memory in the end... not worth it...
    //monitor();
    
    // CPU after all that...
    log.cpu('///////////// end', 'end');

    log(Game.cpu.bucket);

    // Reset the log state at end of every loop
    log.reset();
}

module.exports.loop = loop;

// Webpack does CommonJS requiring... but actually we don't want it to do that for us I think...
// Or can we? Is it possible to just exempt 1 file from exporting... if so, then maybe I can still export the loop whilst keeping everything in init
// I export the loop, but everything else is require based...
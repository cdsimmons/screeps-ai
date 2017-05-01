// Require helpers...
//var _ = require('lodash');
var config = require('config');
var log = require('helpers/log');
var monitor = require('helpers/monitor');
var manage = require('manager/manage');
var populator = require('helpers/populator');

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
    // Prepare global variables every loop...
    populator.init = false;
    populator.all();

    // Cpu before
    log.cpu('///////////// start', 'start');

    // Manage everything...
    manage.all();

    // if(Game.cpu.bucket !== undefined && Game.cpu.bucket < 1000) {
    //     Game.notify('Low on CPU in bucket!');
    //     log('Low cpu... '+Game.cpu.bucket);
    // }

    // Reset the log state at end of every loop
    log.reset();

    // Monitor CPU
    // Just realising, this would be massive... 21k entries in the memory in the end... not worth it...
    //monitor();
    
    // CPU after all that...
    log.cpu('///////////// end', 'end');
}

module.exports.loop = loop;

// Webpack does CommonJS requiring... but actually we don't want it to do that for us I think...
// Or can we? Is it possible to just exempt 1 file from exporting... if so, then maybe I can still export the loop whilst keeping everything in init
// I export the loop, but everything else is require based...
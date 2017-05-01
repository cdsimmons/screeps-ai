'use strict';

module.exports = function(reset) {
    require('./gameStateGlobals.js')(reset === undefined ? true : reset);

    // Object population... exported from simulation
    // Stringify and parse, to make sure modifications are cleared before each test
    Game.creeps = JSON.parse(JSON.stringify(require('./objects/Game.creeps')));
    Game.rooms = JSON.parse(JSON.stringify(require('./objects/Game.rooms')));
    Game.spawns = JSON.parse(JSON.stringify(require('./objects/Game.spawns')));
    Game.flags = JSON.parse(JSON.stringify(require('./objects/Game.flags')));
    Game.structures = JSON.parse(JSON.stringify(require('./objects/Game.structures')));
    Game.constructionSites = JSON.parse(JSON.stringify(require('./objects/Game.constructionSites')));
    Game.time = 1;

    Memory = JSON.parse(JSON.stringify(require('./objects/Memory')));

    // We import the objects, but not the functions etc, so we have to assigned that here...
    for(var key in Game.creeps) {
        _.extend(Game.creeps[key], new Creep(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.creeps[key], Creep.prototype);
    }

    for(var key in Game.rooms) {
        _.extend(Game.rooms[key], new Room(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.rooms[key], Room.prototype);
    }

    for(var key in Game.spawns) {
        _.extend(Game.spawns[key], new Spawn(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.spawns[key], Spawn.prototype);
    }

    for(var key in Game.flags) {
        _.extend(Game.flags[key], new Flag(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.flags[key], Flag.prototype);
    }

    for(var key in Game.structures) {
        _.extend(Game.structures[key], new Structure(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.structures[key], Structure.prototype);
    }

    for(var key in Game.constructionSites) {
        _.extend(Game.constructionSites[key], new ConstructionSite(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.constructionSites[key], ConstructionSite.prototype);
    }

    // Build up other Game objects... normally done in the main.js game loop...
    require('helpers/populator').all();

    // We've added new objects to the Game object after populator
    // So need to make sure these have their prototypes defined too where necessary
    for(var key in Game.towers) {
        _.extend(Game.towers[key], new StructureTower(key));
        // Make sure the we have the right prototype for the object...
        Object.setPrototypeOf(Game.towers[key], StructureTower.prototype);
    }
};
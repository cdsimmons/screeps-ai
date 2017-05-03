// This Game population was initially in a World class, but I realised it doesn't need to be there...
// We don't change the World class, we don't initialize it differently like with the Hub... all the find.creeps() was doing was returning Game.creeps... pointless!
// With this, we don't have to create a World class whenever we want Game objects, and we also avoid require loop with find and filter...


var config = require('config');
var log = require('helpers/log');
var find = require('helpers/find');
var filter = require('helpers/filter');

log('Loading: helpers/populator');


// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.private.rereference = function() {
    // I prefer to work with Arrays for my collections, so that I can sort, get first that's nearest, check length quicker, etc...
    // However we need to keep the original hashed objects in case we want to access by name (for example... Game.room[name], to check if it exists)
    Game.namedRooms = Game.rooms;
    Game.namedFlags = Game.flags;
    Game.namedCreeps = Game.creeps;
    Game.namedSpawns = Game.spawns;
}

mod.private.hubs = function() {
    var hubIds = config.hubs;

    // Initiate global hubs if undefined...
    if(!Game.hubs) {
        Game.hubs = {};
    }

    for(let hubId in hubIds) {
        // Check if we have access to hub (it's origin room)... this should be just to phase out sim
        if(Game.namedRooms[hubId]) {
            Game.hubs[hubId] = new Hub(hubId);
        }
    }
}

mod.private.game = function() {
    // First we will populate the important game objects...
    log.cpu('Necessities', 'start');

    var flagColors = config.flags.colors;

    // Room stuff
    Game.rooms = find.rooms();

    // Flags
    Game.flags = find.flags();
    Game.bankFlags = filter.byColors(Game.flags, flagColors.bank.primary, flagColors.bank.secondary);
    log.cpu('flags');

    // Creeps
    Game.creeps = find.creeps();
    Game.minerCreeps = filter.byMemory(Game.creeps, 'origin', 'miner');
    Game.haulerCreeps = filter.byMemory(Game.creeps, 'origin', 'hauler');
    Game.commonerCreeps = filter.byMemory(Game.creeps, 'origin', 'commoner');
    Game.guardCreeps = filter.byMemory(Game.creeps, 'origin', 'guard');
    Game.claimerCreeps = filter.byMemory(Game.creeps, 'origin', 'claimer');
    Game.pesterCreeps = filter.byMemory(Game.creeps, 'origin', 'pester');
    Game.attackingGuardCreeps = filter.byHasAssignment(Game.guardCreeps, 'attack');
    log.cpu('creeps');

    // Structures
    Game.towers = find.towers();
    Game.controllers = find.controllers();
    Game.spawns = find.spawns();
    Game.lowTickControllers = _.filter(Game.controllers, (controller) => (controller.ticksToDowngrade < CONTROLLER_DOWNGRADE[controller.level]*(config.controller.limit/100)));
    Game.lowEnergyStructures = find.lowEnergyStructures();
    Game.banks = find.banks();
    Game.lowEnergyBanks = filter.byCapacityPercentage(Game.banks, 0, 90);
    Game.highEnergyBanks = filter.byCapacityPercentage(Game.banks, 10, 100);
    log.cpu('structures');

    // Misc
    Game.spills = find.spills();
    Game.hostiles = find.hostiles();
    log.cpu('misc');

    log.cpu('Necessities', 'end');

    // If we have more than 100 CPU in the bucket, then we can afford to populate everything and then work on assignments...
    if(!Game.state.lowCpu) {
        log.cpu('Additional', 'start');

        // Creeps
        Game.damagedCreeps = filter.byHitsPercentage(Game.creeps, 0, 99);
        log.cpu('creeps');

        // Flags
        Game.sourceFlags = filter.byColors(Game.flags, flagColors.source.primary, flagColors.source.secondary);
        Game.importantFlags = filter.byColors(Game.flags, flagColors.important.primary, flagColors.important.secondary);
        Game.reserveFlags = filter.byColors(Game.flags, flagColors.reserve.primary, flagColors.reserve.secondary);
        Game.claimFlags = filter.byColors(Game.flags, flagColors.claim.primary, flagColors.claim.secondary);
        Game.pesterFlags = filter.byColors(Game.flags, flagColors.pester.primary, flagColors.pester.secondary);
        Game.eyeballFlags = filter.byColors(Game.flags, flagColors.eyeball.primary, flagColors.eyeball.secondary);
        Game.guardSpotFlags = filter.byColors(Game.flags, flagColors.guardSpot.primary, flagColors.guardSpot.secondary);
        Game.guardRoomFlags = filter.byColors(Game.flags, flagColors.guardRoom.primary, flagColors.guardRoom.secondary);
        Game.guardHubFlags = filter.byColors(Game.flags, flagColors.guardHub.primary, flagColors.guardHub.secondary);
        log.cpu('flags');

        // Constructions... need to limit to hub
        Game.structures = find.structures(); // CPU spikes...
        //Game.towers = find.towers();
        Game.nukers = find.nukers();
        log.cpu('others');
        Game.constructionSites = find.constructionSites();
        log.cpu('constructionSites');
        Game.decayingStructures = find.decayingStructures();
        log.cpu('decayingStructures');
        Game.damagedStructures = find.damagedStructures();
        log.cpu('damagedStructures');
        Game.toppingUpStructures = find.toppingUpStructures();
        log.cpu('toppingUpStructures');
        Game.lowEnergyStructures = find.lowEnergyStructures();
        log.cpu('lowEnergyStructures');

        // Misc
        Game.imminentNukes = find.imminentNukes();

        log.cpu('Additional', 'end');
    }
}

mod.private.state = function() {
    Game.state = {};
    Game.state.lowCpu = (Game.cpu.bucket < config.cpu.surplus);

    log(Game.cpu.bucket);
}

mod.public.all = function() {
    log.cpu('Populator', 'start');
    //if(!Game.namedRooms) {
        log.cpu('init');

        log.cpu('State', 'start');
        mod.private.state();
        log.cpu('State', 'end');
        
        log.cpu('Rereference', 'start');
        mod.private.rereference();
        log.cpu('Rereference', 'end');

        log.cpu('Game', 'start');
        mod.private.game();
        log.cpu('Game', 'end');

        log.cpu('Hubs', 'start');
        mod.private.hubs();
        log.cpu('Hubs', 'end');
    //}
    log.cpu('Populator', 'end');
}

// Expose privates for testing...
mod.public.private = mod.private;

module.exports = mod.public;
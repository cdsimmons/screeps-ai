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
    // Temp vars
    var flagColors = config.flags.colors;

    // Rooms
    Game.rooms = find.rooms();
    log.cpu('rooms');

    // Creeps
    Game.creeps = find.creeps();
    log.cpu('creeps');
    // Filtering
    Game.damagedCreeps = filter.byHitsPercentage(Game.creeps, 0, 99);
    log.cpu('damagedCreeps');
    Game.minerCreeps = filter.byMemory(Game.creeps, 'origin', 'miner');
    Game.haulerCreeps = filter.byMemory(Game.creeps, 'origin', 'hauler');
    Game.commonerCreeps = filter.byMemory(Game.creeps, 'origin', 'commoner');
    Game.guardCreeps = filter.byMemory(Game.creeps, 'origin', 'guard');
    Game.claimerCreeps = filter.byMemory(Game.creeps, 'origin', 'claimer');
    Game.pesterCreeps = filter.byMemory(Game.creeps, 'origin', 'pester');
    log.cpu('originCreeps'); // This is giving me like 2 or 3 CPU... wtf...
    // Filtering more...
    Game.attackingGuardCreeps = filter.byHasAssignment(Game.guardCreeps, 'attack');
    log.cpu('filteredCreeps');

    // Flags... need to limit to hub
    Game.flags = find.flags();
    // Filtering
    Game.sourceFlags = filter.byColors(Game.flags, flagColors.source.primary, flagColors.source.secondary);
    Game.bankFlags = filter.byColors(Game.flags, flagColors.bank.primary, flagColors.bank.secondary);
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
    Game.controllers = find.controllers();
    Game.spawns = find.spawns(); // Could sort busy and energy available
    Game.banks = find.banks(); // Tempted to look at flags instead of the objects, but then I can't query the bank itself? capacity etc...
    Game.towers = find.towers();
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
    // Filtering
    Game.lowTickControllers = _.filter(Game.controllers, (controller) => (controller.ticksToDowngrade < CONTROLLER_DOWNGRADE[controller.level]*(config.controller.limit/100)));
    Game.lowEnergyBanks = filter.byCapacityPercentage(Game.banks, 0, 90);
    Game.highEnergyBanks = filter.byCapacityPercentage(Game.banks, 10, 100); // TODO - increase bottom number...

    // Misc
    Game.spills = find.spills();
    Game.hostiles = find.hostiles();
    Game.imminentNukes = find.imminentNukes();
}

mod.public.all = function() {
    log.cpu('Populator', 'start');
    //if(!Game.namedRooms) {
        log.cpu('init');
        
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
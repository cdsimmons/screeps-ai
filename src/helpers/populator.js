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

// I prefer to work with Arrays for my collections, so that I can sort, get first that's nearest, check length quicker, etc...
// However we need to keep the original hashed objects in case we want to access by name (for example... Game.room[name], to check if it exists)
mod.public.reassign = function() {
    Game.namedRooms = Game.rooms;
    Game.namedFlags = Game.flags;
    Game.namedCreeps = Game.creeps;
}

mod.public.populate = function() {
    log.cpu('Game', 'start');

    // Temp vars
    const flagColors = config.flags.colors;
    log.cpu('init');

    // Rooms
    Game.rooms = find.rooms();

    // Creeps
    Game.creeps = find.creeps();
    // Filtering
    Game.damagedCreeps = filter.byHitsPercentage(Game.creeps, 0, 99);
    Game.minerCreeps = filter.byMemory(Game.creeps, 'origin', 'miner');
    Game.haulerCreeps = filter.byMemory(Game.creeps, 'origin', 'hauler');
    Game.commonerCreeps = filter.byMemory(Game.creeps, 'origin', 'commoner');
    Game.guardCreeps = filter.byMemory(Game.creeps, 'origin', 'guard');
    Game.claimerCreeps = filter.byMemory(Game.creeps, 'origin', 'claimer');
    Game.pesterCreeps = filter.byMemory(Game.creeps, 'origin', 'pester');
    // Filtering more...
    Game.attackingGuardCreeps = filter.byHasAssignment(Game.guardCreeps, 'attack');
    log.cpu('creeps');

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
    Game.spotGuardFlags = filter.byColors(Game.flags, flagColors.spotGuard.primary, flagColors.spotGuard.secondary);
    Game.roomGuardFlags = filter.byColors(Game.flags, flagColors.roomGuard.primary, flagColors.roomGuard.secondary);
    Game.hubGuardFlags = filter.byColors(Game.flags, flagColors.hubGuard.primary, flagColors.hubGuard.secondary);
    log.cpu('flags');

    // Constructions... need to limit to hub
    Game.structures = find.structures(); // CPU spikes...
    Game.controllers = find.controllers();
    Game.spawns = find.spawns(); // Could sort busy and energy available
    Game.banks = find.banks(); // Tempted to look at flags instead of the objects, but then I can't query the bank itself? capacity etc...
    Game.towers = find.towers();
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

    log.cpu('Game', 'end');
}

module.exports = mod.public;
// Log
log('Loading: classes/world');

// Initially Hub was just the rooms and config for a hub... now each hub has all of it's creeps, flags, and structures on load...
// We're setting the hubs to Game instead of global, since Game is reset every tick, whereas global is not... global is better for functions and values that don't change
global.World = function(id) {
    log.cpu('World', 'start');

    // If we have world populated already then just return it...
    if(Game.world) {
        log.cpu('World', 'end');
        return Game.world;
    } else {
        // Temp vars
        const flagColors = config.flags.colors;
        log.cpu('init');

        // Creeps
        this.creeps = find.creeps();
        // Filtering
        this.damagedCreeps = filter.byHitsPercentage(this.creeps, 0, 99);
        this.minerCreeps = filter.byMemory(this.creeps, 'origin', 'miner');
        this.haulerCreeps = filter.byMemory(this.creeps, 'origin', 'hauler');
        this.commonerCreeps = filter.byMemory(this.creeps, 'origin', 'commoner');
        this.guardCreeps = filter.byMemory(this.creeps, 'origin', 'guard');
        this.claimerCreeps = filter.byMemory(this.creeps, 'origin', 'claimer');
        this.pesterCreeps = filter.byMemory(this.creeps, 'origin', 'pester');
        // Filtering more...
        this.attackingGuardCreeps = filter.byHasAssignment(this.guardCreeps, 'attack');
        log.cpu('creeps');

        // Flags... need to limit to hub
        this.flags = find.flags();
        // Filtering
        this.sourceFlags = filter.byColors(this.flags, flagColors.source.primary, flagColors.source.secondary);
        this.bankFlags = filter.byColors(this.flags, flagColors.bank.primary, flagColors.bank.secondary);
        this.importantFlags = filter.byColors(this.flags, flagColors.important.primary, flagColors.important.secondary);
        this.reserveFlags = filter.byColors(this.flags, flagColors.reserve.primary, flagColors.reserve.secondary);
        this.claimFlags = filter.byColors(this.flags, flagColors.claim.primary, flagColors.claim.secondary);
        this.pesterFlags = filter.byColors(this.flags, flagColors.pester.primary, flagColors.pester.secondary);
        this.eyeballFlags = filter.byColors(this.flags, flagColors.eyeball.primary, flagColors.eyeball.secondary);
        this.spotGuardFlags = filter.byColors(this.flags, flagColors.spotGuard.primary, flagColors.spotGuard.secondary);
        this.roomGuardFlags = filter.byColors(this.flags, flagColors.roomGuard.primary, flagColors.roomGuard.secondary);
        this.hubGuardFlags = filter.byColors(this.flags, flagColors.hubGuard.primary, flagColors.hubGuard.secondary);
        log.cpu('flags');

        // Constructions... need to limit to hub
        this.structures = find.structures(); // CPU spikes...
        this.controllers = find.controllers();
        this.spawns = find.spawns(); // Could sort busy and energy available
        this.banks = find.banks(); // Tempted to look at flags instead of the objects, but then I can't query the bank itself? capacity etc...
        this.towers = find.towers();
        log.cpu('others');
        this.constructionSites = find.constructionSites();
        log.cpu('constructionSites');
        this.decayingStructures = find.decayingStructures();
        log.cpu('decayingStructures');
        this.damagedStructures = find.damagedStructures();
        log.cpu('damagedStructures');
        this.toppingUpStructures = find.toppingUpStructures();
        log.cpu('toppingUpStructures');
        this.lowEnergyStructures = find.lowEnergyStructures();
        log.cpu('lowEnergyStructures');
        // Filtering
        this.lowTickControllers = _.filter(this.controllers, (controller) => (controller.ticksToDowngrade < CONTROLLER_DOWNGRADE[controller.level]*(config.controller.limit/100)));
        this.lowEnergyBanks = filter.byCapacityPercentage(this.banks, 0, 90);
        this.highEnergyBanks = filter.byCapacityPercentage(this.banks, 10, 100); // TODO - increase bottom number...

        // Misc
        this.spills = find.spills();
        this.hostiles = find.hostiles();
        this.imminentNukes = find.imminentNukes();

        // Storing in memory for later...
        Game.world = this;

        log.cpu('World', 'end');
    }
}

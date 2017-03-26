// Log
log('Loading: helpers/find');

global.find = function() {
    // Init the module
    var mod = {};
    mod.private = {};
    mod.public = {};

    // Get banks... basically anything marked with flag as a container for storage and withdrawal...
    mod.public.banks = function() {
        // Pass if we already calculated this...
        if(Game.banks === undefined) {
            if(cacher.retrieve('banks')) {
                Game.banks = cacher.retrieve('banks');
            } else {
                // Get all the flags for sources...
                var flags = mod.public.flags();
                flags = filter.byColors(flags, config.flags.colors.bank.primary, config.flags.colors.bank.secondary);
                Game.banks = [];

                // Look at the tiles and get the source tile...
                for(let flag of flags) {
                    // Get the tiles at the location
                    let tiles = flag.room.lookAt(flag);
                    // Filter tiles by type...
                    let structures = _.pluck(filter.byTypes(tiles, ['structure']), 'structure');
                    // Add the source to targets
                    Game.banks = _.union(Game.banks, structures);
                }

                // Filter out the structures so we only have stores...
                Game.banks = filter.byStructureTypes(Game.banks, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK]);

                cacher.store('banks', Game.banks);
            }
        }

        var targets = Game.banks;

        // Return the source targets
        return targets;
    }

    // Get Constructions
    mod.public.constructionSites = function() {
        var targets = _.map(Game.constructionSites, (construction) => (construction));
        return targets;
    }

    // Get controllers
    mod.public.controllers = function() {
        var targets = _.filter(mod.public.structures(), (structure) => (structure.structureType === STRUCTURE_CONTROLLER));
        
        return targets;
    }

    // Get creeps
    mod.public.creeps = function() {
        // Uses no CPU! :D
        var targets = _.map(Game.creeps, (creep) => (creep));
        return targets;
    }

    // Get damaged structures
    // CPU spikes, so we're going to use a bit of caching to help mitigate
    mod.public.damagedStructures = function() {
        if(Game.damagedStructures === undefined) {
            if(cacher.retrieve('damagedStructures')) {
                Game.damagedStructures = cacher.retrieve('damagedStructures');
            } else {
                // Get all the structures in room
                Game.damagedStructures = mod.public.structures();
                // Filter by needs repairing...
                Game.damagedStructures = filter.byNeedsRepairing(Game.damagedStructures);
                // Sorting here... wouldn't normally but it's efficient caching this way...
                Game.damagedStructures = sort.byLowestHitsPercentage(Game.damagedStructures);

                cacher.store('damagedStructures', Game.damagedStructures);
            }
        }

        var targets = Game.damagedStructures;

        return targets;
    }

    // Get decaying sites
    mod.public.decayingStructures = function() {
        if(Game.decayingStructures === undefined) {
            if(cacher.retrieve('decayingStructures')) {
                Game.decayingStructures = cacher.retrieve('decayingStructures');
            } else {
                // Get all the structures in room
                Game.decayingStructures = mod.public.structures();
                // Filter
                Game.decayingStructures = _.filter(Game.decayingStructures, (target) => (target.ticksToDecay !== undefined));

                cacher.store('decayingStructures', Game.decayingStructures);
            }
        }

        var targets = Game.decayingStructures;

        return targets;
    }

    // Get structures that need topping up...
    mod.public.toppingUpStructures = function() {
        if(Game.toppingUpStructures === undefined) {
            if(cacher.retrieve('toppingUpStructures')) {
                Game.toppingUpStructures = cacher.retrieve('toppingUpStructures');
            } else {
                // Get all the decaying structures
                Game.toppingUpStructures = mod.public.decayingStructures();
                // Filter
                Game.toppingUpStructures = filter.byNeedsRepairingTopup(Game.toppingUpStructures);

                cacher.store('toppingUpStructures', Game.toppingUpStructures);
            }
        }

        var targets = Game.toppingUpStructures;

        return targets;
    }

    // Get flags
    mod.public.flags = function() {
        var targets = _.map(Game.flags, (flag) => (flag));
        return targets;
    }

    // Get hostile creeps...
    // TODO - Limit rooms checked to rooms with guard flags, and add ones that have attacked my creeps...
    mod.public.hostiles = function() {
        if(Game.hostiles === undefined) {
            // Get all the rooms
            const rooms = mod.public.hubRooms(); // Need to look everywhere I think, since we want to watch everything for hostiles...
            // Init spills
            Game.hostiles = [];

            // Loop through and find all the hostiles in each room...
            for(let room of rooms) {
                // Add the hostiles in the room to the collection
                Game.hostiles = _.union(Game.hostiles, room.find(FIND_HOSTILE_CREEPS));
            }

            // Filter those with attack, ranged, or heal body part...
            Game.hostiles = filter.byBodyPart(Game.hostiles, ['ATTACK', 'HEAL', 'RANGED_ATTACK']);
        }

        var targets = Game.hostiles;

        return targets;
    }

    // Get all hub config objects
    mod.public.hubConfigs = function() {
        var targets = mod.public.hubIds();
        // Go through all the IDs, and return a config hub object instead
        targets = _.map(targets, (target) => (config.hubs[target]));

        return targets;
    }

    // Get hub ID by object/pos/roomName
    mod.public.hubId = function(target) {
        // Move to pos if we have to...
        if(target.pos) {
            target = target.pos;
        }

        // Move to roomName if we have to...
        if(target.roomName) {
            target = target.roomName;
        }

        // Loop through configs and try to find the roomName/target
        for(let hubId in config.hubs) {
            // Check if roomId exists in config.rooms... if so we have it...
            if(_.contains(config.hubs[hubId].rooms, target)) {
                return hubId;
            }
        }
    }

    // Get all hub IDs
    mod.public.hubIds = function() {
        var targets = Object.keys(config.hubs);
        // Making sure we have access to the rooms
        targets = filter.byGameExistence(targets, 'rooms');

        return targets;
    }

    // Return all hub room IDs
    mod.public.hubRoomIds = function() {
        var targets = mod.public.hubConfigs();
        // Pick out rooms
        targets = _.pluck(targets, 'rooms');
        // Flatten
        targets = _.flatten(targets);

        return targets;
    }
 
    // Return all hub rooms objects
    mod.public.hubRooms = function() {
        if(Game.hubRooms === undefined) {
            var targets = mod.public.hubRoomIds();
            // Pick out rooms
            Game.hubRooms = _.map(targets, (target) => (Game.rooms[target]));
            // Remove ones we don't have access to...
            Game.hubRooms = _.compact(Game.hubRooms);
        }

        var targets = Game.hubRooms;

        return targets;
    }

    // Low energy structures...
    mod.public.lowEnergyStructures = function() {
        if(Game.lowEnergyStructures === undefined) {
            if(cacher.retrieve('lowEnergyStructures')) {
                Game.lowEnergyStructures = cacher.retrieve('lowEnergyStructures');
            } else {
                Game.lowEnergyStructures = mod.public.structures();
                Game.lowEnergyStructures = _.filter(Game.lowEnergyStructures, (target) => {
                    // Filter out energy containers...
                    if(_.contains([STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK], target.structureType) || _.contains([STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART], target.structureType)) {
                        return false
                    }

                    // If they are a tower, then only pass truth test if they are below 50%...
                    if(_.contains([STRUCTURE_TOWER], target.structureType)) {
                        return (filter.byCapacityPercentage([target], 0, 50).length > 0);
                    }

                    // Otherwise fall to returning up to 99%
                    return (filter.byCapacityPercentage([target], 0, 99).length > 0);
                });

                cacher.store('lowEnergyStructures', Game.lowEnergyStructures);
            }
        }

        var targets = Game.lowEnergyStructures;

        return targets;
    }

    // Get all the nodes (sources + resources... anything mineable basically)
    mod.public.nodes = function() {
        // Kind of caching... making sure we reuse already calculated objects...
        if(Game.nodes === undefined) {
            Game.nodes = mod.public.sources(); // Will later combine with resources...
        }

        var targets = Game.nodes;

        return targets;
    }

    // Get roads
    mod.public.roads = function() {
        var targets = filter.byStructureTypes(mod.public.structures(), [STRUCTURE_ROAD]);

        return targets;
    }

    // Get spawns
    mod.public.spawns = function() {
        var targets = _.map(Game.spawns, (spawn) => (spawn));
        return targets;
    }

    // Get all resources on the floor (spills)
    mod.public.spills = function() {
        if(Game.spills === undefined) {
            // Get all the rooms
            const rooms = mod.public.hubRooms();
            // Init spills
            Game.spills = [];

            // Loop through and find all the spills in each room...
            for(let room of rooms) {
                // Add the spills in the room to the collection
                Game.spills = _.union(Game.spills, room.find(FIND_DROPPED_RESOURCES));
            }
        }

        var targets = Game.spills;

        return targets;
    }

    // Get structures... doesn't return neutral ones (walls and roads)
    mod.public.structures = function() {
        // If doesn't exist, or if it's not an array...
        if(Game.structures === undefined || !Array.isArray(Game.structures)) {
            // Add standard structures...
            Game.structures = _.map(Game.structures, (structure) => (structure));

            // Adding roads and walls... trying to use cache if we have it since we don't care about old stuff really
            if(cacher.retrieve('allAdditionalStructures')) {
                Game.structures = _.union(Game.structures, cacher.retrieve('allAdditionalStructures'));
            } else {
                const rooms = mod.public.hubRooms();
                let allAdditionalStructures = [];

                for(let room of rooms) {
                    // Filter does lower it...
                    let additionalStructures = room.find(FIND_STRUCTURES, {
                        filter: function(structure) {
                            return (structure.structureType === STRUCTURE_ROAD || structure.structureType === STRUCTURE_WALL);
                        }
                    });

                    allAdditionalStructures = _.union(allAdditionalStructures, additionalStructures);
                }

                // Store in cache and add to Game.structures...
                Game.structures = _.union(Game.structures, allAdditionalStructures);
                cacher.store('allAdditionalStructures', allAdditionalStructures);
            }
        }

        var targets = Game.structures;

        return targets;
    }

    // Get towers
    mod.public.towers = function() {
        if(Game.towers === undefined) {
            var towers = _.filter(mod.public.structures(), (structure) => {
                if(structure.structureType === STRUCTURE_TOWER) {
                    return true;
                }
                
                return false;
            });

            // Init memory if not already done...
            if(!Memory.towers) {
                Memory.towers = {};
            }

            // Assign memory for each tower
            for(let key in towers) {
                // Initialize global Memory object if necessary
                if(!Memory.towers[key]) {
                    Memory.towers[key] = {};
                }
                // If memory not set for the tower itself, then set it...
                if(!towers[key].memory) {
                    towers[key].memory = Memory.towers[key];
                }
            }

            Game.towers = towers;
        }

        var targets = Game.towers;
        
        return targets;
    }

    // Get walls (and ramparts?)... walls also belong to nobody, so this returns nothing...
    mod.public.walls = function() {
        // Filter all the room structures by type == wall
        var targets = filter.byStructureTypes(mod.public.structures(), [STRUCTURE_WALL]);

        return targets;
    }


    //FIND_DROPPED_ENERGY
    // We're getting a lot of nulls for hubRooms... this is because we don't have any creeps or structures in them... hmm...
    // Okay, slight change in plan... going to try and not work with hubRooms... whilst this is helpful, I should be able to work from the roomIds

    return mod.public;
}();
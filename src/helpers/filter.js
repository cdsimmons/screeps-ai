// Log
log('Loading: helpers/filter');

global.filter = function() {
    // Init the module
    var mod = {};
    mod.private = {};
    mod.public = {};


    /* 
    * SINGULARS
    */

    // Check if what we have actually exists in the game... eg rooms we have sight to
    mod.public.byGameExistence = function(targets, key) {
        var result = _.filter(targets, (target) => (Game[key][target] !== undefined));

        return result;
    }

    // Return targets with ID
    // Unlike get object by ID, this can work with name as ID too...
    mod.public.byId = function(targets, id) {
        var result = _.filter(targets, (target) => (target.id === id || target.name === id));

        return result;
    }


    /* 
    * PLURALS
    */

    mod.public.byAmount = function(targets, from, to) {
        var result = _.filter(targets, (target) => (target.amount >= from && target.amount <= to));

        return result;
    }

    // Filter by alive...
    mod.public.byAlive = function(targets) {
        var result = _.filter(targets, (target) => (target.my && targets.hits > 0) );

        return result;
    }

    // Filter by assignment ID...
    mod.public.byAssignmentId = function(targets, id) {
        var result = _.filter(targets, (target) => (target.memory.assignment === id));
        return result;
    }

    // Filter by assignment limit... pass in assignments, and if any have more assignees than the limit passed, then throw away
    mod.public.byAssignedLimit = function(targets, limit) {
        // We have the assignments, and we have the assignees... get the assignment ID
        var assignees = find.creeps();
        var result = _.filter(targets, (target) => {
            var id = target.id || target.name; // Assignment ID

            if(filter.byAssignmentId(assignees, id).length > limit) { // Filter creeps with assignment ID, if more than limit...
                return false; // We have more than the limit, so exclude it by returning false
            } else {
                return true;
            }
        });
        return result;
    }

    // Filter out the ones that have the passed body part
    mod.public.byBodyPart = function(targets, parts) {
        var result = _.filter(targets, (target) => { // Pass a truth test... if body part exists at all then we return target/s
            var body = _.pluck(target.body, 'type');

            if(Array.isArray(parts)) {
                for(let part of parts) {
                    // If we have any body part in passed array, then this item passes the truth test
                    if(_.contains(body, part.toLowerCase())) {
                        return true;
                    }
                }
            } else {
                return _.contains(body, parts.toLowerCase());
            }
            return false;
        });
        return result;
    }

    // Get the busy ones...
    mod.public.byBusy = function(targets) {
        var result = _.filter(targets, (target) => (target.memory.destination !== undefined));
        return result;
    }

    // By capacity percentage (ie, from 0% to 80%... or 80% to 100%)
    mod.public.byCapacityPercentage = function(targets, from, to) {
        from = from / 100;
        to = to / 100;

        var result = _.filter(targets, (target) => {
            let current = _.sum(target.store) || target.energy || 0;
            let max = target.storeCapacity || target.energyCapacity;

            // If current is greater than the passed from percentage, and current is less than the passed to percentage...
            if(current >= (max * from) && current <= (max * to)) {
                return true;
            }

            return false;
        });

        return result;
    }

    // Return flags by types... eg. source, attack, idle
    // filter.byColor(Game.flags, [config.flags.colors.source]);
    mod.public.byColors = function(targets, primary, secondary) {
        // If primary color passed...
        if(typeof primary !== undefined) {
            targets = mod.public.byPrimaryColor(targets, primary);
        }
        // If secondary color passed...
        if(typeof secondary !== undefined) {
            targets = mod.public.bySecondaryColor(targets, secondary);
        }

        return targets;
    }

    // Filter all the targets that have assignees
    mod.public.byHasAssignee = function(targets, method) {
        // Get all the game creeps so we know their current destinations
        let creeps = find.creeps();
        // If method passed, filter the creeps that have that method...
        if(method) {
            log(method);
            creeps = _.filter(creeps, (creep) => (creep.memory.method === method));
        }

        // Pluck out the assignment id of each memory
        let assigned = _.pluck(creeps, 'memory');
        assigned = _.pluck(assigned, 'assignment');
        assigned = _.pluck(assigned, 'target');
        assigned = _.pluck(assigned, 'id');
        // Get rid of null's
        assigned = _.compact(assigned);

        // Looking at targets, going through and checking if this target is among the assigned... if so reject it
        let result = _.filter(targets, (target) => (_.contains(assigned, (target.id || target.name))));

        return result;
    }

    // Filter all the targets that have an assignment
    mod.public.byHasAssignment = function(targets, method) {
        // If it has assignment (true), or method is passed and method is a match...
        targets = _.filter(targets, (target) => (target.memory.assignment !== undefined && target.memory.assignment !== null));

        // If we pass a method, then make sure target method is same as method...
        if(method) {
            targets = _.filter(targets, (target) => (target.memory.assignment.method === method));
        }

        return targets;
    }

    // Filter all the targets that have an destination
    mod.public.byHasDestination = function(targets) {
        let result = _.filter(targets, (target) => (target.memory.destination !== undefined && target.memory.destination !== null));

        return result;
    }

    // Filter all the targets that do not have assignees
    mod.public.byHasDestinee = function(targets) {
        // Get all the game creeps so we know their current destinations
        let creeps = find.creeps();
        // Pluck out the destination id of each memory
        let assigned = _.pluck(creeps, 'memory');
        assigned = _.pluck(assigned, 'destination');
        assigned = _.pluck(assigned, 'target');
        assigned = _.pluck(assigned, 'id');
        // Get rid of null's
        assigned = _.compact(assigned);

        // Looking at targets, going through and checking if this target is among the assigned... if so reject it
        let result = _.filter(targets, (target) => (_.contains(assigned, (target.id || target.name))));

        return result;
    }

    // Filter all the targets that do not have assignees
    mod.public.byNotHasAssignee = function(targets, method) {
        // Get all the game creeps so we know their current destinations
        let assigned = mod.public.byHasAssignee(targets, method);
        // Get opposite of assigned basically
        let result = mod.public.byWithout(targets, assigned);

        return result;
    }

    // Filter all the targets that do not have assignees
    mod.public.byNotHasAssignment = function(targets, method) {
        // Get all the game creeps so we know their current destinations
        let assigned = mod.public.byHasAssignment(targets, method);
        //log(_.pluck(assigned, 'name'), _.pluck(_.pluck(assigned, 'memory'), 'assignment'));
        // Get opposite of assigned basically
        let result = mod.public.byWithout(targets, assigned);

        return result;
    }

    // Filter all the targets that have an destination
    mod.public.byNotHasDestination = function(targets) {
        // Get all the game creeps so we know their current destinations
        let assigned = mod.public.byHasDestination(targets);
        // Get opposite of assigned basically
        let result = mod.public.byWithout(targets, assigned);

        return result;
    }

    // Filter all the targets that do not have assignees
    mod.public.byNotHasDestinee = function(targets) {
        // Get all the game creeps so we know their current destinations
        let assigned = mod.public.byHasDestinee(targets);
        // Get opposite of assigned basically
        let result = mod.public.byWithout(targets, assigned);

        return result;
    }

    // By hits... ie 0-100 or 100-200
    mod.public.byHits = function(targets, from, to) {
        var result = _.filter(targets, (target) => {
            let current = target.hits;
            let max = target.hitsMax;

            // If current is greater than the passed from percentage, and current is less than the passed to percentage...
            if(current >= from && current <= to) {
                return true;
            }

            return false;
        });

        return result;
    }

    // By hits percentage (ie, from 0% to 80%... or 80% to 100%)
    mod.public.byHitsPercentage = function(targets, from, to) {
        from = from / 100;
        to = to / 100;

        var result = _.filter(targets, (target) => {
            let current = target.hits;
            let max = target.hitsMax;

            // If current is greater than the passed from percentage, and current is less than the passed to percentage...
            if(current >= (max * from) && current <= (max * to)) {
                return true;
            }

            return false;
        });
        // Remove targets that have 0 hits...
        result = _.reject(result, (target) => (target.hits === 0));

        return result;
    }

    // Filter by hub... first we check if target has memory of hub, otherwise we do byRoomIds...
    mod.public.byHub = function(targets, hub) {
        let result = _.filter(targets, (target) => {
            // If hub, use that...
            if(typeof target.memory !== 'undefined' && typeof target.memory.hub !== 'undefined') {
                return target.memory.hub === hub.id;
            } else { // Otherwise we'll go ahead and just check it's current room
                return _.contains(hub.rooms, target.pos.roomName);
            }
        });

        return result;
    }

    // Get the idle ones...
    mod.public.byIdle = function(targets) {
        var result = _.filter(targets, (target) => (target.memory.destination === undefined));
        return result;
    }

    // Return all targets with the memory key
    mod.public.byMemory = function(targets, key, value) {
        var result = _.filter(targets, (target) => {
            // If we have a value passed, then filter all against that value... if not just return all those that have the memory key
            if(value !== undefined) {
                return (target.memory[key] === value);
            } else {
                return (target.memory[key] !== undefined);
            }
        });
        return result;
    }

    // Filter out those with less than 3 creeps in queue
        // If we have 3 or greater... accept filter
    // Filter to nearest 3 (sort and union 1 2 and 3 I guess?)
    // sortBy one with most energyCapacityAvailable...
    mod.public.byMostSuitableSpawn = function() {

    }

    // Filter by the ones that need repairing... quite expensive I think because there can be a lot of walls in the hub...
    mod.public.byNeedsRepairing = function(targets) {
        // CPU spikes...
        var result = _.filter(targets, (target) => {
            if(_.contains([STRUCTURE_WALL, STRUCTURE_RAMPART], target.structureType)) {
                // Basically from 0 to almost max
                if(target.hits > 1000000) {
                    log('ra',target.hits, (filter.byHits([target], 0, config.structures.walls.minHits - 1000).length > 0));
                }
                return (filter.byHits([target], 0, config.structures.walls.minHits - 1000).length > 0);
            } else {
                return (filter.byHitsPercentage([target], 0, 80).length > 0); // Could repair to 99 probably without impact
            }
        });

        return result;
    }

    // Filter by the ones that need topping up
    mod.public.byNeedsRepairingTopup = function(targets) {
        var result = _.filter(targets, (target) => {
            // If wall, query it differently...
            if(_.contains([STRUCTURE_WALL, STRUCTURE_RAMPART], target.structureType)) {
                // Anything just below max... to be handled by walls...
                return (filter.byHits([target], config.structures.walls.minHits - 1000, config.structures.walls.minHits).length > 0);
            } else {
                return (filter.byHitsPercentage([target], 80, 99).length > 0);
            }
        });

        return result;
    }

    mod.public.byPrimaryColor = function(targets, color) {
        // We filter out the colors we want and set them to the result...
        var result = _.filter(targets, (target) => (color === target.color));
        
        return result;
    }

    mod.public.byRange = function(targets, pos, range) {
        var result = _.filter(targets, (target) => (pos.inRangeTo(target, range)));

        return result;
    }

    // The usage for this would be to filter flags for example by what hub/array of room Ids, they're in...
    mod.public.byRoomIds = function(targets, roomIds) {
        var result = _.filter(targets, (target) => (_.contains(roomIds, target.pos.roomName)));
        return result;
    }

    // The usage for this would be to filter flags for example by what hub/array of room Ids, they're in...
    mod.public.bySameRoom = function(targets, roomName) {
        // Go through all of the targets and get the Room Id... then loop through
        var result = _.filter(targets, (target) => (target.pos.roomName === roomName));
        return result;
    }

    // The usage for this would be to filter flags for example by what hub/array of room Ids, they're in...
    mod.public.bySameRooms = function(targets, roomNames) {
        // Go through all of the targets and get the Room Id... then loop through
        var result = _.filter(targets, (target) => (_.contains(roomNames, target.pos.roomName)));
        return result;
    }

    // Return flags by types... eg. source, attack, idle
    // filter.byColor(Game.flags, [config.flags.colors.source]);
    mod.public.bySecondaryColor = function(targets, color) {
        // We filter out the colors we want and set them to the result...
        var result = _.filter(targets, (target) => (color === target.secondaryColor));
        
        return result;
    }

    // Filter all the structures by their type...
    mod.public.byStructureTypes = function(targets, types) {
        var result = _.filter(targets, (target) => {
            return _.contains(types, target.structureType)
        });
        
        return result;
    }

    // Filter by how many ticks left...
    mod.public.byTicksLeft = function(targets, from, to) {
        var result = _.filter(targets, (target) => (target.ticksToLive >= from && target.ticksToLive <= to));
        return result;
    }

    // Filter the targets by their type property...
    // This might be better off in about.tilesAtPos or something... or maybe investigator.tilesAtPos? hmm room.lookAt gives that though! :P
    mod.public.byTypes = function(targets, types) {
        var result = _.filter(targets, (target) => {
            return _.contains(types, target.type)
        });
        
        return result;
    }

    // Filter by which targets are not already occupied... obsolete
    mod.public.byUnoccupied = function(targets) {
        // Get all the game creeps so we know their current destinations
        let creeps = find.creeps();
        // Pluck out the destination id of each memory
        let occupied = _.pluck(creeps, 'memory');
        occupied = _.pluck(occupied, 'destination');
        occupied = _.pluck(occupied, 'id');
        occupied = _.compact(occupied);

        //log(occupied);

        // Looking at targets, going through and checking if this target is among the occupied... if so reject it
        let result = _.reject(targets, (target) => (_.contains(occupied, (target.id || target.name))));

        return result;
    }

    // Filter out the objects by id/name
    mod.public.byWithout = function(targets, withouts) {

        let result = _.filter(targets, (target) => {
            let targetId = target.id || target.name;
            let withoutsIds = _.pluck(withouts, 'id');

            if(!withoutsIds[0]) {
                withoutsIds = _.pluck(withouts, 'name');
            }

            // If target isn't part of the withouts, then we keep it...
            return !_.contains(withoutsIds, targetId);
        });

        return result;
    }

    return mod.public;
}();

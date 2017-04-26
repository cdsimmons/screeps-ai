// Required modules
var config = require('config');
var log = require('helpers/log');
// Splitting out parts to make things easier to find
var assignmentsForExternal = require('manager/manage.assignmentsForExternal');
var assignmentsForHub = require('manager/manage.assignmentsForHub');
var destinations = require('manager/manage.destinations');
var actions = require('manager/manage.actions');
var spawns = require('manager/manage.spawns');

// Log
log('Loading: manager/manage');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// Manage the world... basically everything not managed by hubs...
mod.public.all = function() {
	
	// Clean out creeps that don't exist...
	// if(!timeout.waiting('cleanupCreeps', 10)) {
        for(var i in Memory.creeps) {
            if(!Game.namedCreeps[i]) {
                delete Memory.creeps[i];
            }
        }
	// }

	// Externals... basically anything that can be outside of a hub... I don't think claiming will ever technically be outside of a hub, so I'm going to slowly split off a hub
	mod.public.assignmentsForExternal(); // combat/eyeball/pester flags... 
	// No external spawns, since we actually find nearest available spawn when filling an assignment...

	// Hubs... should loop through really
	var hubs = config.hubs;

	for(let hubId in hubs) {
		// Check if we have access to hub (it's origin room)... this should be just to phase out sim
		if(Game.namedRooms[hubId]) {
			let hub = new Hub(hubId);

			mod.public.assignmentsForHub(hub);
			mod.public.spawns(hub); // Should probably move away from the hub restriction and put it after actions...
		}
	}
	
	mod.public.destinations();
	mod.public.actions(); // All structures and creeps carry out their action or clear it...

	// Going to struggle to do a switch over for live once I have everything it has... basically creeps won't have assignments like I expect
	// External should be anything that can be outside of a hub... can guards be outside of a hub? No because this is hub defence...
}

// Importing all the kiddies
mod.public.assignmentsForExternal = assignmentsForExternal;
mod.public.assignmentsForHub = assignmentsForHub;
mod.public.destinations = destinations;
mod.public.actions = actions;
mod.public.spawns = spawns;

// When I look at combat, I should probably avoid being complicated and just create a squad against whatever hub is nearby...
// Thief is going to be part of combat, since the flags in there aren't really part of hub...

module.exports = mod.public;
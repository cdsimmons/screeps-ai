// Required modules
var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: manager/manage');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// Importing all the kiddies
mod.public.destinations = require('manager/manage.destinations');
mod.public.actions = require('manager/manage.actions');
mod.public.spawns = require('manager/manage.spawns');
mod.public.assignments = {};

// External assignments...
mod.public.assignments.external = {};
mod.public.assignments.external.eyeballFlags = require('./assignments.external/eyeballFlags.js');

// Hub assignments...
mod.public.assignments.hub = {};
mod.public.assignments.hub.sourceFlags = require('./assignments.hub/sourceFlags.js');

mod.public.assignmentsForExternal = require('manager/manage.assignmentsForExternal');
mod.public.assignmentsForHub = require('manager/manage.assignmentsForHub');

// Manage the world... basically everything not managed by hubs...
mod.public.all = function() {
	
	// Clean out creeps that don't exist...
	// We get a CPU spike sometimes, even if we just do a wait...
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

			log.cpu('Managing hub...');
			mod.public.assignments.hub.sourceFlags(hub);
			log.cpu('sourceFlags');
			mod.public.assignments.hub.sourceFlags(hub);
			log.cpu('sourceFlags');

			mod.public.spawns(hub); // Should probably move away from the hub restriction and put it after actions...
		}
	}
	
	mod.public.destinations();
	mod.public.actions(); // All structures and creeps carry out their action or clear it...

	// Going to struggle to do a switch over for live once I have everything it has... basically creeps won't have assignments like I expect
	// External should be anything that can be outside of a hub... can guards be outside of a hub? No because this is hub defence...
}

// When I look at combat, I should probably avoid being complicated and just create a squad against whatever hub is nearby...
// Thief is going to be part of combat, since the flags in there aren't really part of hub...

module.exports = mod.public;


// manage.assignments.external.eyeballFlags()
// manage.assignments.hub.sourceFlags(hub)
// 
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
mod.public.assignments.external.imminentNukes = require('./assignments.external/imminentNukes.js');

// Hub assignments...
mod.public.assignments.hub = {};
mod.public.assignments.hub.sourceFlags = require('./assignments.hub/sourceFlags.js');
mod.public.assignments.hub.lowEnergyStructures = require('./assignments.hub/lowEnergyStructures.js');
mod.public.assignments.hub.lowEnergyBanks = require('./assignments.hub/lowEnergyBanks.js');
mod.public.assignments.hub.lowTickControllers = require('./assignments.hub/lowTickControllers.js');
mod.public.assignments.hub.hostiles = require('./assignments.hub/hostiles.js');
mod.public.assignments.hub.guardSpotFlags = require('./assignments.hub/guardSpotFlags.js');
mod.public.assignments.hub.guardRoomFlags = require('./assignments.hub/guardRoomFlags.js');
mod.public.assignments.hub.guardHubFlags = require('./assignments.hub/guardHubFlags.js');
mod.public.assignments.hub.toppingUpStructures = require('./assignments.hub/toppingUpStructures.js');
mod.public.assignments.hub.damagedCreeps = require('./assignments.hub/damagedCreeps.js');
mod.public.assignments.hub.damagedStructures = require('./assignments.hub/damagedStructures.js');
mod.public.assignments.hub.constructionSites = require('./assignments.hub/constructionSites.js');
mod.public.assignments.hub.controllers = require('./assignments.hub/controllers.js');
mod.public.assignments.hub.reserveFlags = require('./assignments.hub/reserveFlags.js');
mod.public.assignments.hub.claimFlags = require('./assignments.hub/claimFlags.js');

// Manage the world... basically everything not managed by hubs...
mod.public.all = function() {
	
	// Clean out creeps that don't exist...
	// We get a CPU spike sometimes, even if we just do a wait...
	// if(!timeout.waiting('cleanupCreeps', 10)) {
	// }

	// Externals... basically anything that can be outside of a hub... I don't think claiming will ever technically be outside of a hub, so I'm going to slowly split off a hub
	mod.public.assignments.external.eyeballFlags();
	mod.public.assignments.external.imminentNukes();
	// No external spawns, since we actually find nearest available spawn when filling an assignment...

	// Hubs... should loop through really
	var hubs = config.hubs;

	for(let hubId in hubs) {
		// Check if we have access to hub (it's origin room)... this should be just to phase out sim
		if(Game.namedRooms[hubId]) {

			let hub = new Hub(hubId);

			log.cpu('Hub management', 'start');

			mod.public.assignments.hub.sourceFlags(hub);
			log.cpu('sourceFlags');
			mod.public.assignments.hub.lowEnergyStructures(hub);
			log.cpu('lowEnergyStructures');
			mod.public.assignments.hub.lowEnergyBanks(hub);
			log.cpu('lowEnergyBanks');
			mod.public.assignments.hub.lowTickControllers(hub);
			log.cpu('lowTickControllers');
			mod.public.assignments.hub.hostiles(hub);
			log.cpu('hostiles');
			mod.public.assignments.hub.guardSpotFlags(hub);
			log.cpu('guardSpotFlags');
			mod.public.assignments.hub.guardRoomFlags(hub);
			log.cpu('guardRoomFlags');
			mod.public.assignments.hub.guardHubFlags(hub);
			log.cpu('guardHubFlags');
			mod.public.assignments.hub.toppingUpStructures(hub);
			log.cpu('toppingUpStructures');
			mod.public.assignments.hub.damagedCreeps(hub);
			log.cpu('damagedCreeps');
			mod.public.assignments.hub.damagedStructures(hub);
			log.cpu('damagedStructures');
			mod.public.assignments.hub.constructionSites(hub);
			log.cpu('constructionSites');
			mod.public.assignments.hub.controllers(hub);
			log.cpu('controllers');
			mod.public.assignments.hub.reserveFlags(hub);
			log.cpu('reserveFlags');
			mod.public.assignments.hub.claimFlags(hub);
			log.cpu('claimFlags');

			log.cpu('Hub management', 'end');

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
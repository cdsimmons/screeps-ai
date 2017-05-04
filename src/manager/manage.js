// Required modules
var config = require('config');
var log = require('helpers/log');

// Log
log('Loading: manager/manage');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

// Assignments...
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

// Other components...
mod.public.destinations = require('manager/manage.destinations');
mod.public.actions = require('manager/manage.actions');
mod.public.spawns = require('manager/manage.spawns');


// Manage the world... basically everything not managed by hubs...
mod.public.all = function() {
	// If we the game is populated, then we can assign to it...
	if(!Game.state.veryLowCpu) {
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

				//hub.supplyDemand();

				log.cpu('Hub management', 'end');
			}
		}
		
		mod.public.destinations();
	}

	mod.public.actions(); // All structures and creeps carry out their action or clear it...

	mod.public.spawns(); // Should probably move away from the hub restriction and put it after actions...

	// Perhaps it should be done in the assignment...
	// Controller upgrade... if really high energy banks, then try to spawn / increase demand...
	// Low energy banks... if spills total / source flags > 1200 (basically, all spills have more than 1.2k each), then try to spawn / increase demand...
	// Low energy structures... if high energy banks, then try to spawn / increase demand...
	// Construction sites... just try to spawn / increase demand no matter what?...

	// Lets consider controller upgrade... really high energy banks would run out quick I think... if we say 95% = high, then it should be met in about 100 ticks maybe
	// Low energy banks... has no choice but to go up, unless we have things picking up enough... I think it's inevitable to spawn for this, even if we made supplyCreeps completely reset demand
	// Low energy structures... lets say these are needed for 200 ticks, then spawn, and needed for 200 ticks, then spawn, and needed for 200 ticks... point is that it loops and we end up with always having demand before we can reduce... perhaps this should reset in this case?
	// Construction sites... if high energy banks, then demand up... if really high banks, then reduce demand limit?
}

// When I look at combat, I should probably avoid being complicated and just create a squad against whatever hub is nearby...
// Thief is going to be part of combat, since the flags in there aren't really part of hub...

module.exports = mod.public;


// manage.assignments.external.eyeballFlags()
// manage.assignments.hub.sourceFlags(hub)
// 
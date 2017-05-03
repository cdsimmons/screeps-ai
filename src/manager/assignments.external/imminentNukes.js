// Required modules
var config = require('config');
var log = require('helpers/log');
var sort = require('helpers/sort');
var filter = require('helpers/filter');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function(hub) {
	// Nuke defence!
	if(Game.imminentNukes && Game.imminentNukes.length > 0) {
		// Make sure to add in tick filter again for nukes... otherwise they aren't imminent...
		let assignments = Game.imminentNukes;

		if(assignments.length > 0) {
			for(const assignment of assignments) {
				Game.notify('IMMINENT NUKE from '+assignment.launchRoomName+' landing at '+assignment.pos.roomName);

				// Get controller for room...
				let controller = Game.namedRooms[assignment.pos.roomName].controller;
				// Activate safe mode...
				controller.activateSafeMode();
			}
		}
		// If I have pos.roomName, then hub filter should actually be working, and I could activate safe mode from hub...
	}
}

module.exports = mod.public;
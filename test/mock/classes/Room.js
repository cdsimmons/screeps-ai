var config = require('config');

global.Room = function(name) {
	this.memory = Memory.rooms[name];
    this.name = name;

    this.find = function(CONST, options) {
		var targets = [];

		if(CONST === FIND_STRUCTURES) {
			targets = require('mock/objects/Room.find.FIND_STRUCTURES.json');

			for(var key in targets) {
		        _.merge(targets[key], new Structure(key));
		    }
		}

		if(CONST === FIND_CREEPS) {
			targets = require('mock/objects/Room.find.FIND_CREEPS.json');

			for(var key in targets) {
		        _.merge(targets[key], new Creep(key));
		    }
		}

		if(CONST === FIND_HOSTILE_CREEPS) {
			targets = require('mock/objects/Room.find.FIND_HOSTILE_CREEPS.json');
		}

		if(CONST === FIND_NUKES) {
			targets = require('mock/objects/Room.find.FIND_NUKES.json');
		}

		if(CONST === FIND_STRUCTURES) {
			targets = require('mock/objects/Room.find.FIND_STRUCTURES.json');
		}

		if(CONST === FIND_DROPPED_RESOURCES) {
			targets = require('mock/objects/Room.find.FIND_DROPPED_RESOURCES.json');
		}

		// Options...
		if(options) {
			if(options.filter) {
				targets = _.filter(targets, options.filter);
			}
		}

		return targets;
	}

	this.lookAt = function(target) {
		var targets = [];

		// If looking at target with color (basically a flag)...
		if(target.color) {
			var bankColors = config.flags.colors.bank;

			// If bank...
			if(target.color === bankColors.primary && target.secondaryColor === bankColors.secondary) {
				targets = require('mock/objects/Room.lookat.bank.json');
			}
		}

		return targets;
	}

	this.lookAtArea = function() {
		var targets = [];

		targets = require('mock/objects/Room.lookatarea.source.json');

		return targets;
	}
};
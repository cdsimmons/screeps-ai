// Required modules
var config = require('config');
var log = require('helpers/log');
var filter = require('helpers/filter');

// Log
log('Loading: manager/assignmentsForExternal');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.public = function() {
	log.cpu('manage.assignmentsForExternal', 'start');
}

module.exports = mod.public;
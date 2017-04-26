var webpack = require("webpack");

module.exports = {
	context: __dirname + '/src',
	entry: './main.js',
	output: {
		filename: 'main.js',
		path: __dirname + '/dist',
		libraryTarget: 'var',
		// This lets us access the bundle from outside... this means we can pass the loop to Screeps!
		// We bundle for speed, and can still use CommonJS goodness :D
    	library: 'main' 
	},
	externals: {
        lodash: '_',
        // http://screeps.wikia.com/wiki/Globals
        Game: 'Game',
        Memory: 'Memory',
        ConstructionSite: 'ConstructionSite',
		Creep: 'Creep',
		Energy: 'Energy',
		Exit: 'Exit',
		Flag: 'Flag',
		Room: 'Room',
		RoomPosition: 'RoomPosition',
		Source: 'Source',
		Spawn: 'Spawn',
		Structure: 'Structure'
    },
	//devtool: 'eval',
	// Prefer to resolve requires from base of app
	resolve: {
	    modules: [__dirname + '/src', 'node_modules'],
	    alias: {
		    log: 'helpers/log',
		    config: 'config'
	    }
	}
};
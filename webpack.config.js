var webpack = require("webpack");

module.exports = {
	output: {
		filename: 'main.js',
		libraryTarget: 'var',
		// This lets us access the bundle from outside... this means we can pass the loop to Screeps!
		// We bundle for speed, and can still use CommonJS goodness :D
    	library: 'main' 
	},
	externals: {
        // lodash: '_', // For test this needs to be external? Hmm... not sure!
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
		Structure: 'Structure',
		// Others...
		StructureTower: 'StructureTower'
    },
	// Prefer to resolve requires from base of app
	resolve: {
	    modules: [__dirname + '/src', __dirname + '/test', 'node_modules'],
	    alias: {
		    log: 'helpers/log',
		    config: 'config'
	    }
	},
	// This gets overwritten in karma to be 'test'... not ideal, but having a lot of trouble with env variable for webpack
	plugins: [
	    new webpack.DefinePlugin({
	        'process.env': {
	            NODE_ENV: JSON.stringify('production')
	        }
	    })
	]
};
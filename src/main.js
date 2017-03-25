// Giving all the hubs their default config values...
for(const key in config.hubs) {
    if(key !== 'defaults') {
        _.defaults(config.hubs[key], config.hubs.defaults);
    }
}

// Now remove the defaults, as we no longer need them...
delete config.hubs.defaults;

// Logging
log('State: main - Initialized');

// The looop
var loop = function () {
    // Cpu before
    log.cpu('///////////// start', 'start');

    // Manage everything...
    manage.all();
    
    // CPU after all that...
    log.cpu('///////////// end', 'end');

    if(Game.cpu.bucket !== undefined && Game.cpu.bucket < 1000) {
        Game.notify('Low on CPU in bucket!');
        log('Low cpu... '+Game.cpu.bucket);
    }
}

module.exports.loop = loop;
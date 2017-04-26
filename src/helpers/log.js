// Since we're not using anything fancy to combine our scripts just concat'ing them, we have to use _ to prioritize this script
//global.log = function() {
var config = require('config');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.private.indent = 0;
mod.private.previousCpu = 0;
mod.private.deepCpuLog = true;

// Attach public functions
mod.public = function(...things) {
    things.forEach(function (thing) {
        if(typeof thing === 'string') {
            var start = '';
            var end = '</div>';
            var altered = false;
            var color = config.log.colors.default;
            
            // Allow disabling of certain strings
            
            // Can change how the whole log displays...
            if(!altered) {
                start += '<div style="display: inline-block; color: '+color+';"><div style="display: inline-block; width: 90px;">Default: </div>';
            }
            
            console.log(start+thing+end);
        } else {
            console.log(JSON.stringify(thing));
        }
    });
}

mod.public.getCpu = function() {
    return Game.cpu.getUsed().toFixed(2);
}

mod.public.cpu = function(label, position) {
    if(!position && !mod.private.deepCpuLog) {
        return;
    }

    var cpu = mod.public.getCpu();
    var color = config.log.colors.cpu;
    
    if(position === 'end') {
        mod.private.indent--;
    }

    if((cpu - mod.private.previousCpu) > 1) {
        //color = config.log.colors.warning;
    }

    console.log('<div style="display: inline-block; color: '+color+'"><div style="display: inline-block; width: 90px; padding-right: '+(mod.private.indent*20)+'px; box-sizing: content-box;">CPU: </div>'+label+' - '+cpu+'</div>');
    
    if(position === 'start') {
        mod.private.indent++;
    }

    mod.private.previousCpu = cpu;
}

mod.public.reset = function() {
    mod.private.indent = 0;
    mod.private.previousCpu = 0;
}

module.exports = mod.public;
//}();
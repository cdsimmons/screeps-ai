// Since we're not using anything fancy to combine our scripts just concat'ing them, we have to use _ to prioritize this script
//global.log = function() {
var config = require('config');

// Init the module
var mod = {};
mod.private = {};
mod.public = {};

mod.private.indent = 0;
mod.private.previousCpu = 0;
mod.private.logging = true;
mod.private.deepCpuLog = true;

// Should be private? But want to test... hummm
mod.private.buildLog = function(thing) {
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
        
        return start+thing+end;
    } else {
        return JSON.stringify(thing);
    }
}

mod.private.buildCpu = function(label) {
    var cpu = mod.public.getCpu();
    var color = config.log.colors.cpu;

    if((cpu - mod.private.previousCpu) > 1) {
        //color = config.log.colors.warning;
    }

    mod.private.previousCpu = cpu;

    return '<div style="display: inline-block; color: '+color+'"><div style="display: inline-block; width: 90px; padding-right: '+(mod.private.indent*20)+'px; box-sizing: content-box;">CPU: </div>'+label+' - '+cpu+'</div>';
}


// Attach public functions
mod.public = function(...things) {
    var test = process.env.NODE_ENV; // This becomes test when running gulp?
    if(process.env.NODE_ENV === 'production') {
        things.forEach(function (thing) {
            console.log(mod.private.buildLog(thing));
        });
    }
}

mod.public.getCpu = function() {
    return Game.cpu.getUsed().toFixed(2);
}

mod.public.cpu = function(label, position) {
    if(!position && !mod.private.deepCpuLog) {
        return;
    }
    
    if(position === 'end') {
        mod.private.indent--;
    }

    if(process.env.NODE_ENV === 'production') {
        console.log(mod.private.buildCpu(label));
    }
    
    if(position === 'start') {
        mod.private.indent++;
    }
}

mod.public.reset = function() {
    mod.private.indent = 0;
    mod.private.previousCpu = 0;
}

// Add private methods to the public object... for testing purposes
mod.public.private = mod.private;

module.exports = mod.public;
//}();
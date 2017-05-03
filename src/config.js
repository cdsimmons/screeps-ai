// Standard init
var mod = {};
mod.private = {};
mod.public = {};

mod.private.defaults = {
    hubs: {
        rooms: [],
        creeps: {
            commoner: {
                count: 2
            },
            hauler: {
                count: 2
            }
        },
        assignments: {
            damagedStructures: {
                limit: 1
            }
        },
        structures: {
        },
        spawn: {
            queueCapacity: 20,
            energyLimit: 2000
        },
        banks: {
            surplus: 50 // Hm... kind of useful, but might not be? energy should always be used I think
        }
    }
}

mod.public = {
    hubs: {
        sim: {
            rooms: ['sim']
        },
        E53N47: {
            rooms: ['E53N47', 'E52N47', 'E52N48'],
            creeps: {
                commoner: {
                    count: 1
                },
                hauler: {
                    count: 2
                }
            }
        },
        E53N45: {
            rooms: ['E53N45', 'E53N44'],
            creeps: {
                commoner: {
                    count: 1
                },
                hauler: {
                    count: 3
                }
            }
        }
    },
    structures: {
        walls: {
            minHits: 500000
        }
    },
    logging: {
        enabled: true,
        require: {
            enabled: true
        }
    },
    flags: {
        colors: {
            source: {
                primary: COLOR_YELLOW, // Bright energy
                secondary: COLOR_YELLOW
            },
            bank: {
                primary: COLOR_ORANGE, // Golden riches
                secondary: COLOR_ORANGE
            },
            important: {
                primary: COLOR_PURPLE, // Royal purple
                secondary: COLOR_PURPLE
            },
            reserve: {
                primary: COLOR_GREEN, // Greener pastures
                secondary: COLOR_GREEN
            },
            claim: {
                primary: COLOR_GREEN, // A brighter future
                secondary: COLOR_YELLOW
            },
            pester: {
                primary: COLOR_RED, // Healthy combat
                secondary: COLOR_GREEN
            },
            eyeball: {
                primary: COLOR_RED, // Eyes of red
                secondary: COLOR_WHITE
            },
            guardSpot: {
                primary: COLOR_BROWN, // Boring brown
                secondary: COLOR_BROWN
            },
            guardRoom: {
                primary: COLOR_BROWN, // Energetic brown
                secondary: COLOR_ORANGE
            },
            guardHub: {
                primary: COLOR_BROWN, // Super energetic brown
                secondary: COLOR_YELLOW
            }
        }
    },
    paths: {
        ageLimit: 10
    },
    actions: {
        increasers: ['withdraw', 'harvest', 'pickup'],
        decreasers: ['transfer', 'repair', 'build', 'upgradeController'],
        work: ['repair', 'build', 'upgradeController', 'reserveController', 'harvest'], //, 'moveTo', 'guard'
        ranged: ['build', 'rangedAttack', 'rangedMassAttack', 'rangedHeal', 'repair', 'upgradeController']
    },
    controller: {
        limit: 50 // Percentage of how low we'll let the ticks get before upgrading...
    },
    log: {
        colors: {
            default: '#ffffff',
            cpu: '#5d80b2',
            warning: 'red'
        }
    },
    cpu: {
        surplus: 4000 // How much CPU to keep in bucket before we try to really slim down our actions... can then use this up in times of war
    }
};

// Giving all the hubs their default config values...
for(var key in mod.public.hubs) {
    _.defaults(mod.public.hubs[key], mod.private.defaults.hubs);
}

module.exports = mod.public;
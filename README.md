# Screeps AI

Screeps is a game in which you utilise an [API](http://docs.screeps.com/api/) to control virtual robots to mine, move, defend, and expand your base.

I play the game with a very low CPU limit (10) meaning I have to constantly optimize my code. Because of this, I've taken out the use of CommonJS and instead gone with concatenating everything into one file, sacrificing cleaner code and better unit testing for a slight improvement in performance.

Since I am concatenating everything, pretty much everything is in the global scope, much like JavaScript modules for the browser. Screeps caches everything and then calls the loop which is within src/main.js.

My AI is assignment centered, instead of assignee centered. It looks at everything that exists... source flags, hostiles, starving structures... and it finds something to complete that assignment (src/manager/manage_assignmentsForHub.js). If nothing exists to complete the assignment, then it will usually create something to complete it. Some assignments require multiple steps (such as picking up energy before repairing), which means that a creep will have a destination along with it's assignment (src/manager/manage_destinations.js). It will try to complete it's destination action, and if the destination is the assignment (we've reached the end of the chain), it will clear it to be free for another assignment (src/manager/manage_actions.js).

Currently I am supporting 12 creeps and 2 rooms (+2 reserved) with the 10 CPU limit.

If anybody tries to use this code you'll need to update the config to suit your environment and make use of flags in-game (detailed in the config).

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)

### Developing

1. Run `npm install` to install dependencies.

## Build & development

Run `grunt watch` for building. Launch the game on desktop (not browser) to deploy code and see it running.

## Testing

Running `npm test` will run the unit tests with mocha.

## Future plans

I really want to move to using CommonJS so I can move forward with the unit testing with a clear conscience. Either that or at least stop global population and move the global methods into the Game object.

Whilst I do enjoy the challenge of optimizing my code, I will probably remove the 10 CPU limit and instead utilise the upper limit of 70, making CommonJS usage insignificant (I think it just accounts for 0.2 CPU). Running 2 rooms on 10 CPU, means I could run 14 rooms on 70... sadly I'm also limited to 5 rooms, so I'd end up having about 40 CPU spare each tick.

After I've figured this out, I'll be able to work on the AI itself by fixing a few issues and improving it's capabilities.
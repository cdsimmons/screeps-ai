# Screeps AI

[Screeps](http://screeps.com/) is a game in which you utilise an [API](http://docs.screeps.com/api/) to control virtual robots to mine, move, defend, and expand your base.

I play the game with a very low CPU limit (10) meaning I have to constantly optimize my code. Because of this, I've gone with bundling everything using webpack instead of letting the game work with require.

My AI is assignment centered, instead of assignee centered. It looks at everything that exists... source flags, hostiles, starving structures... and it finds something to complete that assignment (src/manager/manage_assignmentsForHub.js). If nothing exists to complete the assignment, then it will usually create something to complete it. Some assignments require multiple steps (such as picking up energy before repairing), which means that a creep will have a destination along with it's assignment (src/manager/manage_destinations.js). It will try to complete it's destination action, and if the destination is the assignment (we've reached the end of the chain), it will clear it to be free for another assignment (src/manager/manage_actions.js).

Currently I am supporting about 10 creeps in 2 rooms (+2 reserved) with the 10 CPU limit.

If anybody tries to use this code you'll need to update the config to suit your environment and make use of flags in-game (detailed in the config). You'll also need to update the game var inside gulpfile.js to point to your game code location.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)

### Developing

Run `npm install` to install dependencies.

## File structure

TODO

## Build & development

Run `npm start` for building. Launch the game on desktop (not browser) to deploy code and see it running.

## Testing

Running `npm test` will run the unit tests with mocha.

## Future plans

Include manager in test coverage. Resolve a few minor existing issues. Expand creep assignments. Improve hub spawning. Provide a load balancer to meet assignment demand over time.

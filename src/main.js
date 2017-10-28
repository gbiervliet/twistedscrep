var creepHandler = require('CreepHandler');
var CreepRoles = require('CreepRoles');
require('RoomPrototype')();

module.exports.loop = function() {
    // executed every tick
    for(let c in Game.creeps) {
        let creep = [c];
        creepHandler.handleCreepAction(creep);

    }

    let harvesters = _.filter(Game.creeps, {memory: {role:CreepRoles.HARVESTER()}});
    let harvesterCount = _.size(harvesters);

    if(harvesterCount < 6) {
        creepHandler.createCreep();
    }

    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};
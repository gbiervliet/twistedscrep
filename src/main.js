var creepHandler = require('CreepHandler');

module.exports.loop = function() {
    // executed every tick
    for(var c in Game.creeps) {
        var creep = Game.creeps[c];
        creepHandler.handleCreepAction(creep);

    }
    creepHandler.createCreep();
};
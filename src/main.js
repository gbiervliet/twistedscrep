var creepHandler = require('CreepHandler');
var CreepRoles = require('CreepRoles');

module.exports.loop = function() {
    // executed every tick
    for(var c in Game.creeps) {
        var creep = Game.creeps[c];
        creepHandler.handleCreepAction(creep);

    }

    var harvesters = _.filter(Game.creeps, {memory: {role:CreepRoles.HARVESTER()}});
    var harvesterCount = _.size(harvesters);

    if(harvesterCount < 6) {
        creepHandler.createCreep();
    }
    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};
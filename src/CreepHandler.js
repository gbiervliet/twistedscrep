var spawn = Game.spawns['Base'];



let HarvestCreep = require('HarvestCreep');
let UpgradeCreep = require('UpgradeCreep');
let CreepRoles = require('CreepRoles');

var CreepHandler = {

    createCreep() {
        var harvesters = _.filter(Game.creeps, {memory: {role:CreepRoles.HARVESTER}});
        var harvesterCount = _.size(harvesters);

        console.log(harvesterCount);

        if(harvesterCount < 6) {
            var uniqueId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
            spawn.spawnCreep([CARRY,WORK,MOVE], uniqueId, {
                memory: {
                    role: CreepRoles.HARVESTER
                }
            });
        }
    },

    handleCreepAction(creepVal) {
        var creep = creepVal;
        const creepRole = creep.memory.role;

        if(creepRole === CreepRoles.HARVESTER || creepRole == 'harvester') {
            HarvestCreep.run(creep, spawn);
        } else if(creepRole === CreepRoles.UPGRADER || creepRole == 'upgrader') {
            UpgradeCreep.run(creep, spawn);
        } else {
            creep.memory.role = CreepRoles.HARVESTER;
        }
    }
};

module.exports = CreepHandler;
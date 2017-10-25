var spawn = Game.spawns['Base'];

const HARVESTER = 'harvester';

let HarvestCreep = require('HarvestCreep');
let UpgradeCreep = require('UpgradeCreep');

var CreepHandler = {

    createCreep() {
        var harvesters = _.filter(Game.creeps, {memory: {role:HARVESTER}});
        var harvesterCount = _.size(harvesters);

        console.log(harvesterCount);

        if(harvesterCount < 6) {
            var uniqueId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
            spawn.spawnCreep([CARRY,WORK,MOVE], uniqueId, {
                memory: {
                    role: HARVESTER
                }
            });
        }
    },

    handleCreepAction(creepVal) {
        var creep = creepVal;
        const creepRole = creep.memory.role;

        if(creepRole == HARVESTER) {
            HarvestCreep.run(creep, spawn);
        } else if(creepRole == 'upgrader') {
            UpgradeCreep.run(creep, spawn);
        }
    }
};

module.exports = CreepHandler;
var spawn = Game.spawns['Base'];


let HarvestCreep = require('HarvestCreep');
let UpgradeCreep = require('UpgradeCreep');
let BuilderCreep = require('BuilderCreep');
let CreepRoles = require('CreepRoles');

var CreepHandler = {

    createCreep() {

        let uniqueId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
        spawn.spawnCreep([CARRY, WORK, MOVE], uniqueId, {
            memory: {
                role: CreepRoles.HARVESTER(),
                harvestLocation: getLocation();
            }
        });
    },

    handleCreepAction(creepVal) {
        let creep = creepVal;
        const creepRole = creep.memory.role;

        switch(creepRole){
            case CreepRoles.HARVESTER():
                HarvestCreep.run(creep, spawn);
                break;
            case CreepRoles.UPGRADER():
                UpgradeCreep.run(creep,spawn);
                break;
            case CreepRoles.BUILDER():
                BuilderCreep.run(creep);
                break;
        }
    }
};

getLocation = function() {
    if(Game.creeps.length %2 == 0) {
        return Game.resources[0];
    } else {
        return Game.resources[1];
    }
}

module.exports = CreepHandler;
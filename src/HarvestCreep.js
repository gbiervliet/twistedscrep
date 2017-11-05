var CreepRoles = require('CreepRoles');

module.exports = {
    run: function (creep, spawn) {

        let target = Game.getObjectById(creep.memory.harvestLocation);


        const total = _.sum(creep.carry);
        let droppingPoint = creep.transfer(getEmptyDroppingPoint(spawn);
        if (droppingPoint === null) {
            if (Object.keys(Game.constructionSites).length > 0 && creep.memory.harvestLocation == spawn.room.sources[1]) {
                creep.memory.role = CreepRoles.BUILDER();
            } else {
                creep.memory.role = CreepRoles.UPGRADER();
            }
            return;

        }
        
        let result = creep.transfer(droppingPoint, RESOURCE_ENERGY);

        if (total >= 22 && result === ERR_NOT_IN_RANGE) {
            creep.moveTo(droppingPoint);
        } else if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

var getEmptyDroppingPoint = function (spawn) {

    if (spawn.energy < spawn.energyCapacity) {
        return spawn;
    }

    let structures = Game.structures;
    for (let struct in structures) {
        if (struct.energy < struct.energyCapacity) {
            return struct;
        }
    }
    return null;
}


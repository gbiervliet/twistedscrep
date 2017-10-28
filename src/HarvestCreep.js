
var CreepRoles = require('CreepRoles');

module.exports = {
    run: function(creep, spawn) {

        const target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        const total = _.sum(creep.carry);
        var result =  creep.transfer(spawn, RESOURCE_ENERGY);

        if(result === ERR_FULL) {
            if(Object.keys(Game.constructionSites).length >0) {
                creep.memory.role = CreepRoles.BUILDER();
            } else {
                creep.memory.role = CreepRoles.UPGRADER();
            }
            return;
        }
        if(total >= 22 && result === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        } else if(target) {
            if(creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};
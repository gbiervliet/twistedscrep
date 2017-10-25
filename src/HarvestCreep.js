module.exports = {
    run: function(creep, spawn) {

        const target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        const total = _.sum(creep.carry);
        var result =  creep.transfer(spawn, RESOURCE_ENERGY);

        if(result == ERR_FULL) {
            creep.memory.role = 'upgrader';
            return;
        }
        if(total >= 22 && result == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        } else if(target) {
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};
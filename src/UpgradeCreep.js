module.exports = {
    run: function(creep, spawn) {

        const target = creep.room.controller;
        const total = _.sum(creep.carry);
        var result =  creep.upgradeController(target);

        if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (total == 0){
            creep.memory.role = 'harvester';
        }
    }
};
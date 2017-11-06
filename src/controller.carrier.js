var harvesterController = {

	run: function(creep) { 
        if (creep.carry.energy == 0) {
            creep.memory.gathering = true;
            creep.memory.upgrading = false;
        }
        if (creep.carry.energy == creep.carryCapacity) creep.memory.gathering = false;

        if(!creep.memory.upgrading && creep.memory.gathering == true && this.gather(creep)) return;

        // Emergency upgrade (close to downgrade)
        if (this.emergencyUpgradeController(creep)) {
            creep.memory.upgrading = true;
        }

        // Supply our towers
        if (!creep.memory.upgrading && this.supplyTowers(creep)) return;

        // Upgrade RoomController
        creep.memory.upgrading = true;
        if (this.upgradeController(creep)) return;

        creep.say(creep.memory.role.substring(0,5) + " 👎");
	},

    gather: function(creep) {
        // Gather energy from extensions and storage
        var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > 0
        });
        
        if(storage) {
            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ff0000'}});
            }

            return true; 
        }

        var extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy > 25
        });
        
        if(extension) {
            if(creep.withdraw(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(extension, {visualizePathStyle: {stroke: '#ff0000'}});
            }

            return true; 
        }

        return false;
    },

	supplyTowers: function(creep) {
        var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
            }
        });

        if (towers.length > 0) {
            if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
            
            return true;
        }

        return false;
	},

    emergencyUpgradeController: function(creep) {
        if (creep.room.controller.ticksToDowngrade < 5000) return this.upgradeController(creep);
        return false;
    },

    upgradeController: function(creep) { 
        var status = creep.upgradeController(creep.room.controller);
        if(status == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            return true;
        } else if (status == OK) {
            return true;
        }

        creep.say(status);
        return false;
    }
};

module.exports = harvesterController;
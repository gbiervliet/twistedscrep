// Role: Carry energy from nearest filled container/link/storage to extensions
// Number: 1
var bankerController = {

	run: function(creep) { 
        if (creep.carry.energy == 0) creep.memory.gathering = true;
        if (creep.carry.energy == creep.carryCapacity) creep.memory.gathering = false;

        if(creep.memory.gathering == true && this.gatherDroppedEnergy(creep)) return;
        this.gather(creep, true); // Only if next to container/storage
        if(creep.memory.gathering == true && this.gather(creep, false)) return;

        // Dump at extension
        if (this.dump(creep, true)) return;
        if (this.dump(creep, false)) return;
	},

    gatherDroppedEnergy: function(creep) {        
        // Gather dropped energy as highest prio
        var dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (nrg) => {
                if (nrg.resourceType != RESOURCE_ENERGY) return false
                return (nrg.amount > creep.pos.getRangeTo(nrg) * 1.25);
            }
        });

        if(dropped.length > 0) {
            console.log("Banker is gathering dropped energy: " + dropped[0].amount + ' in ' + creep.pos.getRangeTo(dropped[0]) + ' steps');
            if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped[0], {visualizePathStyle: {stroke: '#FFF000'}});
            }
            return true; 
        }

        return false;
    },

    gather: function(creep, onlyIfClose) {
        // Gather energy from containers and storage (TODO: links)
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                    if (structure.structureType == STRUCTURE_STORAGE) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                    if (structure.structureType == STRUCTURE_LINK) {
                        return structure.energy > 0
                    }
                }
        });
        
        if(target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (creep.carry.energy > 0) return false;
                if (onlyIfClose == true) return false;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#fff000'}});
            }
            return true;
        }

        return false;
    },

    dump: function(creep, emptyOrCloseOnly) {
        // When full, dump to storage
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                if (structure.structureType != STRUCTURE_EXTENSION) return false;
                if (structure.energy == structure.energyCapacity) return false;
                if (emptyOrCloseOnly) 
                    return structure.energy == 0 || creep.pos.getRangeTo(structure) == 1;
                else 
                    return structure.energy < structure.energyCapacity
            }
        });

        if(target) {            
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#fff000'}});
            }
            return true;
        }
        
        return false;
    },
};

module.exports = bankerController;
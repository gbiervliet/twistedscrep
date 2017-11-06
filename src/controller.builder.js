// Role:  Repair untill nothing to repair, then build until nothing to build, then become carrier
// Number: Automatic after all buildings are repaired
var builderController = {
    wallsHitsPercentage: .003,
    rampartHitsPercentage: .15,

	run: function(creep) { 
		// When no energy, gather
		if(creep.carry.energy == 0 && this.gather(creep)) return;

        // Repair
        if (this.repair(creep, false)) return;

        // Build
        if (this.build(creep)) return;

        // Repair walls
        if (this.repair(creep, true)) return;

        // Carry when nothing to repair/build
        creep.memory.role = 'carrier';
	},

    gather: function(creep) {
        // Gather energy from extensions and storage
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                    if (structure.structureType == STRUCTURE_STORAGE) {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                }
        });
        
        if(target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            return true;
        }

        return false;
    },

	repair: function(creep, walls) {
        // Only repair walls at this time
        var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                if (walls == true && structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax * this.wallsHitsPercentage)
                    return true;
                if (walls == true && structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax * this.rampartHitsPercentage)
                    return true;
                if (structure.my && structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART) 
                    return true;
                return false;
            }
        });

        if (structure) {
            if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            return true;
        }   

        return false;
	},

    build: function(creep) { 
        var structure = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (structure) {
            if(creep.build(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: '#99ff00'}});
            }
            return true;
        }

        return false;
    }
};

module.exports = builderController;
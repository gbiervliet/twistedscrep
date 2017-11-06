var harvesterController = {

	run: function(creep) { 

        if (!creep.memory.sourceId) {
            this.findSource(creep);
        }

        if (creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }

		if(creep.carry.energy < creep.carryCapacity && creep.memory.harvesting == true) {
			this.harvest(creep);
        }

        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        // Dump at extensions/spawn in range
        if (creep.memory.harvesting == false && this.dumpToExtensionInRange(creep)) return;

        // Dump at extensions/spawn in range
        if (creep.memory.harvesting == false && this.dumpToStorageInRange(creep)) return;

        // Dump at extensions/spawn
        if (creep.memory.harvesting == false && this.dump(creep)) return;

        // Dump in container/storage
        if (creep.memory.harvesting == false && this.dumpInStorage(creep)) return;

        creep.memory.harvesting = true;
	},

    findSource: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var mostEfficientSource = null;
        var mostEfficientSourceHarvesters = 0;
        for (var i in sources) {
            if (mostEfficientSource == null) {
                mostEfficientSourceHarvesters = this.amountOfSourceHarvesters(sources[i]);
                mostEfficientSource = sources[i];
                continue;
            } else

            var harvesters = this.amountOfSourceHarvesters(sources[i]);
            if (mostEfficientSourceHarvesters > harvesters) {
                mostEfficientSourceHarvesters = harvesters;
                mostEfficientSource = sources[i];
                continue;
            }
        }

        creep.memory.sourceId = mostEfficientSource.id;
    },

    amountOfSourceHarvesters: function(source) {
        return _.filter(Game.creeps, (creep)=>creep.memory.sourceId == source.id).length;
    },

	harvest: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceId);
        if (source) {
            if(creep.harvest(source) != OK) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }      
            return true;
        }
	},

    dumpToExtensionInRange: function(creep) { 
        // When full, dump to storage
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity
        });
        
        return target && creep.transfer(target, RESOURCE_ENERGY) == OK;
    },
    
    dumpToStorageInRange: function(creep) {
        // When full, dump to storage
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        });
        
        return target && creep.transfer(target, RESOURCE_ENERGY) == OK;
    },

    dump: function(creep) {
        // When full, dump to storage
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        
        if(target) {            
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        
        return false;
    },

    dumpInStorage: function(creep) { 
        // When full, dump to storage
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                }
        });
        
        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }

        return false;
    }
};

module.exports = harvesterController;
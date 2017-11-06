var roleSpawn = {

    builderCarrierCost: 600,
    builderCarrierBody: [
        WORK,MOVE,
        WORK,MOVE,
        WORK,MOVE,
        CARRY,CARRY,MOVE],

    sourceConfig: [
        {
            id: 0,
            sourceId: '59bbc3952052a716c3ce6629',
            bodyCost: 400,
            body: [WORK,WORK,WORK,CARRY,MOVE],
            harvesters: 2
        }, {
            id: 1,
            sourceId: '59bbc3952052a716c3ce662a',
            bodyCost: 400,
            body: [WORK,WORK,WORK,CARRY,MOVE],
            harvesters: 2 
        }
    ],
    
    // Role: Continually harvest and carry to storage
    // Number: Fixed number per source
    harvesters: 0, 

    // Role:  Repair untill nothing to repair, then build until nothing to build, then become carrier
    // Number: Min. 1, Max number of building sites
    builders: 0,

    // Role: Carry energy to tower, when full on energy: upgrade.
    // Number: Automatic after all buildings are repaired and build and a minimum of 1.
    carriers: 0,

    // Role: Carry energy from nearest filled container/link/storage to extensions
    // Number: 1
    bankers: 0,

    LogCurrentStats: function(spawn) {
        this.harvesters = _.filter(Game.creeps, (creep)=>creep.memory.role=='harvester').length;
        this.builders = _.filter(Game.creeps, (creep)=>creep.memory.role=='builder').length;
        this.carriers = _.filter(Game.creeps, (creep)=>creep.memory.role=='carrier').length;
        this.bankers = _.filter(Game.creeps, (creep)=>creep.memory.role=='banker' && creep.ticksToLive > 100).length;
        this.buildLocations = spawn.room.find(FIND_CONSTRUCTION_SITES).length;
        console.log(
            'Energy: ' + spawn.room.energyAvailable + "\t" +
            'Creeps: ' + Object.keys(Memory.creeps).length + "\t" +
            'Harvesters: ' + this.harvesters + "\t" +
            'Builders: ' + this.builders + "/" + this.buildLocations + "\t" +
            'Carriers: ' + this.carriers + "\t" + 
            'Bankers: ' + this.bankers + "\t"
        );
        var sources = spawn.room.find(FIND_SOURCES);
        for(var i in sources) { 
            var harvesters = _.filter(Game.creeps, (creep)=>creep.memory.role=='harvester' && creep.memory.sourceId == sources[i].id).length;
            console.log("Source "+sources[i].id+" has " + harvesters + " harvesters");
        }

        var upgradingCarriers = _.filter(Game.creeps, (creep)=>creep.memory.role=='carrier' && creep.memory.upgrading == true).length;
        var ticksToGo =( spawn.room.controller.progressTotal - spawn.room.controller.progress)  / upgradingCarriers / 3;
        console.log(
            'Downgrade in ' + spawn.room.controller.ticksToDowngrade + ' ticks. '
            + '(' + spawn.room.controller.progress + '/' + spawn.room.controller.progressTotal + ', '
            + 'takes ' + Math.round(ticksToGo) + ' ticks, ' + Math.round(ticksToGo / 20) + ' minutes ex. travel time.)'
            );
        console.log('-'.repeat(90));
    },

    /** @param {Spawn} spawn **/
    run: function(spawn) {
        this.LogCurrentStats(spawn);
        if (spawn.spawning) return; 
        if (this.emergencySpawn(spawn)) return;
        
        if (spawn.room.energyAvailable >= 450) {            
            if (this.bankers < 2) {
                console.log('Creating a banker');
                spawn.spawnCreep([
                        CARRY,CARRY,MOVE,
                        CARRY,CARRY,MOVE,
                        CARRY,CARRY,MOVE
                        ], 'Banker ' + Game.time, 
                    { memory: { role: 'banker' }});   
                return;
            }
        }

        for (var i in this.sourceConfig) {
            if (this.harvestersAtSource(this.sourceConfig[i].sourceId) < this.sourceConfig[i].harvesters) {
                if (spawn.room.energyAvailable >= this.sourceConfig[i].bodyCost && this.harvestersAtSource(this.sourceConfig[i].sourceId) < this.sourceConfig[i].harvesters) {
                    status = spawn.spawnCreep(this.sourceConfig[i].body, 'Harvester' + Game.time, { memory: { role: 'harvester', sourceId: this.sourceConfig[i].sourceId }});
                    console.log('Creating a harvester for source: ' + this.sourceConfig[i].sourceId);
                    return;
                }
            }
        }

        var atMax = Object.keys(Memory.creeps).length >= 16;
        var allExtensionsFull = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.energy == 0
        }).length == 0;
        
        if (spawn.room.energyAvailable >= this.builderCarrierCost && (!atMax || allExtensionsFull)) {
            if (this.builders < this.buildLocations || this.builders == 0) {
                console.log('Creating a builder');
                spawn.spawnCreep(this.builderCarrierBody, 'Builder ' + Game.time, 
                    { memory: { role: 'builder' }});   
                return;
            }

            console.log('Creating a carrier');
            spawn.spawnCreep(this.builderCarrierBody, 'Carrier ' + Game.time, 
                { memory: { role: 'carrier' }});   
            return;
        } 
        
    },

    harvestersAtSource: function(sourceId) {
        return _.filter(Game.creeps, (creep)=>creep.memory.role == 'harvester'&& creep.memory.sourceId == sourceId && creep.ticksToLive > 50).length;
    },

    emergencySpawn: function(spawn) {        
        // Emergency harvester
        if (this.harvesters <= 2) {
            console.log('Creating an emergency harvester');
            spawn.spawnCreep([WORK,WORK,CARRY,MOVE], 'Harvester ' + Game.time, 
                { memory: { role: 'harvester'}}); 
            return true;
        }

        // Emergency banker  
        if (this.bankers < 1) {
            console.log('Creating an emergency banker');
            spawn.spawnCreep([
                CARRY,CARRY,MOVE,
                CARRY,CARRY,MOVE
            ], 'Banker ' + Game.time, { memory: { role: 'banker' }});   
            return true;
        }

        // Emergency carrier      
        if (this.carriers < 1) {
            console.log('Creating an emergency carrier');
            spawn.spawnCreep([WORK,CARRY,MOVE], 'Carrier ' + Game.time, 
                { memory: { role: 'carrier' }});   
            return true;
        }

        return false;
    }
};

module.exports = roleSpawn;
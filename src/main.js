var roleTower = require('role.tower');
var roleSpawn = require('role.spawn');

var harvestController = require('controller.harvester');
var builderController = require('controller.builder');
var carrierController = require('controller.carrier');
var bankerController = require('controller.banker');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.room.name != 'W59N56') {
            creep.say("So lost...");
            for(var name in Game.spawns) {
                creep.moveTo(Game.spawns[name]);
                break;
            }
        } else {   

            switch(creep.memory.role) {
                case 'harvester': 
                    harvestController.run(creep);
                    break;

                case 'builder': 
                    builderController.run(creep);
                    break;
                    
                case 'carrier': 
                    CheckForRoad(creep);
                    carrierController.run(creep);
                    break;
                    
                case 'banker': 
                    CheckForRoad(creep);
                    bankerController.run(creep);
                    break;
            }
        }
    }
    
    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        var structures = spawn.room.find(FIND_STRUCTURES);
        for(var i in structures) {
            if (structures[i].structureType == STRUCTURE_TOWER)
                roleTower.run(structures[i]);
        }
        roleSpawn.run(spawn);
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

var hasCreatedRoad = false;
function CheckForRoad(creep) {
    if (hasCreatedRoad) return;
    if (Object.keys(Game.constructionSites).length > 3) return;
    if (!creep.pos.findClosestByRange(FIND_STRUCTURES, 
    {
        filter: (structure) => structure.structureType == STRUCTURE_ROAD && structure.pos.room == creep.pos.room && structure.pos.x == creep.pos.x && structure.pos.y == creep.pos.y
    })) {
        if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {
            hasCreatedRoad = true;
            console.log("Creating road at " + creep.pos);
        }
    }
}

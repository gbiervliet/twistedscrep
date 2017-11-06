var roleTower = {

    /** @param {StructureTower} tower **/
    run: function(tower) {
        if (this.attack(tower)) return;
        if (this.heal(tower)) return;
        if (this.repair(tower)) return;
        // console.log("Tower feels useless");
    },

    attack: function(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (creep) => creep.owner.username != 'Carsten' && creep.owner.username != 'Twisted_syntax'
        });
        if(closestHostile) {
            tower.attack(closestHostile);
            return true;
        }
        return false;
    },

    heal: function(tower) {
        var creepsToHeal = _.filter(Game.creeps, (creep)=> creep.hits < creep.hitsMax);

        for (var i in creepsToHeal) {
            if(OK == tower.heal(creepsToHeal[i])) {
                creepsToHeal[i].say("Heals!");
                return true;
            }
        }
        
        return false;
    },

    repair: function(tower) {
        var structuresToRepair = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                if (structure.hits == structure.hitsMax) return false;
                if (structure.structureType == STRUCTURE_RAMPART && structure.hits > 1000) return false;
                if (tower.energy < 500 && structure.structureType == STRUCTURE_RAMPART && structure.hits > 10000) return false;
                if ((tower.energy < 1000 && structure.structureType == STRUCTURE_WALL) || (structure.structureType == STRUCTURE_WALL && structure.hits > 1000)) return false;
                return true;
            }
        });

        for (var i in structuresToRepair) {
            if(OK == tower.repair(structuresToRepair[i])) {
                return true;
            }
        }
        
        return false;
    }


};

module.exports = roleTower;
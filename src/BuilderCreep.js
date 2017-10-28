var CreepRoles = require('CreepRoles');

module.exports = {

    run(creep) {
        let constructionSites = Object.keys(Game.constructionSites);
        const total = _.sum(creep.carry);
        if (constructionSites.length != 0) {
            if (total == 0) {
                creep.memory.role = CreepRoles.HARVESTER();
            }
            let site = Game.constructionSites[constructionSites[0]];
            console.log(site);
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
            }
        } else {
            creep.memory.role = CreepRoles.HARVESTER();
        }

    }

}
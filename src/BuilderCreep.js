var CreepRoles = require('CreepRoles');

module.exports = {

    run(creep) {
        let constuctionSites = Object.keys(Game.constructionSites);

        if(constuctionSites.length != 0) {
            let site = constuctionSites.get(0);
            if(!creep.build(site)) {
                creep.moveTo(constuctionSites.get(0));
            }
        } else{
            creep.memory.role = CreepRoles.HARVESTER();
        }

    }

}
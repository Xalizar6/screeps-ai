// Declaring Strict Mode to enforce better coding standards
"use strict";

module.exports = {

    play: function() {
        
        // Declare variables
        var aTowers;
        var oTower;
                
        // @ts-ignore
        aTowers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER)
        
        for (let oTower in aTowers) {
            module.exports.run(aTowers[oTower])
        }
    },

    run: function(tower) {
        var oSpawn = Game.spawns["Spawn1"];
        var aTargets;

        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy) {
            tower.attack(enemy);
        
        } else if (tower.energy >= 500) {
            aTargets = oSpawn.room.find(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD) && structure.hitsMax - structure.hits >= 1500 
                }});
            
            aTargets.sort((a,b) => a.hits - b.hits);

            if (aTargets.length > 0) {
                tower.repair(oSpawn.pos.findClosestByRange(aTargets));
            }


        } /* else if (tower.energy >= 600) {
            var priority = 1;
            var targets = [];
            while (targets.length == 0 && priority <= 3) {
                var targets = module.exports.getRepairTargets(tower, priority);
                if (targets.length > 0) {
                    tower.repair(tower.pos.findClosestByRange(targets));
                priority++;
                }
            }
        } */
    },
    
/*     getRepairTargets: function(tower, priority) {
        switch (priority) {
            case 1: return _.filter(tower.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hitsMax - s.hits >= 1500);
            case 2: return _.filter(tower.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 300000);
            case 3: return _.filter(tower.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_WALL && s.hits < 300000);
            default: return null;
            tower.pos.find            
        }
    }  */
}
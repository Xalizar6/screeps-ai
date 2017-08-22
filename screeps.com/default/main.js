//Included module files, executed on new global creation every 10 seconds or so.
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var rolebuilder = require('role.builder');
    var spawncode = require('spawncode');
    var towercode = require('towercode');
    var roleDedicatedBuilder = require('role.dedicatedHarvester')
    
    // console.log("Created new Global variables.");

module.exports.loop = function () { // this loop is executed every tick
    // call the spawncode module
        spawncode.run()

    // run the towercode module
        towercode.play()        

    //call the role based work modules
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'builder') {
                rolebuilder.run(creep);
            }
            if(creep.memory.role == 'dedicatedHarvester') {
                // roleDedicatedBuilder.run(creep);
            }
        }
}
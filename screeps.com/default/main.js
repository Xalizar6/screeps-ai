var spawncode = require('spawncode')
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var rolebuilder = require('role.builder');

module.exports.loop = function () {

    //call the spawncode module
        spawncode.run()

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
        }
}
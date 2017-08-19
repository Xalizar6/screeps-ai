var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var rolebuilder = require('role.builder');

module.exports.loop = function () {

    //Set Variables
        var nMinNumberOfHarvesters = 2
        var nMinNumberOfUpgraders = 8
        var nMinNumberOfBuilders = 1

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        // console.log('Harvesters: ' + harvesters.length);

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        // console.log('Upgraders: ' + upgraders.length);

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        // console.log('Upgraders: ' + upgraders.length);
    
    //Clear the deceased creeps from memory
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

    if(harvesters.length < nMinNumberOfHarvesters) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }

    if(upgraders.length < nMinNumberOfUpgraders) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }

    if(builders.length < nMinNumberOfBuilders) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

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
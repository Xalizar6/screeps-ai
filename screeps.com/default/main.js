"use strict"; // Declaring Strict Mode to enforce better coding standards


//Included module files, executed on new global creation every 10 seconds or so.
const log = require('./helper_logging');

log.output('Info', 'Begin - Initializing Modules', true);
    let timer1 = Game.cpu.getUsed();

    let C_mRoleHarvester = require('role.harvester');
    let C_mRoleUpgrader = require('role.upgrader');
    let C_mRoleDedicatedHarvester = require('role.dedicatedHarvester')
    let logisticsLocal = require('role.logisticsLocal')
    let C_mRoleLogisticsShortRange = require('role.logisticsShortRange')
    let C_mRolebuilder = require('role.builder');
    let C_mSpawncode = require('spawncode');
    let C_mTowerCode = require('towercode');
    let myFunctions = require('helper_myFunctions');
    let init = require('helper_initializations');

    log.output('Info', 'Initializing modules took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time',false,true);
log.output('Info', 'End - Initializing Modules');

 
log.output('Info', 'Begin - Adding Sources to Room Memory',true);
    let timer2 = Game.cpu.getUsed();

    if (!Game.spawns['Spawn1'].room.memory.sources) {
        Game.spawns['Spawn1'].room.memory.sources = {};
    };

    let arrayOfSources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    
    for (let i in arrayOfSources) {

        if (!Game.spawns['Spawn1'].room.memory.sources[i]) {
            Game.spawns['Spawn1'].room.memory.sources[i] = {};
        };

        if (!Game.spawns['Spawn1'].room.memory.sources[i].id) {
            Game.spawns['Spawn1'].room.memory.sources[i].id = arrayOfSources[i].id;
        };

        // if (!Game.spawns['Spawn1'].room.memory.sources[i].harvester) {
        //     Game.spawns['Spawn1'].room.memory.sources[i].harvester = '';
        // };

        // if (!Game.spawns['Spawn1'].room.memory.sources[i].hauler) {
        //     Game.spawns['Spawn1'].room.memory.sources[i].hauler = '';
        // };

    };

    log.output('Info', 'Adding Sources to Room Memory took: ' + (Game.cpu.getUsed() - timer2) + ' CPU Time',false,true);
log.output('Info', 'End - Adding Sources to Room Memory');


module.exports.loop = function () { // this loop is executed every tick

    log.output('Info', "Begin - Main", true);
    let mainLoop = Game.cpu.getUsed();


    // Declare variables
    let sName;
    let oCreep;

    // initialize console commands with the alias of cc
    init.initConsoleCommands();
    
    // call the spawncode module
    C_mSpawncode.run();

    // run the towercode module
    C_mTowerCode.play();

    //call the role based work modules
    for (sName in Game.creeps) {
        oCreep = Game.creeps[sName];
        if (oCreep.memory.role == 'harvester') {
            C_mRoleHarvester.run(oCreep);
        }
        if (oCreep.memory.role == 'upgrader') {
            C_mRoleUpgrader.run(oCreep);
        }
        if (oCreep.memory.role == 'builder') {
            C_mRolebuilder.run(oCreep);
        }
        if (oCreep.memory.role == 'dedicatedHarvester') {
            C_mRoleDedicatedHarvester.run(oCreep);
        }
        if (oCreep.memory.role == 'LogisticsShortRange') {
            C_mRoleLogisticsShortRange.run(oCreep);
        }
        if (oCreep.memory.role == 'logisticsLocal') {
            logisticsLocal.run(oCreep);
        }
    }

    log.output('Info', 'Main took: ' + (Game.cpu.getUsed() - mainLoop) + ' CPU Time',true,true);
    log.output('Info', 'End - Main');
}
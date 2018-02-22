"use strict"; // Declaring Strict Mode to enforce better coding standards

// Including logging module furst so it can be used below.
const log = require('./helper_logging');
log.init();

//Including modules, executed on new global creation every 10 seconds or so.
log.output('Info', 'Begin - Initializing Modules', true);
const timer1 = Game.cpu.getUsed();

    const C_mRoleHarvester = require('role.harvester');
    const C_mRoleUpgrader = require('role.upgrader');
    const C_mRoleDedicatedHarvester = require('role.dedicatedHarvester')
    const logisticsLocal = require('role.logisticsLocal')
    const C_mRoleLogisticsShortRange = require('role.logisticsShortRange')
    const C_mRolebuilder = require('role.builder');
    const C_mSpawncode = require('spawncode');
    const C_mTowerCode = require('towercode');
    const myFunctions = require('helper_myFunctions');
    const init = require('helper_initializations');

log.output('Info', 'Initializing modules took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time',false,true);
log.output('Info', 'End - Initializing Modules');

 
log.output('Info', 'Begin - Adding Sources to Room Memory',true);
const timer2 = Game.cpu.getUsed();

    if (!Game.spawns['Spawn1'].room.memory.sources) {
        Game.spawns['Spawn1'].room.memory.sources = {};
    };

    const arrayOfSources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    for (let i in arrayOfSources) {

        if (!Game.spawns['Spawn1'].room.memory.sources[i]) {
            Game.spawns['Spawn1'].room.memory.sources[i] = {};
        };

        if (!Game.spawns['Spawn1'].room.memory.sources[i].id) {
            Game.spawns['Spawn1'].room.memory.sources[i].id = arrayOfSources[i].id;
        };

    };

log.output('Info', 'Adding Sources to Room Memory took: ' + (Game.cpu.getUsed() - timer2) + ' CPU Time',false,true);
log.output('Info', 'End - Adding Sources to Room Memory');


module.exports.loop = function () { // this loop is executed every tick

    log.output('Info', "Begin - Main", true);
    const mainLoop = Game.cpu.getUsed();

    // initialize console commands with the alias of cc
    init.initConsoleCommands();
    
    // call the spawncode module
    C_mSpawncode.run();

    // run the towercode module
    C_mTowerCode.play();

    //call the role based work modules
    for (let i in Game.creeps) {
        const oCreep = Game.creeps[i];
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
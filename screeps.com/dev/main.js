"use strict"; // Declaring Strict Mode to enforce better coding standards


//Included module files, executed on new global creation every 10 seconds or so.
const log = require('./helper_logging');

log.output('Info', 'Begin - Initializing Globals', true);
let startModules = Game.cpu.getUsed();

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
let cacheData = require('helper_cacheData');

log.output('Info', 'End - Initializing Globals');
log.output('Info', 'Initializing modules took: ' + (Game.cpu.getUsed() - startModules) + ' CPU Time',false,true);

log.output('Info', 'Start - Adding Sources to Room Memory',true);

    if (!Game.spawns['Spawn1'].room.memory.sourceIds) {
        // Find the sources and store their id's in memory, 
        // NOT the full objects
        Game.spawns['Spawn1'].room.memory.sourceIds = Game.spawns['Spawn1'].room.find(FIND_SOURCES).map(source => source.id);
    };

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

    log.output('Info', 'End - Main', true);
    log.output('Info', 'Main took: ' + (Game.cpu.getUsed() - mainLoop) + ' CPU Time',false,true);
}
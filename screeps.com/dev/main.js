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
let myFunctions = require('myFunctions');

log.output('Info', 'End - Initializing Globals');
log.output('Info', 'Initializing modules took: ' + (Game.cpu.getUsed() - startModules) + ' CPU Time',false,true);


module.exports.loop = function () { // this loop is executed every tick

    log.output('Info', "Begin - Main", true);
    let mainLoop = Game.cpu.getUsed();

    // Declare variables
    let sName;
    let oCreep;

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
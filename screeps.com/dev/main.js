"use strict"; // Declaring Strict Mode to enforce better coding standards

//-------------------------------------------------------
// Including logging module first so it can be used below.
const log = require('./helper_logging');
log.init();
//-------------------------------------------------------

//-------------------------------------------------------
//Including modules, executed on new global creation every 10 seconds or so.
log.output('Info', 'Begin - Initializing Modules', true);
const timer1 = Game.cpu.getUsed();

const C_mRoleHarvester = require('role.harvester');
const C_mRoleUpgrader = require('role.upgrader');
const C_mRoleDedicatedHarvester = require('role.dedicatedHarvester');
const logisticsLocal = require('role.logisticsLocal');
const C_mRoleLogisticsShortRange = require('role.logisticsShortRange');
const C_mRolebuilder = require('role.builder');
const C_mSpawncode = require('spawncode');
const C_mTowerCode = require('towercode');
const mineralHarvester = require('./role.mineralHarvester');
const mineralHauler = require("./role.mineralHauler");
const myFunctions = require('helper_myFunctions');
const init = require('helper_initializations');
const _ = require('lodash');

log.output('Info', 'Initializing modules took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', false, true);
log.output('Info', 'End - Initializing Modules');
//-------------------------------------------------------

//-------------------------------------------------------
// Add sources in a room to the room memory
log.output('Info', 'Begin - Adding Energy sources to Room Memory', true);
const timer2 = Game.cpu.getUsed();

init.addSourcesToMemory();

log.output('Info', 'Adding Energy sources to Room Memory took: ' + (Game.cpu.getUsed() - timer2) + ' CPU Time', false, true);
log.output('Info', 'End - Adding Energy sources to Room Memory');
//-------------------------------------------------------

//-------------------------------------------------------
// Add minerals in a room to the room memory
log.output('Info', 'Begin - Adding Minerals to Room Memory', true);
const timer3 = Game.cpu.getUsed();

init.addMineralsToMemory();

log.output('Info', 'Adding Minerals to Room Memory took: ' + (Game.cpu.getUsed() - timer3) + ' CPU Time', false, true);
log.output('Info', 'End - Adding Minerals to Room Memory');
//-------------------------------------------------------


// This loop is executed every tick
module.exports.loop = function () {

    log.output('Info', "Begin - Main", true);
    const mainLoop = Game.cpu.getUsed();

    // Initialize console commands with the alias of cc
    init.initConsoleCommands();

    // Run the spawncode module
    C_mSpawncode.run();

    // Run the towercode module
    const aTowers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    for (let i in aTowers) {
        C_mTowerCode.run(aTowers[i]);
    };

    // Call the role based work modules
    for (let i in Game.creeps) {
        const oCreep = Game.creeps[i];

        if (oCreep.memory.role == 'harvester') {
            C_mRoleHarvester.run(oCreep);
        };

        if (oCreep.memory.role == 'upgrader') {
            C_mRoleUpgrader.run(oCreep);
        };

        if (oCreep.memory.role == 'builder') {
            C_mRolebuilder.run(oCreep);
        };

        if (oCreep.memory.role == 'dedicatedHarvester') {
            C_mRoleDedicatedHarvester.run(oCreep);
        };

        if (oCreep.memory.role == 'LogisticsShortRange') {
            C_mRoleLogisticsShortRange.run(oCreep);
        };

        if (oCreep.memory.role == 'logisticsLocal') {
            logisticsLocal.run(oCreep);
        };

        if (oCreep.memory.role === 'Mineral Harvester') {
            mineralHarvester.run(oCreep);
        };

        if (oCreep.memory.role === 'Mineral Hauler') {
            mineralHauler.run(oCreep);
        };

    };

    log.output('Info', 'Main took: ' + (Game.cpu.getUsed() - mainLoop) + ' CPU Time', true, true);
    log.output('Info', 'End - Main');
};
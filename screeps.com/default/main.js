// Declaring Strict Mode to enforce better coding standards
"use strict";

//Included module files, executed on new global creation every 10 seconds or so.
var C_mRoleHarvester = require('role.harvester');
var C_mRoleUpgrader = require('role.upgrader');
var C_mRoleDedicatedHarvester = require('role.dedicatedHarvester')
var logisticsLocal = require('role.logisticsLocal')
var C_mRoleLogisticsShortRange = require('role.logisticsShortRange')
var C_mRolebuilder = require('role.builder');
var C_mSpawncode = require('spawncode');
var C_mTowerCode = require('towercode');
var myFunctions = require('myFunctions');
console.log("reload globals")

module.exports.loop = function () { // this loop is executed every tick
    console.log("running loop")
    // Declare variables
    var sName;
    var oCreep;

    // call the spawncode module
    C_mSpawncode.run()

    // run the towercode module
    C_mTowerCode.play()

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
}
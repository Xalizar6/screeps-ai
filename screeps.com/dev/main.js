"use strict"; // Declaring Strict Mode to enforce better coding standards

//Included module files, executed on new global creation every 10 seconds or so.
const startModules = Game.cpu.getUsed();
console.log("Start - Including modules")

var C_mRoleHarvester = require('role.harvester');
var C_mRoleUpgrader = require('role.upgrader');
var C_mRoleDedicatedHarvester = require('role.dedicatedHarvester')
var logisticsLocal = require('role.logisticsLocal')
var C_mRoleLogisticsShortRange = require('role.logisticsShortRange')
var C_mRolebuilder = require('role.builder');
var C_mSpawncode = require('spawncode');
var C_mTowerCode = require('towercode');
var myFunctions = require('myFunctions');

console.log("Done - Including modules took: " + (Game.cpu.getUsed() - startModules) + " CPU Time");


module.exports.loop = function () { // this loop is executed every tick

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

    // console.log("Total CPU Time used: " + Game.cpu.getUsed());

}
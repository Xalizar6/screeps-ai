"use strict"; // Declaring Strict Mode to enforce better coding standards

//-------------------------------------------------------
// Including logging module first so it can be used below.
const log = require( './helper_logging' );
log.init();
//-------------------------------------------------------

//-------------------------------------------------------
//Including modules, executed on new global creation
log.output( 'Info', 'Begin - Initializing Modules', true );
const timer1 = Game.cpu.getUsed();

const C_mRoleHarvester = require( 'role.harvester' );
const C_mRoleUpgrader = require( 'role.upgrader' );
const C_mRoleDedicatedHarvester = require( 'role.dedicatedHarvester' );
const logisticsLocal = require( 'role.logisticsLocal' );
const C_mRoleLogisticsShortRange = require( 'role.logisticsShortRange' );
const C_mRolebuilder = require( 'role.builder' );
const C_mSpawncode = require( 'spawncode' );
const C_mTowerCode = require( 'towercode' );
const C_mMarketCode = require( './marketCode' );
const C_mConstructionCode = require( './helper_construction' );
const mineralHarvester = require( './role.mineralHarvester' );
const mineralHauler = require( "./role.mineralHauler" );
const terminalManager = require( "./role.terminalManager" );
const myFunctions = require( 'helper_myFunctions' );
const init = require( './helper_initializations_v2' );

log.output( 'Info', 'Initializing modules took: ' + ( Game.cpu.getUsed() - timer1 ).toFixed( 2 ) + ' CPU Time', false, true );
log.output( 'Info', 'End - Initializing Modules' );
//-------------------------------------------------------

//-------------------------------------------------------
// Initialize memory
init.initMemory();
//-------------------------------------------------------

// This loop is executed every tick
module.exports.loop = function () {

    log.output( 'Info', "Begin - Main", true );
    const mainLoop = Game.cpu.getUsed();

    // Initialize console commands with the alias of cc
    init.initConsoleCommands();

    // Run the spawncode module
    C_mSpawncode.run();

    // Run the Tower module
    const aTowers = _.filter( Game.structures, ( s ) => s.structureType == STRUCTURE_TOWER );
    for ( let i in aTowers ) {
        C_mTowerCode.run( aTowers[i] );
    };

    // Run the Market module
    C_mMarketCode.run();

    // Run the Construction module    
    C_mConstructionCode.run();

    // Call the role based work module for each creep
    for ( let i in Game.creeps ) {
        const oCreep = Game.creeps[i];

        if ( oCreep.memory.role == 'harvester' ) {
            C_mRoleHarvester.run( oCreep );
        };

        if ( oCreep.memory.role == 'upgrader' ) {
            C_mRoleUpgrader.run( oCreep );
        };

        if ( oCreep.memory.role == 'builder' ) {
            C_mRolebuilder.run( oCreep );
        };

        if ( oCreep.memory.role == 'dedicatedHarvester' ) {
            C_mRoleDedicatedHarvester.run( oCreep );
        };

        if ( oCreep.memory.role == 'LogisticsShortRange' ) {
            C_mRoleLogisticsShortRange.run( oCreep );
        };

        if ( oCreep.memory.role == 'logisticsLocal' ) {
            logisticsLocal.run( oCreep );
        };

        if ( oCreep.memory.role === 'Mineral Harvester' ) {
            mineralHarvester.run( oCreep );
        };

        if ( oCreep.memory.role === 'Mineral Hauler' ) {
            mineralHauler.run( oCreep );
        };

        if ( oCreep.memory.role === 'Terminal Manager' ) {
            terminalManager.run( oCreep );
        };

    };

    log.output( 'Info', 'Main took: ' + ( Game.cpu.getUsed() - mainLoop ).toFixed( 2 ) + ' CPU Time with ' + Game.cpu.bucket + ' bucket remaining', true, true );
    log.output( 'Info', 'End - Main' );
};
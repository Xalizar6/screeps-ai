"use strict"; // Declaring Strict Mode to enforce better coding standards
const _ = require( 'lodash' );
const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );
const debug = false; // Turn logging for this module on and off

module.exports = {

    /** @param {Creep} creep **/
    harvestEnergy: function ( creep, source )
    {
        if ( creep.harvest( source ) == ERR_NOT_IN_RANGE )
        {
            creep.moveTo( source, { visualizePathStyle: { stroke: '#f2f210' } } );
        };
    },

    /** @param {Creep} creep **/
    harvestEnergy_v2: function ( creep, source )
    {

        if ( debug ) { log.output( 'Debug', 'Begin: HarvestEnergy_v2', false, true ) };

        if ( creep.memory.role === 'dedicatedHarvester' )
        {

            if ( debug ) { log.output( 'Debug', creep.name + ' is a dedicated harvester', false, true ) };
            if ( debug ) { log.output( 'Debug', 'Target source ID is: ' + source.id, false, true ) };

            // Array of the sources in the room from memory
            const aSourcesInMemory = creep.room.memory.sources;

            // Get the ID of the container near the source if there is one
            const sContainerID = _.result( _.find( aSourcesInMemory, 'id', source.id ), 'containerID', 'noContainer' );
            if ( debug ) { log.output( 'Debug', 'Target Container ID is: ' + sContainerID, false, true ) };

            // If you find a container
            let oTargetPos = null;
            if ( sContainerID !== 'noContainer' )
            {

                // Get the location of the container and set it as your target position
                oTargetPos = Game.getObjectById( sContainerID ).pos;

            } else
            {

                // Set the source as your target position
                oTargetPos = source.pos;
            };

            if ( debug ) { log.output( 'Debug', 'Creep target pos: ' + oTargetPos, false, true ) };

            // Sit on top of the container if there is one or within 1 of the mineral source if no container
            let nRange = null;
            if ( sContainerID !== 'noContainer' )
            {
                nRange = 0;
            } else
            {
                nRange = 1;
            };

            // Has the creep arrived at the target position?
            if ( creep.pos.getRangeTo( oTargetPos ) <= nRange )
            {
                creep.harvest( source )

            } else
            {
                // It hasn't arrived, so we get it to move to target position
                creep.moveTo( oTargetPos );
            };

        } else
        {

            if ( creep.harvest( source ) == ERR_NOT_IN_RANGE )
            {
                creep.moveTo( source, { visualizePathStyle: { stroke: '#f2f210' } } );
            };

        };

        if ( debug ) { log.output( 'Debug', 'End: HarvestEnergy_v2', false, true ) };

    },

    /** @param {Creep} creep **/
    // This method is deprecated and will be removed soon. Please use Creep.withdraw instead.
    transferEnergy: function ( creep, transferTarget )
    {
        if ( creep.transfer( transferTarget, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE )
        {
            creep.moveTo( transferTarget, { visualizePathStyle: { stroke: '#f2f210' } } );
        };
    },

    /** @param {Creep} creep **/
    withdrawEnergy: function ( creep, energySource )
    {
        if ( creep.withdraw( energySource, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE )
        {
            creep.moveTo( energySource, { visualizePathStyle: { stroke: '#2386ea' } } );
        };
    },

    /** @param {Creep} creep **/
    pickupEnergy: function ( creep, target )
    {
        if ( creep.pickup( target ) == ERR_NOT_IN_RANGE )
        {
            creep.moveTo( target, { visualizePathStyle: { stroke: '#f2f210' } } );
        };
    },

    getEnergy_v3: function ( creep )
    {

        if ( debug ) { log.output( 'Debug', 'Begin - getEnergy_v3 for ' + creep.name, false, true ) };

        const oStorage = creep.room.storage;
        const nMinEnergyInStorage = myConstants.STORAGE_ENERGY_STORAGE_TARGET;
        let oEnergySource;

        if ( !oEnergySource )
        {
            if ( oStorage && oStorage.store[ RESOURCE_ENERGY ] > nMinEnergyInStorage )
            {
                oEnergySource = oStorage;
                if ( debug ) { log.output( 'Debug', 'Picking up energy from storage', false, true ) };
                this.withdrawEnergy( creep, oEnergySource );
            };
        };

        if ( !oEnergySource )
        {
            const aDroppedEnergy = creep.pos.findInRange( FIND_DROPPED_RESOURCES, 3 );
            if ( aDroppedEnergy.length > 0 && aDroppedEnergy[ 0 ].amount > creep.carryCapacity - _.sum( creep.carry ) )
            {
                oEnergySource = aDroppedEnergy[ 0 ];
                if ( debug ) { log.output( 'Debug', 'Picking up energy on ground with ' + oEnergySource.amount + ' energy', false, true ) };
                if ( debug ) { log.output( 'Debug', 'Energy source location ' + oEnergySource.pos, false, true ) };
                this.pickupEnergy( creep, oEnergySource );
            };
        };

        if ( !oEnergySource )
        {
            oEnergySource = creep.pos.findClosestByPath( FIND_SOURCES_ACTIVE );
            if ( oEnergySource )
            {
                if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + oEnergySource.pos, false, true ) };
                this.harvestEnergy( creep, oEnergySource );
            };
        };

        if ( debug ) { log.output( 'Debug', 'End - getEnergy_v3', false, true ) };

    },

};
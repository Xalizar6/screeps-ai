"use strict"; // Declaring Strict Mode to enforce better coding standards
const log = require( './helper_logging' );
const debug = true; // Turn logging for this module on and off
const myConstants = require( './helper_constants' );


module.exports = {

    /** @param {Creep} creep **/
    harvestEnergy: function ( creep, source ) {
        if ( creep.harvest( source ) == ERR_NOT_IN_RANGE ) {
            creep.moveTo( source, { visualizePathStyle: { stroke: '#f2f210' } } );
        };
    },

    /** @param {Creep} creep **/
    transferEnergy: function ( creep, transferTarget ) {
        if ( creep.transfer( transferTarget, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
            creep.moveTo( transferTarget, { visualizePathStyle: { stroke: '#f2f210' } } );
        };
    },

    /** @param {Creep} creep **/
    withdrawEnergy: function ( creep, energySource ) {
        if ( creep.withdraw( energySource, RESOURCE_ENERGY, creep.carryCapacity ) == ERR_NOT_IN_RANGE ) {
            creep.moveTo( energySource, { visualizePathStyle: { stroke: '#2386ea' } } );
        };
    },

    /** @param {Creep} creep **/
    pickupEnergy: function ( creep, target ) {
        if ( creep.pickup( target ) == ERR_NOT_IN_RANGE ) {
            creep.moveTo( target, { visualizePathStyle: { stroke: '#f2f210' } } );
        };
    },

    getEnergy_v2: function ( creep ) {

        let oEnergySource = {};
        const oStorage = creep.room.storage;

        if ( oStorage && oStorage.store[RESOURCE_ENERGY] > 5000 ) {
            oEnergySource = oStorage;
            this.withdrawEnergy( creep, oEnergySource );

        } else {

            let aDroppedResources = _.sortByOrder( creep.room.find( FIND_DROPPED_RESOURCES ), ['amount'], ['desc'] );

            if ( aDroppedResources.length > 0 && aDroppedResources[0].amount > creep.carryCapacity - _.sum( creep.carry ) ) {
                oEnergySource = aDroppedResources[0];
                if ( debug ) { log.output( 'Debug', 'Picking up energy on ground with ' + oEnergySource.amount + ' energy', false, true ) };
                if ( debug ) { log.output( 'Debug', 'Energy source location ' + oEnergySource.pos, false, true ) };
                this.pickupEnergy( creep, oEnergySource );

            } else {

                oEnergySource = creep.room.find( FIND_SOURCES_ACTIVE );
                if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + oEnergySource[0].pos, false, false ) };
                this.harvestEnergy( creep, oEnergySource[0] );

            };
        };

    },

    getEnergy_v3: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - getEnergy_v3 for ' + creep.name, false, true ) };

        const oStorage = creep.room.storage;
        const nMinEnergyStorage = myConstants.STORAGE_ENERGY_STORAGE_TARGET;
        let oEnergySource = null;

        if ( !oEnergySource ) {
            if ( oStorage && oStorage.store[RESOURCE_ENERGY] > nMinEnergyStorage ) {
                oEnergySource = oStorage;
                if ( debug ) { log.output( 'Debug', 'Picking up energy from storage', false, true ) };
                this.withdrawEnergy( creep, oEnergySource );
            };
        };

        if ( !oEnergySource ) {
            const aDroppedEnergy = _.sortByOrder( creep.pos.findInRange( FIND_DROPPED_RESOURCES, 3 ), ['amount'], ['desc'] );
            if ( aDroppedEnergy.length > 0 && aDroppedEnergy[0].amount > creep.carryCapacity - _.sum( creep.carry ) ) {
                oEnergySource = aDroppedEnergy[0];
                if ( debug ) { log.output( 'Debug', 'Picking up energy on ground with ' + oEnergySource.amount + ' energy', false, true ) };
                if ( debug ) { log.output( 'Debug', 'Energy source location ' + oEnergySource.pos, false, true ) };
                this.pickupEnergy( creep, oEnergySource );
            };
        };

        if ( !oEnergySource ) {
            oEnergySource = creep.pos.findClosestByPath( FIND_SOURCES_ACTIVE );
            if ( oEnergySource ) {
                if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + oEnergySource.pos, false, false ) };
                this.harvestEnergy( creep, oEnergySource );
            };
        };

        if ( debug ) { log.output( 'Debug', 'End - getEnergy_v3', false, true ) };

    },

};
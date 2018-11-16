"use strict"; // Declaring Strict Mode to enforce better coding standards
const _ = require( 'lodash' );
const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );
const debug = false; // Turn logging for this module on and off


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

    getEnergy_v3: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - getEnergy_v3 for ' + creep.name, false, true ) };

        const oStorage = creep.room.storage;
        const nMinEnergyInStorage = myConstants.STORAGE_ENERGY_STORAGE_TARGET;
        let oEnergySource;

        if ( !oEnergySource ) {
            if ( oStorage && oStorage.store[RESOURCE_ENERGY] > nMinEnergyInStorage ) {
                oEnergySource = oStorage;
                if ( debug ) { log.output( 'Debug', 'Picking up energy from storage', false, true ) };
                this.withdrawEnergy( creep, oEnergySource );
            };
        };

        if ( !oEnergySource ) {
            const aDroppedEnergy = creep.pos.findInRange( FIND_DROPPED_RESOURCES, 3 );
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
                if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + oEnergySource.pos, false, true ) };
                this.harvestEnergy( creep, oEnergySource );
            };
        };

        if ( debug ) { log.output( 'Debug', 'End - getEnergy_v3', false, true ) };

    },

};
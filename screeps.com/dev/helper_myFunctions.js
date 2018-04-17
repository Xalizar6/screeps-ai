"use strict"; // Declaring Strict Mode to enforce better coding standards
const log = require( './helper_logging' );
const debug = true; // Turn logging for this module on and off


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

    getEnergy: function ( creep ) {
        // not in use, can be retired if v2 gets working _DR 4/17/18
        let oEnergySource = {};
        let oStorage = creep.room.storage;

        if ( oStorage && oStorage.store[RESOURCE_ENERGY] > 5000 ) {
            oEnergySource = oStorage;
            this.withdrawEnergy( creep, oEnergySource );

        } else if ( creep.room.find( FIND_DROPPED_RESOURCES ).length > 0 ) {
            oEnergySource = _.sortByOrder( creep.room.find( FIND_DROPPED_RESOURCES ), ['amount'], ['desc'] );
            if ( debug ) { log.output( 'Debug', 'Picking up energy on ground with ' + oEnergySource[0].amount + ' energy', false, true ) };
            if ( debug ) { log.output( 'Debug', 'Energy source location ' + oEnergySource[0].pos, false, true ) };
            this.pickupEnergy( creep, oEnergySource[0] );

        } else {
            // If there isn't a storage or the storage is low then get energy from a source
            oEnergySource = creep.room.find( FIND_SOURCES_ACTIVE )[0];
            if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + oEnergySource.pos, false, false ) };
            this.harvestEnergy( creep, oEnergySource );
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

                oEnergySource = creep.room.find( FIND_SOURCES_ACTIVE )[0];
                if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + oEnergySource.pos, false, false ) };
                this.harvestEnergy( creep, oEnergySource );

            };
        };

    },

};
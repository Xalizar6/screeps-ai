"use strict"; // Declaring Strict Mode to enforce better coding standards

const log = require( './helper_logging' );
const _ = require( 'lodash' );

module.exports = {

    run: function ( tower ) {

        log.output( 'Debug', 'Begin - TowerCode routine', true );
        const timer1 = Game.cpu.getUsed();

        let target = null;

        if ( !target ) {
            const aTargets = tower.room.find( FIND_HOSTILE_CREEPS );
            if ( aTargets.length > 0 ) {
                log.output( 'Event', 'Defending against hostiles', false, true );
                log.output( 'Event', 'Number of hostiles: ' + aTargets.length, false, true );
                target = tower.pos.findClosestByRange( FIND_HOSTILE_CREEPS );
                tower.attack( target );
            };
        };

        if ( !target ) {
            const aTargets = tower.room.find( FIND_STRUCTURES, {
                filter: ( structure ) => {
                    return ( structure.structureType == STRUCTURE_CONTAINER ) && structure.hitsMax - structure.hits >= 5000
                }
            } );

            if ( aTargets.length > 0 ) {
                log.output( 'Event', 'Repairing containers', false, true );
                aTargets.sort( ( a, b ) => a.hits - b.hits );
                target = tower.pos.findClosestByRange( aTargets );
                tower.repair( target );
            };
        };

        if ( !target ) {
            const aTargets = tower.room.find( FIND_STRUCTURES, {
                filter: ( structure ) => {
                    return ( structure.structureType == STRUCTURE_ROAD ) && structure.hitsMax - structure.hits >= 4000
                }
            } );

            if ( aTargets.length > 0 ) {
                log.output( 'Event', 'Repairing roads', false, true );
                aTargets.sort( ( a, b ) => a.hits - b.hits );
                target = tower.pos.findClosestByRange( aTargets );
                tower.repair( target );
            };
        };

        if ( !target ) {
            log.output( 'Debug', 'No targets to attack or repair', false, true );
        };

        /*
        if (enemy) {
            tower.attack(enemy);
        
        } else if (tower.energy > 500) {
            const aTargets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD) && structure.hitsMax - structure.hits >= 1500 
                }});
            
            aTargets.sort((a,b) => a.hits - b.hits);

            if (aTargets.length > 0) {
                tower.repair(tower.pos.findClosestByRange(aTargets));
            };

        } else if (tower.energy >= 600) {
            var priority = 1;
            var targets = [];
            while (targets.length == 0 && priority <= 3) {
                var targets = module.exports.getRepairTargets(tower, priority);
                if (targets.length > 0) {
                    tower.repair(tower.pos.findClosestByRange(targets));
                priority++;
                }
            }
        }; 
        */

        log.output( 'Debug', 'TowerCode routine took: ' + ( Game.cpu.getUsed() - timer1 ) + ' CPU Time', false, true );
        log.output( 'Debug', 'End - TowerCode routine' );

    },

    /*     getRepairTargets: function(tower, priority) {
            switch (priority) {
                case 1: return _.filter(tower.room.find(FIND_STRUCTURES), (s) => (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hitsMax - s.hits >= 1500);
                case 2: return _.filter(tower.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 300000);
                case 3: return _.filter(tower.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_WALL && s.hits < 300000);
                default: return null;
                tower.pos.find            
            }
        }  */
};
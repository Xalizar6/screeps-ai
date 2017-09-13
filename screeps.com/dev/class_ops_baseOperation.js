"use strict"; // Declaring Strict Mode to enforce better coding standards


const Operation = require('./class_ops_Operation');
const Empire = require('./class_Empire');
const harvestEnergy = require('./class_missions_harvestEnergyMission');


module.exports = class baseOperation extends Operation {


    /**
     * @param {Flag} flag - missions will operate relative to this flag, use the following naming convention: "operationType_operationName"
     * @param {string} name - second part of flag.name, should be unique among all other operation names (I use city names)
     * @param {string} type - first part of flag.name, used to determine which operation class to instantiate
     * @param {Empire} empire - object used for empire-scoped behavior (terminal transmission, etc.)
     */
    constructor(flag, name, type, empire) {
        super(flag, name, type, empire);
    };


    initOperation() {
        // this line tells our operation where to spawn from
        this.spawnGroup = this.empire.getSpawnGroup(this.flag.room.name);
        // instantiate our mission
        this.addMission(new harvestEnergy(this))
    }


    finalizeOperation() {

    };


    invalidateOperationCache() {

    };


};
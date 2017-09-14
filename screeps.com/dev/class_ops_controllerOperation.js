"use strict"; // Declaring Strict Mode to enforce better coding standards

const log = require('./helper_logging');
const Operation = require('./class_ops_Operation');


module.exports = class baseOperation extends Operation {


    /**
     * @param {Flag} flag - missions will operate relative to this flag, use the following naming convention: "operationType_operationName"
     * @param {string} name - second part of flag.name, should be unique among all other operation names (I use city names)
     * @param {string} type - first part of flag.name, used to determine which operation class to instantiate
     * @param empire - object used for empire-scoped behavior (terminal transmission, etc.)
     */
    constructor(flag, name, type, empire) {
        super(flag, name, type, empire);
    };


    initOperation() {
        log.output('Info', 'Begin - class_ops_controllerOperation initialization' + '    ' + this.name, false, true)
        // this line tells our operation where to spawn from
        // this.spawnGroup = this.empire.getSpawnGroup(this.flag.room.name);



        log.output('Info', 'End - class_ops_controllerOperation initialization' + '    ' + this.name, false, true)


        // instantiate our mission
        // this.addMission(new harvestEnergy(this))
    };


    finalizeOperation() {

    };


    invalidateOperationCache() {

    };


};
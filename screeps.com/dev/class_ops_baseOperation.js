"use strict"; // Declaring Strict Mode to enforce better coding standards

const controllerOperation = require('./class_ops_controllerOperation');


module.exports = class baseOperation extends controllerOperation {


    /**
     * @param {Flag} flag - missions will operate relative to this flag, use the following naming convention: "operationType_operationName"
     * @param {string} name - second part of flag.name, should be unique among all other operation names (I use city names)
     * @param {string} type - first part of flag.name, used to determine which operation class to instantiate
     * @param empire - object used for empire-scoped behavior (terminal transmission, etc)
     */
    constructor(flag, name, type, empire) {
        super(flag, name, type, empire);
    };


};
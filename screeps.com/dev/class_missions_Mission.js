"use strict"; // Declaring Strict Mode to enforce better coding standards
const Operation = require('./class_ops_Operation');

// Class for housing information and functions for managing missions.
module.exports = class Mission {


    /**
     * @param {object} operation - the operation that this mission will be a part of
     * @param {string} name - the name of the type of mission
     * @param {boolean} allowSpawn - toggle the ability for this mission to spawn units
     */
    constructor(operation, name, allowSpawn = true) {
        this.name = name;
        Object.defineProperty(this, "spawnGroup", { enumerable: false, value: operation.spawnGroup, writable: true });
    };


};
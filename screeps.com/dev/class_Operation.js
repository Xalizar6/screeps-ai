"use strict"; // Declaring Strict Mode to enforce better coding standards


const Empire = require('./class_Empire');
const Mission = require('./class_Mission');


// Class for housing information and functions for managing my operations.
module.exports = class Operation {


    /**
     * @param {Flag} flag - missions will operate relative to this flag, use the following naming convention: "operationType_operationName"
     * @param {string} name - second part of flag.name, should be unique among all other operation names (I use city names)
     * @param {string} type - first part of flag.name, used to determine which operation class to instantiate
     * @param {Empire} empire - object used for empire-scoped behavior (terminal transmission, etc.)
     */
    constructor(flag, name, type, empire) {
        this.flag = flag;
        this.name = name;
        this.type = type;
        this.empire = empire;
        if (!this.missions) { this.missions = {}; };
    };


    init() {

    };


    roleCall() {

    };


    actions() {

    };


    finalize() {

    };


    invalidateCache() {

    };


    /**
     * @param {Mission} mission
     */
    addMission(mission) {
        // it is important for every mission belonging to an operation to have
        // a unique name or they will be overwritten here
        this.missions[mission.name] = mission;
    };


};
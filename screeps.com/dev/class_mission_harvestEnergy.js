"use strict"; // Declaring Strict Mode to enforce better coding standards

var Mission = require('./class_Mission');

module.exports = class harvestEnergy extends Mission {


    constructor (name) {
        super(name);
        this.name = name;
    };


    initMission() {};
    
    
    roleCall() {};


    missionActions() {};


    finalizeMission() {};


    invalidateMissionCache() {};


};


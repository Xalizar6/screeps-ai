"use strict"; // Declaring Strict Mode to enforce better coding standards


var Mission = require('./class_Mission');


module.exports = class harvestEnergy extends Mission {


    constructor (operation) {
        super(operation, 'harvestEnergy');
    };


    initMission() {};
    
    
    roleCall() {};


    missionActions() {};


    finalizeMission() {};


    invalidateMissionCache() {};


};


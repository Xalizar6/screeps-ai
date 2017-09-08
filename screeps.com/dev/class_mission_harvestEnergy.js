"use strict"; // Declaring Strict Mode to enforce better coding standards


var Mission = require('./class_Mission');


module.exports = class harvestEnergy extends Mission {


    constructor(operation, name, source, remoteSpawning = false) {
        super(operation, 'harvestEnergy');
        this.source = source;
        this.remoteSpawning = remoteSpawning;
    };


    initMission() {
        this.minersNeeded = 1;
        if (this.spawnGroup.maxSpawnEnergy < 1050 && !this.remoteSpawning) {
            this.minersNeeded = 2;
            if (this.spawnGroup.maxSpawnEnergy < 450) {
                this.minersNeeded = 3;
            };
        };
    };



    roleCall() {
        let maxMiners = this.minersNeeded;

    };


    missionActions() {

    };


    finalizeMission() {

    };


    invalidateMissionCache() {

    };


};


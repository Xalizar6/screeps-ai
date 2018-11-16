"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = class SpawnGroup {


    constructor(room) {
        this.room = room;
        this.spawns = room.find(FIND_MY_SPAWNS);
        if (!this.room.memory.spawnMemory)
            this.room.memory.spawnMemory = {};
        this.memory = this.room.memory.spawnMemory;
        // consider this later like how BonzAI does it as part of the room prototype
        // this.extensions = room.findStructures(STRUCTURE_EXTENSION);
        this.availableSpawnCount = this.getSpawnAvailability();
        this.isAvailable = this.availableSpawnCount > 0;
        this.currentSpawnEnergy = this.room.energyAvailable;
        this.maxSpawnEnergy = this.room.energyCapacityAvailable;
        this.pos = _.head(this.spawns).pos;
    };


    getSpawnAvailability() {
        let count = 0;
        for (let spawn of this.spawns) {
            if (spawn.spawning === null) {
                count++;
            }
        }
        // revisit later
        // this.memory.log.availability += count;
        return count;
    };


};
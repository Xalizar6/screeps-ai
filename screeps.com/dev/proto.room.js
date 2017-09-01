"use strict"; // Declaring Strict Mode to enforce better coding standards


// Extend the Room prototype and Memory to include the sources in the room as a property.
    Object.defineProperty(Room.prototype, 'sources', {
        get: function() {
                // If we dont have the value stored locally
            if (!this._sources) {
                    // If we dont have the value stored in memory
                if (!this.memory.sourceIds) {
                        // Find the sources and store their id's in memory, 
                        // NOT the full objects
                    this.memory.sourceIds = this.find(FIND_SOURCES)
                                            .map(source => source.id);
                }
                // Get the source objects from the id's in memory and store them locally
                this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
            }
            // return the locally stored value
            return this._sources;
        },
        set: function(newValue) {
            // when storing in memory you will want to change the setter
            // to set the memory value as well as the local value
            this.memory.sources = newValue.map(source => source.id);
            this._sources = newValue;
        },
        enumerable: false,
        configurable: true
    });

// Extend the Room prototype and Memory to include the Spawners in the room as a property.
    Object.defineProperty(Room.prototype, 'spawns', {
        get: function() {
                // If we dont have the value stored locally
            if (!this._spawns) {
                    // If we dont have the value stored in memory
                if (!this.memory.spawnIds) {
                        // Find the sources and store their id's in memory, 
                        // NOT the full objects
                    this.memory.spawnIds = this.find(FIND_MY_SPAWNS)
                                            .map(spawn => spawn.id);
                }
                // Get the source objects from the id's in memory and store them locally
                this._spawns = this.memory.spawnIds.map(id => Game.getObjectById(id));
            }
            // return the locally stored value
            return this._spawns;
        },
        set: function(newValue) {
            // when storing in memory you will want to change the setter
            // to set the memory value as well as the local value
            this.memory.spawns = newValue.map(spawn => spawn.id);
            this._spawns = newValue;
        },
        enumerable: false,
        configurable: true
    });
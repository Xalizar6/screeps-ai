"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = function () {

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

    Object.defineProperty(Source.prototype, 'memory', {       
        get: function() {
            if(_.isUndefined(Memory.mySourcesMemory)) {
                Memory.mySourcesMemory = {};
            }
            if(!_.isObject(Memory.mySourcesMemory)) {
                return undefined;
            }
            return Memory.mySourcesMemory[this.id] = 
                    Memory.mySourcesMemory[this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(Memory.mySourcesMemory)) {
                Memory.mySourcesMemory = {};
            }
            if(!_.isObject(Memory.mySourcesMemory)) {
                throw new Error('Could not set source memory');
            }
            Memory.mySourcesMemory[this.id] = value;
        },
        configurable: true,
        enumerable:true,
    });

};
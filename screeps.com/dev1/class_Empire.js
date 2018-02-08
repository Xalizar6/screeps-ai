"use strict"; // Declaring Strict Mode to enforce better coding standards
var _ = require('lodash');
const SpawnGroup = require('./class_spawnGroup');

// Class for housing information and functions for managing my empire.
module.exports = class Empire {
    constructor(name) {
        this.name = name;
        this.spawnGroups = {};
    };

    static create(name) {
        return new Empire(name);
    };


    createOperations() {
        

    };


    getAllSources() {
        for(let item in this.rooms) {
            console.log(this.rooms[item].find(FIND_SOURCES_ACTIVE))
        };
    };


    getSpawnGroup(roomName) {
        if (this.spawnGroups[roomName]){
            return this.spawnGroups[roomName];
        } else {
            let room = Game.rooms[roomName];
            if (room && room.find(FIND_MY_SPAWNS).length > 0) {
                this.spawnGroups[roomName] = new SpawnGroup(room);
                return this.spawnGroups[roomName];
            };
        };
    };
    
    
    getVisibleRooms() {
        if (!this.rooms) {this.rooms = Game.rooms};
        // for (let i in Game.rooms) { console.log(Game.rooms[i].name); };
    };


    init() {
        
    };

            
};
"use strict"; // Declaring Strict Mode to enforce better coding standards
var _ = require('lodash');


// Class for housing information and functions for managing my empire.
module.exports = class Empire {
    constructor(name) {
        this.name = name;
        // this.rooms = Game.rooms;
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


    getSpawnGroup(flag) {

    };
    
    
    getVisibleRooms() {
        if (!this.rooms) {this.rooms = Game.rooms};
        // for (let i in Game.rooms) { console.log(Game.rooms[i].name); };
    };


    init() {
        
    };

            
};
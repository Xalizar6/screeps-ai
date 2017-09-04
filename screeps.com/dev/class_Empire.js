"use strict"; // Declaring Strict Mode to enforce better coding standards
var _ = require('lodash');


// Class for housing information and functions for managing my empire.
module.exports = class Empire {
    constructor(name) {
        this.name = name;
    };


    getVisibleRooms() {
        for (let i in Game.rooms) {
            console.log(Game.rooms[i].name);
        };
    };


    static create(name) {
        return new Empire(name);
    };
    

};
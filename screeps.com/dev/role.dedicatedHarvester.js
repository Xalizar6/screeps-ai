"use strict"; // Declaring Strict Mode to enforce better coding standards

var myFunctions = require('helper_myFunctions');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // Declare variables
        var source

        // Locate the source
        source = Game.getObjectById("5982fc6bb097071b4adbd5f7")
        
        // Call the function to harvest energy
        myFunctions.harvestEnergy(creep, source)
    }

};
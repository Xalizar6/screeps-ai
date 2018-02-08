"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = {

    listCreeps: function () {
        for (let item in Game.creeps) {
            console.log(item + "    " + Game.creeps[item].memory.role + "   " + Game.creeps[item].ticksToLive)
        };
    },


};
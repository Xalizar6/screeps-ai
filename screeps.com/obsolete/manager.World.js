"use strict"; // Declaring Strict Mode to enforce better coding standards

const roomManager = require('manager.Room');

module.exports = {
        run: function () {    
            console.log("This is where I call the Room Manager logic for specific rooms.")
            for (let i in Game.rooms) {
                let room = Game.rooms[i];
                if (room.controller && room.controller.owner.username == "Xalizar" && room.controller.level > 2) {
                    roomManager.run(room, "growEconomy");
                };
            };
            
        }
};
"use strict"; // Declaring Strict Mode to enforce better coding standards

console.log("Running Proto Manager World");

// Create the new World Manager Object
    // function WorldManager() {};
    // var WorldManager1 = new WorldManager();

// Create a Run method of the World Manager Object
WorldManager.prototype.run = function() {
    console.log("This is where I call the Run method of the World Manager Object to generate logic for specific rooms.");
    for (let i in Game.rooms) {
        let room = Game.rooms[i];
        if (room.controller && room.controller.owner.username == "Xalizar" && room.controller.level > 2) {
            RoomManager.run(room, "growEconomy");
        };
    };
};
"use strict"; // Declaring Strict Mode to enforce better coding standards

// Create the new World Manager Object
var RoomManager = {};

RoomManager.run = function (room, currentMission) {
    if (currentMission = "growEconomy") {
        console.log("This is where I call the Task Manager logic for room: " + room.name);
        TaskManager.run(room);
    };
};
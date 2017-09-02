"use strict"; // Declaring Strict Mode to enforce better coding standards

//Included module files, executed on new global creation every 10 seconds or so.
const taskGatherEnergy = require('task.GatherEnergy');

module.exports = {
    run: function (room, currentMission) {
        if (currentMission = "growEconomy") {
            console.log("This is where I call the Task Manager logic for room: " + room.name);
            taskGatherEnergy.run(room);
        };
    }

};
"use strict"; // Declaring Strict Mode to enforce better coding standards

// Run the prototype extensions as necessary
    const startProto = Game.cpu.getUsed();
    console.log("Start - Including prototypes")
    
    // @ts-ignore
    require('proto.creep');
    // @ts-ignore
    require('proto.Manager_Room');
    // @ts-ignore
    require('proto.Manager_Task');
    // @ts-ignore
    require('proto.Manager_World');
    // @ts-ignore
    require('proto.room');
    // @ts-ignore
    require('proto.source');

    console.log("Done - Including prototypes, it took: " + (Game.cpu.getUsed() - startProto) + " CPU Time");

 
// Included module files, executed on new global creation every 10 seconds or so.
    const startModules = Game.cpu.getUsed();
    console.log("Start - Including modules")
    
    // const worldManger = require('manager.World');

    console.log("Done - Including modules, it took: " + (Game.cpu.getUsed() - startModules) + " CPU Time");


// This loop is executed every tick.
module.exports.loop = function () { 

    // Create the new World Manager Object
        // var WorldManager1 = new WorldManager();

    // Declare variables

        
    // Run the World Manager logic
        console.log("This is where I call the World Manager logic for all of the rooms.");
        // WorldManager1.run();
        var x = require('proto.Manager_World');

    // console.log("Total CPU Time used: " + Game.cpu.getUsed());

}
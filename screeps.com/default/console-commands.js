//shows the roles and time to live of all of my creeps
    for ( i in Game.creeps ) { console.log(Game.creeps[i].name + " " + Game.creeps[i].memory.role + " " + Game.creeps[i].ticksToLive ) }

// Shows the names of all of my creeps ToDO: Working?
    for ( i in Game.creeps ) { console.log(Game.creeps[i] ) };

// Kills all of my creeps for testing ToDO: Working?
    for ( i in Game.creeps ) { Game.creeps[i].suicide() };

// Shows the names of all of my spawns
    for ( i in Game.spawns) { console.log(Game.spawns[i]); }

// Shows the ID of all of my structures
    for( i in Game.structures ) { console.log(Game.structures[i]); }

// Shows the ID of all of my structures
    for ( i in Game.RoomObject ) { console.log(Game.RoomObject[i]); }

// Shows all construction sites
for ( i in Game.constructionSites ) { console.log(Game.constructionSites[i]); }

// Shows the size of the construction sites hash
    _.size(Game.constructionSites)

// Show the closest Resource by path
    Game.creeps.Ellie.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

// CPU Properties
    Game.cpu.limit
    Game.cpu.tickLimit
    Game.cpu.bucket

//Recursive Object reference: https://stackoverflow.com/questions/2549320/looping-through-an-object-tree-recursively
function eachRecursive(obj) {
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
            eachRecursive(obj[k]);
        }
        else {
            console.log(obj[k])
        }
    }
}
eachRecursive(Game.creeps)

_.forOwn(Game.creeps, function(value,key) {console.log("Key: " + key, "Value: " + value)})
_.forOwn(Memory.creeps, function(value,key) {console.log("Key: " + key, "Value: " + value)})


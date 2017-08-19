//shows the roles and time to live of all of my creeps
for ( i in Game.creeps ) { console.log(Game.creeps[i].name + " " + Game.creeps[i].memory.role + " " + Game.creeps[i].ticksToLive) }

// Shows the names of all of my creeps
    for ( i in Game.creeps ) { console.log(Game.creeps[i]); }

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
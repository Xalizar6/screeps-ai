// Shows the names of all of my creeps
    for ( i in Game.creeps ) { console.log(Game.creeps[i]); }

//shows the time to live of all of my creeps
    for ( i in Game.creeps ) { console.log(Game.creeps[i].name + " " + Game.creeps[i].ticksToLive) }

//shows the roles of all of my creeps
    for ( i in Game.creeps ) { console.log(Game.creeps[i].name + " " + Game.creeps[i].memory.role) }

// Shows the names of all of my spawns
    for ( i in Game.spawns) { console.log(Game.spawns[i]); }

// Shows the ID of all of my structures
    for( i in Game.structures ) { console.log(Game.structures[i]); }

// Shows the ID of all of my structures
    for ( i in Game.RoomObject ) { console.log(Game.RoomObject[i]); }

// Show the closest Resource by path
    Game.creeps.Ellie.pos.findClosestByPath(FIND_SOURCES)
    Game.creeps.Ellie.pos.find(FIND_SOURCES)

Game.creeps.David.room.find(FIND_SOURCES_ACTIVE)
for(const i in Game.creeps) { Game.creeps[i].name }
for (x in Game.creeps) {console.log(Game.creeps[x]); break;}
for (x in Game.creeps) { Game.creeps[x].room.find(FIND_SOURCES_ACTIVE) }
for (x in Game.creeps) { console.log(Game.creeps[x].room.find(FIND_SOURCES_ACTIVE)) }
for (x in Game.creeps) { console.log(Game.creeps[x].room.find(FIND_SOURCES_ACTIVE)); break;}
var blah = for (x in Game.creeps) { Game.creeps[x].room.find(FIND_SOURCES_ACTIVE); break;}


console.log(Memory.creeps.Aubrey.role);

Game.cpu.limit
Game.cpu.tickLimit
Game.cpu.bucket
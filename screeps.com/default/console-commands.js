// dedicatedHarvester Creep spawn code
    Game.spawns['Spawn1'].createCreep([WORK,WORK,MOVE,MOVE], "Lenny", {role: 'dedicatedHarvester'});

//shows the roles and time to live of all of my creeps
    for ( let key in Game.creeps ) { console.log(key + " " + Game.creeps[key].memory.role + " " + Game.creeps[key].ticksToLive ) }
    
// Shows the names of all of my creeps
    for ( let key in Game.creeps ) { console.log("Key: " + key + "      " + "Value: " + Game.creeps[key] ) };

// Shows the names of all of my spawns
for ( let key in Game.spawns) { console.log("Key: " + key + "       " + "Spawn: " + Game.spawns[key]); }

// Shows the names of all of my visible rooms
for ( let i in Game.rooms) { console.log(Game.rooms[i]); }

// Kills all of my creeps for testing ToDO: Working?
    for ( let i in Game.creeps ) { Game.creeps[i].suicide() };

// Shows the ID of all of my structures
    for( let i in Game.structures ) { console.log(Game.structures[i]); }

// Shows all construction sites
for ( let i in Game.constructionSites ) { console.log(Game.constructionSites[i]); }

// Shows the size of the construction sites hash
    _.size(Game.constructionSites)

// Show the closest Resource by path
    Game.creeps.Ellie.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

// CPU Properties
    Game.cpu.limit
    Game.cpu.tickLimit
    Game.cpu.bucket

// Find my storage object
    Game.spawns['Spawn1'].room.storage
    
    const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });

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

// Finding storage to put energy away  
    var creep = Game.creeps.Noah;
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity;;
        }
    });
    console.log(targets);
    console.log(targets.length);

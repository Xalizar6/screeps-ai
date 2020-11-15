// @ts-nocheck

/* global _ */

// Working with Objects and properties.
// show all of the keys of the global object
Object.keys(global)

// Recursive Object reference: https://stackoverflow.com/questions/2549320/looping-through-an-object-tree-recursively
function eachRecursive (obj) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      eachRecursive(obj[k]);
    } else {
      console.log(obj[k])
    }
  }
}
eachRecursive(Game.creeps)

_.forOwn(Game.creeps, function (value, key) {
  console.log("Key: " + key, "Value: " + value)
})

_.forOwn(Memory.creeps, function (value, key) {
  console.log("Key: " + key, "Value: " + value)
})

_.forEach(energyHistory, function (daily) {
  for (const key in daily) {
    if (daily.hasOwnProperty(key)) {
      console.log(key + ': ' + daily[key])
    }
  }
})

// shows the roles and time to live of all of my creeps
for (let key in Game.creeps) {
  console.log(key + " " + Game.creeps[key].memory.role + " " + Game.creeps[key].ticksToLive)
}

// Shows the names of all of my creeps
for (let key in Game.creeps) {
  console.log("Key: " + key + "      " + "Value: " + Game.creeps[key])
};

// Shows the names of all of my spawns
for (let key in Game.spawns) {
  console.log("Key: " + key + "       " + "Spawn: " + Game.spawns[key]);
}

// Shows the names of all of my visible rooms
for (let i in Game.rooms) {
  console.log(Game.rooms[i]);
}

// Kills all of my creeps for testing ToDO: Working?
for (let i in Game.creeps) {
  Game.creeps[i].suicide()
};

// Shows the ID of all of my structures
for (let i in Game.structures) {
  console.log(Game.structures[i]);
}

// Shows all construction sites
for (let i in Game.constructionSites) {
  console.log(Game.constructionSites[i]);
}

// Shows the size of the construction sites hash
_.size(Game.constructionSites)

// Show the closest Resource by path
Game.creeps.Ellie.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

// Convert a return value of a call to the Key Name / Constant Name / Text rather than integer
// Reference: https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue (object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// Return the key from the global object for a specific value
Object.keys(global).find(k => global[k] === -1)

// CPU Properties
Game.cpu.limit
Game.cpu.tickLimit
Game.cpu.bucket

// Find my storage object
Game.spawns['Spawn1'].room.storage

const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
  filter: {
    structureType: STRUCTURE_EXTENSION
  }
});

var oSpawn1 = Game.spawns["Spawn1"];
var aExtensions = oSpawn1.room.find(FIND_MY_STRUCTURES, {
  filter: {
    structureType: STRUCTURE_EXTENSION
  }
});
for (let key in aExtensions) {
  console.log(key + "   " + aExtensions[key].energy)
};
var aExtensions = _.filter(aExtensions, function (extension) {
  return extension.energy == 0
});
for (let key in aExtensions) {
  console.log(key + "   " + aExtensions[key].energy)
};

//for (let key in aExtensionsToFill) {console.log(key + "   " + aExtensionsToFill[key])};


var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');


var sName = "";
var oCreep = Game.creeps[sName];
typeof oCreep

// Room visuals
new RoomVisual('W36N18').text("Target💥", 1, 1, {
  color: 'green',
  font: 0.8
});

// Display all of the room properties
for (let key in Game.rooms) {
  console.log(key + "    " + Game.rooms[key].name);
  console.log(key + "    " + Game.rooms[key].controller);
  console.log(key + "    " + Game.rooms[key].energyAvailable);
  console.log(key + "    " + Game.rooms[key].energyCapacityAvailable);
  console.log(key + "    " + Game.rooms[key].memory);
  console.log(key + "    " + Game.rooms[key].storage);
}

// Put my source IDs in memory
var oSpawn1 = Game.spawns["Spawn1"];
let aSources = oSpawn1.room.find(FIND_SOURCES);
for (let i in aSources) {
  console.log(aSources[i].id)
};

// Array of objects to repair
const targets = creep.room.find(FIND_STRUCTURES, {
  filter: object => object.hits < object.hitsMax
});

targets.sort((a, b) => a.hits - b.hits);

if (targets.length > 0) {
  if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
    creep.moveTo(targets[0]);
  }
}



var oSpawn1 = Game.spawns["Spawn1"];
var blah = oSpawn1.room.find(FIND_STRUCTURES, {
  filter: (structure) => {
    return (structure.structureType == STRUCTURE_ROAD) && structure.hits < 5000
  }
});
blah.sort((a, b) => a.hits - b.hits);
console.log(blah);


var x = new [];
x.push(WORK)


a = Game.getObjectById('5982fc6bb097071b4adbd5f7');
for (let x in a) {
  console.log(x)
};
a.memory = 'test'

Game.creeps.Keira.room.sources
Game.creeps.Audrey.suicide()
Game.rooms.E7N59.memory.sources
Game.rooms.E7N59.
Game.spawns["Spawn1"].spawning
Game.spawns["Spawn1"].spawning.remainingTime
cc.lc()

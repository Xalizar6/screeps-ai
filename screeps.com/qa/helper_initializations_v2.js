'use strict' // Declaring Strict Mode to enforce better coding standards

/* global FIND_STRUCTURES STRUCTURE_CONTAINER FIND_SOURCES FIND_MINERALS FIND_MY_STRUCTURES STRUCTURE_EXTRACTOR */

// Purpose:

// Logic:
//  Initialize global console commands.
//  Initialize Room Level Memory

// Declare Variables
const consoleCommands = require('./helper_consoleCommands')
const log = require('./helper_logging')
const oRoom = Game.spawns['Spawn1'].room
const arrayOfContainers = oRoom.find(FIND_STRUCTURES, {
  filter: (s) => s.structureType === STRUCTURE_CONTAINER
})
const debug = false

module.exports = {

  initConsoleCommands: function () {
    // @ts-ignore
    global.cc =
      consoleCommands // Make my consoleCommands available globally via the console with cc alias.
  },

  initMemory: function () {
    log.output('Info', 'Begin - Initializing Memory', true)
    const timer = Game.cpu.getUsed()

    // Add construction tracking property to Room memory.
    fAddConstructionValueToMemory()

    // Add Energy sources in the room to memory
    // TODO: Convert mineral hauler to use room properties for the source and container rather than the source
    //      in memory then retire this function.
    fAddSourcesToMemoryV2()

    // Add Minerals in the room to memory
    // 11/20/2019 [DR]: storing by extending the prototypes instead
    // fAddMineralsToMemory()

    log.output('Info', 'Initializing Memory took: ' + (Game.cpu.getUsed() -
      timer).toFixed(2) + ' CPU Time', false, true)
    log.output('Info', 'End - Initializing Memory')
  }

}

// Add all of the sources in a room to the Room object in memory
const fAddSourcesToMemoryV2 = function () {
  if (debug) {
    log.output('Info', 'Begin - Adding Energy sources to Room Memory', true)
    var timer = Game.cpu.getUsed()
  };

  // Declare Variables
  const arrayOfEnergySources = oRoom.find(FIND_SOURCES)

  if (oRoom.memory.sources) {
    delete oRoom.memory.sources
    oRoom.memory.sources = {}
  } else {
    oRoom.memory.sources = {}
  };

  arrayOfEnergySources.forEach(function (oSource, nIndex) {
    // Create the memory object for each source.
    if (!oRoom.memory.sources[oSource.id]) {
      oRoom.memory.sources[oSource.id] = {}
      // Store the nearby container in memory to be referenced by the Harvester and Hauler
      if (arrayOfContainers.length > 0) {
        arrayOfContainers.forEach(function (oContainer) {
          // Will find a container within 1 space of the energy source.
          if (oContainer.pos.isNearTo(oSource)) {
            oRoom.memory.sources[oSource.id].containerID = oContainer.id
          };
        })
      };
    };
  })

  if (debug) {
    log.output('Info', 'Adding Energy sources to Room Memory took: ' + (Game
      .cpu.getUsed() - timer).toFixed(2) + ' CPU Time', false, true)
    log.output('Info', 'End - Adding Energy sources to Room Memory')
  };
}

// Add all of the mineral locations in a room to the Room object in memory
// TODO: Retire this function
const fAddMineralsToMemory = function () {
  if (debug) {
    log.output('Info', 'Begin - Adding Minerals to Room Memory', true)
  };
  if (debug) {
    var timer = Game.cpu.getUsed()
  };

  // Declare Variables
  const arrayOfMinerals = oRoom.find(FIND_MINERALS)
  const arrayOfExtractors = oRoom.find(FIND_MY_STRUCTURES, {
    filter: {
      structureType: STRUCTURE_EXTRACTOR
    }
  })

  if (arrayOfMinerals.length > 0) {
    if (!oRoom.memory.minerals) {
      oRoom.memory.minerals = {}
    };

    arrayOfMinerals.forEach(function (oMineral, nIndex) {
      if (!oRoom.memory.minerals[nIndex]) {
        oRoom.memory.minerals[nIndex] = {}
      };

      if (!oRoom.memory.minerals[nIndex].id) {
        oRoom.memory.minerals[nIndex].id = oMineral.id
      };

      // Store the Extractor ID that is built on the Mineral Source in Memory so we can monitor the cooldown timer.
      if (arrayOfExtractors.length > 0) {
        arrayOfExtractors.forEach(function (oExtractor) {
          if (oExtractor.pos === oMineral.pos) {
            oRoom.memory.minerals[nIndex].extractorID = oExtractor.id
          };
        })
      };

      // Store the nearby container in memory to be referenced by the Harvester and Hauler
      if (arrayOfContainers.length > 0) {
        arrayOfContainers.forEach(function (oContainer) {
          // Will find a container within 1 space of the mineral
          if (oContainer.pos.isNearTo(oMineral)) {
            oRoom.memory.minerals[nIndex].containerID = oContainer.id
          };
        })
      };
    })
  };

  if (debug) {
    log.output('Info', 'Adding Minerals to Room Memory took: ' + (Game.cpu
      .getUsed() - timer).toFixed(2) + ' CPU Time', false, true)
  };
  if (debug) {
    log.output('Info', 'End - Adding Minerals to Room Memory')
  };
}

const fAddConstructionValueToMemory = function () {
  if (!oRoom.memory.construction) {
    oRoom.memory.construction = {}
  };
}

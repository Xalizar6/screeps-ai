/* eslint-disable no-undef */
// @ts-nocheck

// Opening logging for a function / module
let timer = null
if (debug) {
  log.output('Debug', 'Begin - ' + moduleName + ' moving function for ' + creep.name, true)
  timer = Game.cpu.getUsed()
}
// Closing logging for a function / module
if (debug) {
  log.output('Debug', moduleName + ' moving function took: ' + (Game.cpu.getUsed() - timer) +
    ' CPU Time', false, true)
  log.output('Debug', 'End - ' + moduleName + ' moving function')
}

// Debug logging for function development
if (debug) {
  log.output('Debug', 'target = ' + target, false, true)
}

'use strict' // Declaring Strict Mode to enforce better coding standards
/* global _ OK RESOURCE_UTRIUM ORDER_BUY RESOURCE_ENERGY  */

// const _ = require( 'lodash' );
const log = require('./helper_logging')
const debug = false // Turn logging for this module on and off
const moduleName = 'Market Code'
const myFunctions = require('./helper_myFunctions')

module.exports = {

  run: function () {
    let timer = null
    if (debug) {
      log.output('Debug', 'Begin - ' + moduleName + ' run routine.', true)
      timer = Game.cpu.getUsed()
    };

    const myRooms = _.filter(Game.rooms, r => r.controller && r.controller.my)
    if (myRooms[0].terminal && myRooms[0].terminal.store[RESOURCE_ENERGY] > 1000 && myRooms[0].terminal.store[RESOURCE_UTRIUM] > 1000) {
      runSellUtrium(myRooms[0])
      //   runSellOxygen(myRooms[0])
    };

    if (debug) {
      log.output('Debug', moduleName + ' run routine took: ' + (Game.cpu.getUsed() - timer).toFixed(2) + ' CPU Time',
        false, true)
      log.output('Debug', 'End - ' + moduleName + ' run routine', false, true)
    };
  }
}

const runSellUtrium = function (myRoom) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Sell Utrium routine', true)
    timer = Game.cpu.getUsed()
  }

  let buyOrders = Game.market.getAllOrders({
    type: ORDER_BUY,
    resourceType: RESOURCE_UTRIUM
  })
  buyOrders = _.sortByOrder(buyOrders, 'price', 'desc')
  let bestDeal = null
  let bestMargin = 0
  const terminal = myRoom.terminal
  const avgUtriumCost = getTwoDayAvgUtriumCost()
  let orderSize = null
  let result = null

  _.forEach(buyOrders, function (order) {
    if (order.price >= avgUtriumCost) {
      if (order.amount > terminal.store[RESOURCE_UTRIUM]) {
        orderSize = terminal.store[RESOURCE_UTRIUM]
      } else {
        orderSize = order.amount
      }

      const avgEnergyCost = getTwoDayAvgEnergyCost()
      const transactionCost = Game.market.calcTransactionCost(orderSize, myRoom.name, order.roomName)
      const sellValue = orderSize * order.price
      const valueOfEnergy = transactionCost * avgEnergyCost
      const profit = sellValue - valueOfEnergy
      const margin = profit / sellValue * 100

      if (margin > bestMargin) {
        bestMargin = margin
        bestDeal = order

        if (debug) {
          log.output('Debug', 'Order id: ' + order.id, true, true)
          log.output('Debug', 'Room Name: ' + bestDeal.roomName, false, true)
          log.output('Debug', 'Resource Type: ' + myFunctions.getGlobalKeyByValue(order.resourceType), false, true)
          log.output('Debug', 'Order amount: ' + order.amount, false, true)
          log.output('Debug', 'Sell Amount: ' + orderSize + ' units', false, true)
          log.output('Debug', 'Order price: ' + order.price, false, true)
          log.output('Debug', 'Sell Value: ' + sellValue + ' credits', false, true)
          log.output('Debug', 'Average Utrium price: ' + avgUtriumCost.toFixed(3), false, true)
          log.output('Debug', 'Average Energy price: ' + avgEnergyCost.toFixed(3), false, true)
          log.output('Debug', 'Transaction Energy Cost: ' + transactionCost + ' energy', false, true)
          log.output('Debug', 'Transaction Cost: ' + valueOfEnergy.toFixed(2) + ' credits', false, true)
          log.output('Debug', 'Profit: ' + profit.toFixed(2), false, true)
          log.output('Debug', 'Margin: ' + margin.toFixed(2), false, true)
        };
      };
    };
  })

  if (bestDeal) {
    if (debug) {
      log.output('Debug', 'Best deal: ' + bestDeal.id + ' ' + bestDeal.resourceType + ' ' + bestDeal.amount + ' ' + bestDeal.price + ' ' +
        bestDeal.roomName, true, true)
    };

    if (bestMargin > 25 && !terminal.cooldown) {
      result = Game.market.deal(bestDeal.id, orderSize, myRoom.name)
      if (result === OK) {
        log.output('Event', 'Status: Terminal selling resources based on the best deal at ' + bestMargin.toFixed(2) + '% margin', true,
          true)
      }
    } else {
      if (debug) {
        log.output('Debug', 'Status: Not selling due to margins too low or on cooldown, return value was ' + myFunctions
          .getGlobalKeyByValue(result), true, true)
      };
    };
  };

  /*
      _.forEach( myRooms, function ( room ) {
          let terminal = room.terminal;
          if ( terminal && !terminal.cooldown && terminal.store.energy ) {
              // Game.market.deal( buyOrders[0].id, terminal.store.energy / 2, room.name )
          }
      } )

  */

  if (debug) {
    log.output('Debug', moduleName + ' Sell Utrium routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Sell Utrium routine', false, true)
  }
}

function getTwoDayAvgEnergyCost () {
  const energySaleHistory = Game.market.getHistory(RESOURCE_ENERGY)
  const todaySaleHistory = energySaleHistory[energySaleHistory.length - 1]
  const yesterdaySaleHistory = energySaleHistory[energySaleHistory.length - 2]
  const twoDayAvgPrice = (yesterdaySaleHistory.avgPrice + todaySaleHistory.avgPrice) / 2
  return twoDayAvgPrice
}

function getTwoDayAvgUtriumCost () {
  const utriumSaleHistory = Game.market.getHistory(RESOURCE_UTRIUM)
  const todaySaleHistory = utriumSaleHistory[utriumSaleHistory.length - 1]
  const yesterdaySaleHistory = utriumSaleHistory[utriumSaleHistory.length - 2]
  const twoDayAvgPrice = (yesterdaySaleHistory.avgPrice + todaySaleHistory.avgPrice) / 2
  return twoDayAvgPrice
}

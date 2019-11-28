"use strict"; // Declaring Strict Mode to enforce better coding standards

// const _ = require( 'lodash' );
const log = require('./helper_logging');
const debug = false; // Turn logging for this module on and off


module.exports = {

  run: function () {
    if (debug) {
      log.output('Debug', 'Begin - Market Code run routine', true, true)
    };
    const timer = Game.cpu.getUsed();

    const myRooms = _.filter(Game.rooms, r => r.controller && r.controller.my);
    if (myRooms[0].terminal && myRooms[0].terminal.store[RESOURCE_ENERGY] > 1000 && myRooms[0].terminal.store[
        RESOURCE_OXYGEN] > 1000) {
      runSellOxygen(myRooms[0]);
    };

    if (debug) {
      log.output('Debug', 'Market Code run routine took: ' + (Game.cpu.getUsed() - timer).toFixed(2) + ' CPU Time',
        false, true)
    };
    if (debug) {
      log.output('Debug', 'End - Market Code run routine', false, true)
    };

  },

};

const runSellOxygen = function (myRoom) {

  if (debug) {
    log.output('Debug', 'Begin - runSellOxygen routine for ' + myRoom.name, false, true)
  };
  const timer = Game.cpu.getUsed();

  let terminal = myRoom.terminal;
  let buyOrders = Game.market.getAllOrders({
    resourceType: RESOURCE_OXYGEN,
    type: ORDER_BUY
  });
  // let sbo = _.sortByOrder( buyOrders, ['price'], ['desc'] );
  let sellAmount = 1000;
  let bestDeal = null;
  let bestMargin = 0;

  /*
      for ( let i = 0; i < 5; i++ ) {
          if ( debug ) {
              let sellAmount = 1000;
              let transactionCost = Game.market.calcTransactionCost( sellAmount, myRoom.name, sbo[i].roomName );
              let sellValue = sellAmount * sbo[i].price;
              let valueOfEnergy = transactionCost * 0.02;
              let profit = sellValue - valueOfEnergy;
              let margin = profit / sellValue * 100;
              log.output( 'Debug', sbo[i].id + " " + sbo[i].resourceType + " " + sbo[i].amount + " " + sbo[i].price, true, true )
              log.output( 'Debug', "Sell Amount: " + sellAmount + " units", false, true );
              log.output( 'Debug', "Sell Value: " + sellValue + " credits", false, true );
              log.output( 'Debug', "Transaction Energy Cost: " + transactionCost + " energy", false, true );
              log.output( 'Debug', "Transaction Cost: " + valueOfEnergy + " credits", false, true );
              log.output( 'Debug', "Profit: " + profit, false, true );
              log.output( 'Debug', "Margin: " + margin, false, true );
          };
      };
  */

  _.forEach(buyOrders, function (order) {

    if (order.amount >= 1000) {

      let transactionCost = Game.market.calcTransactionCost(sellAmount, myRoom.name, order.roomName);
      let sellValue = sellAmount * order.price;
      let valueOfEnergy = transactionCost * 0.02;
      let profit = sellValue - valueOfEnergy;
      let margin = profit / sellValue * 100;

      if (margin > bestMargin) {
        bestMargin = margin;
        bestDeal = order;

        if (debug) {
          log.output('Debug', order.id + " " + order.resourceType + " " + order.amount + " " + order.price + " " +
            bestDeal.roomName, true, true);
          log.output('Debug', "Sell Amount: " + sellAmount + " units", false, true);
          log.output('Debug', "Sell Value: " + sellValue + " credits", false, true);
          log.output('Debug', "Transaction Energy Cost: " + transactionCost + " energy", false, true);
          log.output('Debug', "Transaction Cost: " + valueOfEnergy + " credits", false, true);
          log.output('Debug', "Profit: " + profit, false, true);
          log.output('Debug', "Margin: " + margin.toFixed(2), false, true);
        };

      };
    };

  });

  if (bestDeal != null) {
    // @ts-ignore
    if (debug) {
      log.output('Debug', "Best deal: " + bestDeal.id + " " + bestDeal.resourceType + " " + bestDeal.amount + " " +
        bestDeal.price + " " + bestDeal.roomName, true, true)
    };

    if (bestMargin > 80 && !terminal.cooldown) {
      log.output('Event', "Terminal selling resources based on the best deal at " + bestMargin.toFixed(2) +
        "% margin", true, true);
      // @ts-ignore
      Game.market.deal(bestDeal.id, sellAmount, myRoom.name)
    } else {
      if (debug) {
        log.output('Debug', "Not selling due to margins too low or on cooldown", true, true)
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
    log.output('Debug', 'runSellOxygen routine took: ' + (Game.cpu.getUsed() - timer).toFixed(2) + ' CPU Time', false,
      true)
  };
  if (debug) {
    log.output('Debug', 'End - runSellOxygen routine for ' + myRoom.name, false, true)
  };

};

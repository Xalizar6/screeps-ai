module.exports = {

     /** @param {Creep} creep **/
     run: function(creep) {
        // creep.moveTo(36,44)
        var source = Game.getObjectById("5982fc6bb097071b4adbd5f7")
        creep.harvest(source)

     }
};
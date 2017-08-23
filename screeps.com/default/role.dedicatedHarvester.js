module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var oSource = Game.getObjectById("5982fc6bb097071b4adbd5f7")

        if (creep.harvest(oSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(oSource, {visualizePathStyle: {stroke: '#f2f210'}});
        }
    }
};
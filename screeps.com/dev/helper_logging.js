"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = {

    info: function (info) {
        console.log('Info[' + Game.time + ']: ' + info);
    },

    warning: function (warning) {
        console.log('Warning[' + Game.time + ']: ' + warning);
    },

    error: function (error) {
        console.log('Error[' + Game.time + ']: ' + error);
    }

};
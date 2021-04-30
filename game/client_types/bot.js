/**
 * # Bot type implementation of the game stages
 * Copyright(c) 2021 Can Celebi <cnelebi@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setDefaultCallback(function() {
        this.node.timer.randomDone();
    });

    stager.extendStep('identifyRace', {

        init: function() {

        },

        cb: function() {

        },

        done: function() {

        }

    });

    stager.extendStep('solveDisagreement', {

        init: function() {

        },

        cb: function() {

        },

        done: function() {

        }

    });


};

/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2021 Can Celebi <cnelebi@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {


        node.game.nameList = [
            'Hande Altun',
            'Elif Okan',
            'Isil Sansoy',
            'Ali Somer',
            'Merve Alici',
            'Ezgi Basak',
            'Emre Guz',
            'Ozgur Tabakci',
            'Emrecan Sarisayin',
            'Murat Ulutin'
        ]


        node.game.shuffledNameList = J.shuffle(node.game.nameList);


        node.on('get.nameList', function(msg) {
            return J.shuffle(node.game.nameList);
        })


    });

    stager.extendStep('instructions', {

        cb: function() {
            console.log('Instructions.');
        }

    });

    stager.extendStep('identifyRace', {
        init: function() {

            console.log();
            console.log();
            console.log('****************************');
            console.log('****************************');
            console.log('******* IDENTIFY RACE ******');
            console.log('****************************');
            console.log('****************************');
            console.log();
            console.log();

        },

        cb: function() {

        },

        done: function() {

        }

    });

    stager.extendStep('solveDisagreement', {

        init: function() {

            console.log();
            console.log();
            console.log('****************************');
            console.log('****************************');
            console.log('**** SOLVE DISAGREEMENT ****');
            console.log('****************************');
            console.log('****************************');
            console.log();
            console.log();

        },

        cb: function() {

        },

        done: function() {

        }

    });

    stager.extendStep('end', {

        cb: function() {
            node.game.memory.save('data.json');
        }

    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};

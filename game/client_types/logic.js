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


        console.log();
        console.log();
        console.log('****************************');
        console.log('****************************');
        console.log('******** SET ON INIT *******');
        console.log('****************************');
        console.log('****************************');
        console.log();
        console.log();



        // Some random names for now
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

        // Initialize any player specific variable
        node.game.initializePlayer = function() {

            node.game.pl.each(function(player) {

                player.numberOfNamesEvaluated = 0;
                player.shuffledNameList = J.shuffle(node.game.nameList);
                player.evaluationList = Array(node.game.nameList.lenght).fill(-1);

            })

        }

        // Listener ready to send the shuffles name list to clients
        node.on('get.nameList', function(msg) {

            let myData = [];

            let player = node.game.pl.get(msg.from);

            let counter = player.numberOfNamesEvaluated;
            let list = player.shuffledNameList;

            myData = [list, counter];

            return myData

        })


        // WHITE EVALUATION
        // Listener that tracks the number of names evaluated
        // and the evaluation of the respective name
        node.on.data('whiteNameLOGIC', function(msg) {

            let player = node.game.pl.get(msg.from);
            let counter = player.numberOfNamesEvaluated;

            // 0 for evaluating a name as white
            player.evaluationList[counter] = 0;
            player.numberOfNamesEvaluated += 1;

        })

        // BLACK EVALUATION
        // Listener that tracks the number of names evaluated
        // and the evaluation of the respective name
        node.on.data('blackNameLOGIC', function(msg) {

            let player = node.game.pl.get(msg.from);
            let counter = player.numberOfNamesEvaluated;

            // 0 for evaluating a name as white
            player.evaluationList[counter] = 1;
            player.numberOfNamesEvaluated += 1;

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

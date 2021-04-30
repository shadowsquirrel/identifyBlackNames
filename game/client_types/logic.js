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

    const NOS = settings.numberOfSubjects;

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

                player.indexOfNextNameToEvaluate = 0;
                player.shuffledNameList = J.shuffle(node.game.nameList);
                // below is for debug use the commented above for randomization
                // player.shuffledNameList = node.game.nameList;
                player.evaluationList = Array(node.game.nameList.lenght).fill(-1);
                player.unmatchedNamesList = undefined;

            })

        }

        node.game.initializePlayer();


        // DEBUG
        node.game.pl.each(function(player) {
            // console.log(player.shuffledNameList);
        })


        // Listener ready to send the shuffles name list to clients
        node.on('get.nameList', function(msg) {

            // console.log('LOGIC SIDE');
            // console.log('PLAYER REQUESTED NAMELIST');

            let myData = {};

            let player = node.game.pl.get(msg.from);

            // console.log('PLAYER ' + player.count);

            let index = player.indexOfNextNameToEvaluate;
            let list = player.shuffledNameList;

            myData.list = list
            myData.index = index;

            // console.log('NAMELIST TO BE SENT: ' + myData.list);
            // console.log('NAME COUNTER TO BE SENT: ' + myData.index);

            return myData

        })


        // NAME EVALUATION
        // Listener that tracks the index of the current name evaluated
        // and the evaluation of the respective name
        node.on.data('nameLOGIC', function(msg) {

            // console.log('INSIDE NAMELOGIC');
            // console.log('data: ' + msg.data);

            let player = node.game.pl.get(msg.from);
            let index = player.indexOfNextNameToEvaluate;

            // 0 for evaluating a name as white 1 for black
            player.evaluationList[index] = msg.data;
            player.indexOfNextNameToEvaluate += 1;


            // console.log(player.evaluationList);

        })



        node.game.getOrderedDecision = function() {

            node.game.pl.each(function(player) {

                var myList = player.shuffledNameList;
                var myDecisionList = player.evaluationList;
                var originalList = node.game.nameList;

                var orderedList = [];

                for(var i = 0; i < myDecisionList.length; i++) {

                    orderedList[i] = myDecisionList[myList.indexOf(originalList[i])];

                }

                player.orderedDecisionList = orderedList;


                // console.log();
                // console.log();
                // console.log('my shuffled name list');
                // console.log(myList);
                // console.log('my decision list');
                // console.log(myDecisionList);
                // console.log('initial name list');
                // console.log(originalList);
                // console.log('my decision list reordered based on original list');
                // console.log(orderedList);
                // console.log();
                // console.log();


            })


        }


        node.game.sum2Arrays = function(array1, array2) {

            var sumArray = [];

            for(var i = 0; i < array1.length; i++){
                sum.push(array1[i] + array2[i]);
            }

            return sumArray

        }

        node.game.sumArrays = function() {

            var allArrays = [];

            for(var i = 0; i < )

        }

        // TO DO
        // Figure out a way to reverse the random shuffle - DONE
        // of each player's shuffled name list - DONE
        // aggregate their results
        // identify the names that x% of the subject do not agree
        // update each players unmatchedNamesList


        // send the unmatchedNamesList to the players




        //-------- SOME DEBUG METHODS --------//
        // Identifies the player in the console
        node.game.showPlayer = function(player) {
            console.log();
            console.log('Player ' + player.count +
                        ' [' + player.clientType + ']');
        };

        // Enables logging to console from player.js
        node.on.data('debug', function(msg) {
            let player = node.game.pl.get(msg.from);
            node.game.showPlayer(player);
            console.log(msg.data);
        });


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


            node.game.getOrderedDecision();


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

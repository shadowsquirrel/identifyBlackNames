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

        // Some random correct answers for now
        node.game.correctAnswerList = [
            1,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            0,
            0
        ]

        // initialize a single player's player specific variables
        node.game.initializeSinglePlayer = function(player) {

            player.indexOfNextNameToEvaluate = 0;

            player.shuffledNameList = J.shuffle(node.game.nameList);

            player.evaluationList = Array(node.game.nameList.lenght).fill(-1);

            player.unmatchedNamesList = undefined;

            player.score = undefined;

        }

        // Initialize all players' player specific variables
        node.game.initializeAllPlayers = function() {

            node.game.pl.each(function(player) {

                node.game.initializeSinglePlayer(player);

            })

        }

        node.game.initializeAllPlayers();


        // Listener ready to send the shuffles name list to clients
        node.on('get.nameList', function(msg) {

            console.log('LOGIC SIDE');
            console.log('PLAYER REQUESTED NAMELIST');

            let myData = {};

            let player = node.game.pl.get(msg.from);

            console.log('PLAYER ' + player.count);

            let index = player.indexOfNextNameToEvaluate;
            let list = player.shuffledNameList;

            myData.list = list
            myData.index = index;

            console.log('NAMELIST TO BE SENT: ' + myData.list);
            console.log('NAME COUNTER TO BE SENT: ' + myData.index);

            return myData

        })


        // NAME EVALUATION
        // Listener that tracks the index of the current name evaluated
        // and the evaluation of the respective name
        node.on.data('nameLOGIC', function(msg) {

            console.log('INSIDE NAMELOGIC');
            console.log('data: ' + msg.data);

            let player = node.game.pl.get(msg.from);
            let index = player.indexOfNextNameToEvaluate;

            // 0 for evaluating a name as white 1 for black
            player.evaluationList[index] = msg.data;
            player.indexOfNextNameToEvaluate += 1;


            console.log(player.evaluationList);

        })


        // calculates the ordered decision of a single player
        node.game.getOrderedDecisionOfSinglePlayer = function(player) {

            var myList = player.shuffledNameList;
            var myDecisionList = player.evaluationList;
            var originalList = node.game.nameList;

            var orderedList = [];

            for(var i = 0; i < myDecisionList.length; i++) {

                orderedList[i] = myDecisionList[myList.indexOf(originalList[i])];

            }

            player.orderedDecisionList = orderedList;

            console.log();
            console.log();
            console.log('INSIDE getOrderedDecisionOfSinglePlayer');
            console.log();
            console.log();
            console.log('my shuffled name list');
            console.log(myList);
            console.log('my decision list');
            console.log(myDecisionList);
            console.log('initial name list');
            console.log(originalList);
            console.log('my decision list reordered based on original list');
            console.log(orderedList);
            console.log();
            console.log();

        }

        node.on.data('orderedDecision', function(msg) {

            let player = node.game.pl.get(msg.from);
            node.game.getOrderedDecisionOfSinglePlayer(player);

        })

        // calculates the ordered decision of all players
        node.game.getOrderedDecisionOfAllPlayers = function() {

            node.game.pl.each(function(player) {

                node.game.getOrderedDecisionOfSinglePlayer(player);

            })

        }


        node.game.calculateScoreOfSinglePlayer = function(player) {

            var orderedDecisionList = player.orderedDecisionList;
            var answerList = node.game.correctAnswerList;
            var scoreList = Array(answerList.length);

            console.log();
            console.log();
            console.log('INSIDE CALCULATE SCORE OF SINGLE PLAYER');
            console.log('ORDERED DECISION LIST: ');
            console.log(orderedDecisionList);
            console.log();
            console.log('ANSWER LIST: ');
            console.log(answerList);
            console.log();
            console.log();

            for(var i = 0; i < answerList.length; i++) {

                console.log();
                console.log('INSIDE THE SCORE CALCULATION LOOP');

                scoreList[i] = (orderedDecisionList[i] === answerList[i]);

                console.log('SCORE FOR THE ' + i + 'TH ANSWER IS ' + scoreList[i]);
                console.log();

            }

            var score = scoreList.reduce((a, b) => a + b, 0);

            console.log('TOTAL SCORE: ' + score);

            player.score = score;

        }

        node.on.data('score', function(msg) {

            console.log();
            console.log('LOGIC SIDE INSIDE REQUESTING SCORE');
            console.log();

            let player = node.game.pl.get(msg.from);

            console.log();
            console.log('GENERATING PLAYER\'S ORDERED DECISION LIST');
            console.log();

            node.game.getOrderedDecisionOfSinglePlayer(player);

            console.log();
            console.log('PLAYER\'S ORDERED DECISION IS GENERATED');
            console.log();

            console.log('PLAYER REQUESTING SCORE IS PLAYER ' + player.count);
            console.log();

            node.game.calculateScoreOfSinglePlayer(player);

            node.say('myScore', player.id, player.score)

        })


        node.game.calculateScoreOfAllPlayers = function() {

            node.game.pl.each(function(player) {

                node.game.calculateScoreOfSinglePlayer(player);

            })

        }




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

    stager.extendStep('calculateScore', {

        init: function() {

            console.log();
            console.log();
            console.log('****************************');
            console.log('****************************');
            console.log('****** CALCULATE SCORE *****');
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

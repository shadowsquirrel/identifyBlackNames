/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2021 Can Celebi <cnelebi@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;
const stepRules = ngc.stepRules;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Store reference.
    let memory = node.game.memory;

    const NOS = settings.numberOfSubjects;

    // Must implement the stages here.

    stager.setDefaultStepRule(stepRules.SOLO);

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

            player.test = 'test test test';

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

            console.log('LOGIC SIDE - GET.NAMELIST');
            console.log('PLAYER REQUESTED NAMELIST IS:');

            let myData = {};

            let player = node.game.pl.get(msg.from);

            console.log('PLAYER ' + player.count);
            console.log();

            let index = player.indexOfNextNameToEvaluate;
            let list = player.shuffledNameList;

            myData.list = list
            myData.index = index;

            console.log('NAME LIST TO BE SENT: ' + myData.list);
            console.log();
            console.log('ACTIVE NAME INDEX TO BE SENT: ' + myData.index);
            console.log();

            return myData

        })


        // NAME EVALUATION
        // Listener that tracks the index of the current name evaluated
        // and the evaluation of the respective name
        node.on.data('nameLOGIC', function(msg) {

            console.log();
            console.log();
            console.log();
            console.log('IN LOGIC SIDE, RECEIVED DECISION FROM CLIENT');
            console.log();
            console.log('INSIDE node.on.data(nameLOGIC)');
            console.log();
            console.log('data received: ' + msg.data);

            let player = node.game.pl.get(msg.from);
            let index = player.indexOfNextNameToEvaluate;

            // 0 for evaluating a name as white 1 for black
            player.evaluationList[index] = msg.data;
            player.indexOfNextNameToEvaluate += 1;

            console.log('player evaluation list updated with the new data:');
            console.log(player.evaluationList);

            console.log();
            console.log('For debugging: SENDING INDEX INFO TO CLIENT');
            node.say('activeIndexListener', player.id, index)

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

            // sending the orderedList data to client
            node.say('myOrderedList', player.id, orderedList);

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

        const GameDB = require('nodegame-client').GameDB;

        let newdb =  new GameDB({
            log: node.log,
            logCtx: node,
            shared: { node: node }
        });


        node.on.data('storeData', function(msg) {

            console.log();
            console.log('STORING PLAYER INFO IN THE DATABASE');
            console.log();

            let player = node.game.pl.get(msg.from);

            node.game.storeData(player);

        })



        node.game.storeData = function(player) {

            let myID = player.id;
            let decisionList = player.orderedDecisionList;
            let score = player.score;


            console.log('STORING DATA TO CSV');
            console.log('ID: ' + myID);
            console.log('DECISION LIST: ');
            console.log(decisionList);

            newdb.add({

                player: myID,
                stage: {stage: 1, step:1, round:10},
                Q1: decisionList[0],
                Q2: decisionList[1],
                Q3: decisionList[2],
                Q4: decisionList[3],
                Q5: decisionList[4],
                Q6: decisionList[5],
                Q7: decisionList[6],
                Q8: decisionList[7],
                Q9: decisionList[8],
                Q10: decisionList[9],
                score: score,

            })


            console.log('current newdb');
            console.log(newdb);

            newdb.save('newdbtest.csv',
            {
                header: [
                    'player',
                    'Q1',
                    'Q2',
                    'Q3',
                    'Q4',
                    'Q5',
                    'Q6',
                    'Q7',
                    'Q8',
                    'Q9',
                    'Q10',
                    'score',
                ],
                updatesOnly: true,
            });

            newdb.save('newdb.json')

            memory.add({

                player: myID,
                stage: {stage: 1, step:1, round:10},
                Q1: decisionList[0],
                Q2: decisionList[1],
                Q3: decisionList[2],
                Q4: decisionList[3],
                Q5: decisionList[4],
                Q6: decisionList[5],
                Q7: decisionList[6],
                Q8: decisionList[7],
                Q9: decisionList[8],
                Q10: decisionList[9],
                score: score,

            })


            console.log('current memory');
            console.log(memory);

            node.game.memory.save('test.csv',
            {
                header: [
                    'player',
                    'Q1',
                    'Q2',
                    'Q3',
                    'Q4',
                    'Q5',
                    'Q6',
                    'Q7',
                    'Q8',
                    'Q9',
                    'Q10',
                    'score',
                ],
                updatesOnly: true,
            });

            node.game.memory.save('test2.json')

        }

        node.on('get.playerData', function(msg) {

            let myData = {};

            let player = node.game.pl.get(msg.from);
            let myScore = player.score;
            let myOrderedList = player.orderedDecisionList;

            myData = {
                score: myScore,
                list: myOrderedList
            }

            return myData


        })


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

        // force disconnect player
        node.game.forceDisconnect = function(playerIndex) {

            let somePlayer = node.game.pl.db[playerIndex];

            console.log('****************************');
            console.log('****************************');
            console.log('Player ' + somePlayer.count +
            ' is chosen for disconnection: ');
            console.log('****************************');
            console.log('****************************');

            node.say('disconnect', somePlayer.id);

        }




    });

    stager.extendStep('instructions', {

        cb: function() {
            console.log('Instructions.');
        }

    });

    stager.extendStep('identifyRace', {

        reconnect: function(player, reconOpts) {

            console.log();
            console.log();
            console.log('*****************************');
            console.log('*****************************');
            console.log('* RECONNECTION IS ATTEMPTED *');
            console.log('*****************************');
            console.log('*****************************');
            console.log();
            console.log();

            reconOpts.activeIndex = player.indexOfNextNameToEvaluate;

            console.log('DO WE STILL HAVE THE PLAYER INFO STORED IN THE LOGIC?');
            console.log(player.indexOfNextNameToEvaluate);
            console.log(player);
            // reconOpts.cb: function(reconOpts) {
            //     console.log('INSIDE RECONNECT CALL BACK FUNCTION');
            //     node.game.counter = reconOpts.counter;
            // };
        },

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

            // force disconnect player indexed 0
            // node.game.forceDisconnect(0);

        },

        done: function() {

            node.game.memory.save('data.json');

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

        init: function() {
            console.log();
            console.log();
            console.log('****************************');
            console.log('****************************');
            console.log('*** STORE DATA IN MEMORY ***');
            console.log('****************************');
            console.log('****************************');
            console.log();
            console.log();
        },

        cb: function() {
            node.game.memory.save('data.json');
        }

    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};

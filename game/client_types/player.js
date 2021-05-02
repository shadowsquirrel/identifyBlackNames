/**
 * # Player type implementation of the game stages
 * Copyright(c) 2021 Can Celebi <cnelebi@gmail.com>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;
const stepRules = ngc.stepRules;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {


    stager.setDefaultStepRule(stepRules.SOLO);


    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;


        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);

        this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);


        // No waiting screen
        W.init({ waitScreen: false });

        // Variable to be used to store in the memory
        this.node.game.myOrderedDecisionList = [];
        this.node.game.myScore = undefined;


        //--------------------------------------------------------------------//
        //---------------------- IDENTIFY RACE STAGE -------------------------//
        //--------------------------------------------------------------------//
        //-------------- HTML LISTENERS THAT TALKS TO LOGIC ------------------//
        //--------------------------------------------------------------------//

        // name counter listener on the client side
        // triggered by html side through emit('nameEvaluated')
        // listens and reports back to logic everytime
        // a name is evaluated
        node.on('nameEvaluated', function() {
            node.say('nameEvaluatedLOGIC', 'SERVER')
        })

        // player evaluated the name as white
        // triggered by html side through emit('whiteName')
        // send this message to logic
        node.on('whiteName', function(){
            node.say('nameLOGIC', 'SERVER', 0);
        })

        // player evaluated the name as black
        // triggered by html side through emit('blackName')
        // send this message to logic
        node.on('blackName', function(){
            node.say('nameLOGIC', 'SERVER', 1);
        })

        //--------------------------------------------------------------------//
        //------------------------ GET SCORE STAGE ---------------------------//
        //--------------------------------------------------------------------//
        //-------------- HTML LISTENERS THAT TALKS TO LOGIC ------------------//
        //--------------------------------------------------------------------//

        // player request logic to calculate its score
        // triggered by html side through emit('requestScore')
        // sends this message to logic (logic only needs player id)
        node.on('requestScore', function() {
            node.say('score', 'SERVER');
        })

        // Listens Logic to retreive/store the orderedDecisionList of the client
        node.on.data('myOrderedList', function(msg) {

            this.talk('CLIENT SIDE: INSIDE node.on.data(myOrderedList)');
            this.talk('my orderedList is: ' + msg.data);

            this.node.game.orderedDecisionList = msg.data;

        })

        //--------------------------------------------------------------------//
        //--------------- GENERIC DONE WITH THE STAGE LISTENER ---------------//
        //--------------------------------------------------------------------//

        node.on('done', function() {
            this.talk('YOU ARE DONE WITH THE NAMES')
            node.done();
        })

        //--------------------------------------------------------------------//
        //---------------------- DONE AND SAVE LISTENER ----------------------//
        //--------------------------------------------------------------------//

        node.on('doneAndSave', function() {

            this.talk('CLIENT SIDE: node.on(doneAndSave)')
            this.talk('Done with the game, storing client data')


            // You can never know when the player will disconnect
            // So when the done button for the last stage is triggered
            // emit on doneAndSave is triggered which in turn request data
            // from logic side so that we can store data in the memory
            // using node.done through client side data
            node.get('playerData', function(msg) {

                this.talk('CLIENT ORDERED DECISION LIST: ' + msg.list)
                this.talk('CLIENT SCORE: ' + msg.score)

                this.node.game.myOrderedDecisionList = msg.list;
                this.node.game.myScore = msg.score;

                node.done({
                    orderedDecisionList: this.node.game.myOrderedDecisionList,
                    score: this.node.game.myScore
                });

            })


        })

        //--------------------------------------------------------------------//
        //-------------------- LISTENERS FOR DEBUGGING -----------------------//
        //--------------------------------------------------------------------//

        this.talk = function(msg){
            node.say('debug', 'SERVER', msg);
        };

        // Listens to HTML.js, reports active index
        node.on('indexWatcher', function(msg) {

            this.talk('MESSAGE FROM HTML: -> CURRENT ACTIVE INDEX: ' + msg)

        })

        // ----------------------------------------- //
        // --------- SIMULATING DISCONNECT --------- //
        // ----------------------------------------- //

        // Listener that triggers disconnect
        // Is activated from logic side
        node.on.data('disconnect', function() {

            this.talk('DISCONNECTION COMMAND RECEIVED')

            setTimeout(()=>{

                this.talk('Fake disconnection will be initiated in 5 seconds')

                setTimeout(()=>{
                    this.talk('4...')
                    setTimeout(()=>{
                        this.talk('3...')
                        setTimeout(()=>{
                            this.talk('2...')
                            setTimeout(()=>{
                                this.talk('1...')
                                setTimeout(()=>{

                                    this.talk('ACTIVE LIST INDEX: ' + this.node.game.activeIndex
                                    + '\n'
                                    + 'ACTIVE NAME TO BE EVALUATED: '
                                    + this.node.game.clientNameList[this.node.game.activeIndex])

                                    setTimeout(()=>{
                                        node.socket.reconnect();
                                    }, 1000)
                                    node.socket.disconnect();
                                    node.game.stop();
                                    // When I try to reconnect after disconnect
                                    // below commands are not executed/visited
                                    // this.talk('CHECKING IF I VISIT HERE')
                                    // node.timer.random(2000, 4000).exec(function() {
                                    //     node.socket.reconnect();
                                    // });

                                }, 1000)
                            }, 1000)
                        }, 1000)
                    }, 1000)
                }, 1000)

            }, 5000)

        })

        // Listener that triggers disconnect
        // Is activated from html debug button
        node.on('disconnectHTML', function() {

            this.talk('Fake disconnection will be initiated in 5 seconds')
            setTimeout(()=>{
                this.talk('4...')
                setTimeout(()=>{
                    this.talk('3...')
                    setTimeout(()=>{
                        this.talk('2...')
                        setTimeout(()=>{
                            this.talk('1...')
                            setTimeout(()=>{

                                this.talk('ACTIVE LIST INDEX: ' + this.node.game.activeIndex
                                + '\n'
                                + 'ACTIVE NAME TO BE EVALUATED: '
                                + this.node.game.clientNameList[this.node.game.activeIndex])

                                setTimeout(()=>{
                                    node.socket.reconnect();
                                }, 1000)
                                node.socket.disconnect();
                                node.game.stop();

                            }, 1000)
                        }, 1000)
                    }, 1000)
                }, 1000)
            }, 1000)

        })


        //--------------------------------------------------------------------//
        //-------------------- VARIABLES FOR DEBUGGING -----------------------//
        //--------------------------------------------------------------------//


        this.node.game.activeIndex = 0;
        this.node.game.clientNameList = [];

        // Listens to logic for the active index (next one?)
        node.on.data('activeIndexListener', function(msg) {

            this.talk('RECEIVED MESSAGE FROM LOGIC ON THE CURRENT INDEX')
            this.node.game.activeIndex = msg.data + 1;
            this.talk('LAST INDEX EVALUATED: ' + msg.data);
            this.talk('NEXT INDEX TO BE EVALUATED: ' + this.node.game.activeIndex);

        })

    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

    stager.extendStep('identifyRace', {

        // reconnect: function(player, reconOpts) {
        //
        //     console.log();
        //     console.log();
        //     console.log('*****************************');
        //     console.log('*****************************');
        //     console.log('* RECONNECTION IS ATTEMPTED *');
        //     console.log('*****************************');
        //     console.log('*****************************');
        //     console.log();
        //     console.log();
        //
        //     reconOpts.activeIndex = player.indexOfNextNameToEvaluate;
        //
        //     console.log('DO WE STILL PLAYER INFO IN THE LOGIC?');
        //     console.log(player.indexOfNextNameToEvaluate);
        //
        //     // reconOpts.cb: function(reconOpts) {
        //     //     console.log('INSIDE RECONNECT CALL BACK FUNCTION');
        //     //     node.game.counter = reconOpts.counter;
        //     // };
        // },


        donebutton: false,

        frame: 'identifyRace.htm',

        cb: function() {

            this.talk('CLIENT SIDE IDENTIFY RACE');
            this.talk('');
            this.talk('REQUESTING NAME LIST FROM LOGIC');
            this.talk('');

            // retrieve name list from logic
            // retrieve the name list current index (in case of disconnect)
            node.get('nameList', function(msg) {

                this.talk('NAME LIST RECEIVED: ' + msg.list)
                this.talk('NAME LIST ACTIVE INDEX RECEIVED: ' + msg.index)

                this.node.game.clientNameList = msg.list;

                node.emit('nameListHTML', msg);

            })


            // ---- SIMULATING DISCONNECT ---- //
            // setTimeout(()=>{
            //
            //     this.talk('Fake disconnection will be initiated in 5 seconds')
            //
            //
            //     setTimeout(()=>{
            //         this.talk('4...')
            //         setTimeout(()=>{
            //             this.talk('3...')
            //             setTimeout(()=>{
            //                 this.talk('2...')
            //                 setTimeout(()=>{
            //                     this.talk('1...')
            //                     setTimeout(()=>{
            //
            //                         this.talk('ACTIVE LIST INDEX: ' + this.node.game.activeIndex
            //                         + '\n'
            //                         + 'ACTIVE NAME TO BE EVALUATED: '
            //                         + this.node.game.clientNameList[this.node.game.activeIndex])
            //
            //                         setTimeout(()=>{
            //                             node.socket.reconnect();
            //                         }, 3000)
            //                         node.socket.disconnect();
            //                         node.game.stop();
            //                         // node.timer.random(2000, 4000).exec(function() {
            //                         //     node.socket.reconnect();
            //                         // });
            //
            //                     }, 1000)
            //                 }, 1000)
            //             }, 1000)
            //         }, 1000)
            //     }, 1000)
            //
            //
            //
            // }, 5000)

        }

    });

    stager.extendStep('calculateScore', {

        donebutton: false,

        frame: 'calculateScore.htm',

        cb: function() {

            // Upon request to the logic, logic returns the score of the player
            // score data is then sent to HTML
            node.on.data('myScore', function(msg) {

                // sends score data to HTML
                node.emit('myScoreHTML', msg.data);

                // now that score is calculated save everything in the memory
                node.say('storeData', 'SERVER');

            })

        }

    });

    stager.extendStep('end', {

        donebutton: false,

        frame: 'end.htm',

        cb: function() {

        }

    });
};

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

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

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
            node.say('score', 'SERVER')
        })

        //--------------------------------------------------------------------//
        //--------------- GENERIC DONE WITH THE STAGE LISTENER ---------------//
        //--------------------------------------------------------------------//

        node.on('done', function() {
            // this.talk('YOU ARE DONE WITH THE NAMES')
            node.done();
        })

        //--------------------------------------------------------------------//
        //-------------------- LISTENERS FOR DEBUGGING -----------------------//
        //--------------------------------------------------------------------//

        this.talk = function(msg){
            node.say('debug', 'SERVER', msg);
        };

        node.on('counterWatcher', function(msg) {
            this.talk('HTML COUNTER WATCHER: ' + msg)
        })

    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

    stager.extendStep('identifyRace', {

        donebutton: false,

        frame: 'identifyRace.htm',

        cb: function() {

            // this.talk('CLIENT SIDE IDENTIFY RACE')

            // retrieve name list from logic
            // retrieve the name list current index (in case of disconnect)
            node.get('nameList', function(msg) {

                // this.talk('INSIDE NODE.GET NAMELIST')
                // this.talk('NAME LIST RECEIVED: ' + msg.list)
                // this.talk('NAME LIST COUNTER RECEIVED: ' + msg.index)

                node.emit('nameListHTML', msg);

            })

        }

    });

    stager.extendStep('calculateScore', {

        donebutton: false,

        frame: 'calculateScore.htm',

        cb: function() {

            // Upon request to the logic, logic returns the score of the player
            // score data is then sent to HTML
            node.on.data('myScore', function(msg) {
                node.emit('myScoreHTML', msg.data);
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

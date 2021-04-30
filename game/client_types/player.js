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

        // name counter lister on the client side
        // listens and reports back to logic everytime
        // a name is evaluated

        node.on('nameEvaluated', function() {
            node.say('nameEvaluatedLOGIC', 'SERVER')
        })


        this.talk = function(msg){
            node.say('debug', 'SERVER', msg);
        };


        node.on('counterWatcher', function(msg) {
            this.talk('HTML COUNTER WATCHER: ' + msg)
        })


        node.on('done', function() {
            this.talk('YOU ARE DONE WITH THE NAMES')
            node.done();
        })

    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

    stager.extendStep('identifyRace', {

        donebutton: false,

        frame: 'identifyRace.htm',

        cb: function() {

            this.talk('CLIENT SIDE IDENTIFY RACE')

            // retrieve name list from logic
            // retrieve the name list counter (in case of disconnect)
            node.get('nameList', function(msg) {

                this.talk('INSIDE NODE.GET NAMELIST')

                this.talk('NAME LIST RECEIVED: ' + msg.list)
                this.talk('NAME LIST COUNTER RECEIVED: ' + msg.counter)

                node.emit('nameListHTML', msg);

            })

            // player evaluated the name as white
            // send this message to logic
            node.on('whiteName', function(){

                node.say('nameLOGIC', 'SERVER', 0);

            })

            // player evaluated the name as black
            // send this message to logic
            node.on('blackName', function(){

                node.say('nameLOGIC', 'SERVER', 1);

            })

        }

    });

    stager.extendStep('solveDisagreement', {

        donebutton: false,

        frame: 'solveDisagreement.htm',

        cb: function() {

        }

    });

    stager.extendStep('end', {

        donebutton: false,

        frame: 'end.htm',

        cb: function() {

        }

    });
};

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


    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

    stager.extendStep('identifyRace', {

        donebutton: false,

        frame: 'identifyRace.htm',

        cb: function() {

            node.get('nameList', function(msg) {
                node.emit('nameListHTML', msg.data);
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
            node.game.visualTimer.setToZero();
        }

    });
};

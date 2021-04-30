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

    stager.setOnInit(function() {


        this.node.game.botDecisionList = Array(10);

        this.node.game.constructDecision = function(option) {

            if(option === 'all black') {
                this.node.game.botDecisionList.fill(1);
            }

            if(option === 'all white') {
                this.node.game.botDecisionList.fill(0);
            }

        }

        this.node.game.makeDecision = function() {

            for(var i = 0; i < this.node.game.botDecisionList.length; i++) {

                this.node.say('nameLOGIC', 'SERVER', this.node.game.botDecisionList[i]);

            }

        }

        this.node.game.talk = function(msg){
            this.node.say('debug', 'SERVER', msg);
        };

        this.node.game.constructDecision('all black');

    });

    stager.extendStep('identifyRace', {

        init: function() {
            // this.node.game.talk('INSIDE BOT IDENTIFY RACE STEP')
            // this.node.game.talk('BOT DECISION LIST: ' + this.node.game.botDecisionList)
        },

        cb: function() {

            // this.node.game.talk('BOT IS MAKING DECISION')
            this.node.game.makeDecision();
            this.node.done();

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

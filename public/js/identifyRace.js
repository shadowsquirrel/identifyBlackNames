/**
 * # Index script for nodeGame
 * Copyright(c) 2021 Can Celebi <cnelebi@gmail.com>
 * MIT Licensed
 *
 * http://nodegame.org
 * ---
 */
window.onload = function() {

    var node = parent.node;

    let answerList = [];

    let nameList, nameCounter;

    node.on('nameListHTML', function(msg) {

        nameList = msg.data[0];
        nameCounter = msg.data[1];

        // pass the first element of the nameList
        displayName();

    })

    var displayNextName = function() {

        if(nameCounter <= 10) {

            $('#myName').html(nameList[nameCounter]);

        } else {

            console.log('OUT OF NAMES !!!!!');
            console.log('OUT OF NAMES !!!!!');
            console.log('OUT OF NAMES !!!!!');

            doneWithNames(nameCounter);

        }

    }

    var doneWithNames = function(counter) {

        if(counter === 10) {
            node.emit('done');
        }

    }

    $('#whiteButton').click(function() {

        node.emit('whiteName');

        nameCounter += 1;

        displayNextName();

    })

    $('#blackButton').click(function() {

        node.emit('blackName');

        nameCounter += 1;

        displayNextName();

    })





};

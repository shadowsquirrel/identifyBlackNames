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

        console.log(msg);

        nameList = msg.list;
        nameCounter = msg.counter;

        // pass the first element of the nameList
        displayNextName();

    })

    var displayNextName = function() {

        node.emit('counterWatcher', nameCounter)

        if(nameCounter <= 9) {

            $('#myName').html(nameList[nameCounter]);

        } else {

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

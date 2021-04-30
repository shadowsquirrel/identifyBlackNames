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

    let nameList, nameIndex;

    node.on('nameListHTML', function(msg) {

        console.log(msg);

        nameList = msg.list;
        nameIndex = msg.index;

        // pass the first element of the nameList
        displayNextName();

    })

    var displayNextName = function() {

        node.emit('counterWatcher', nameIndex)

        if(nameIndex <= 9) {

            $('#myName').html(nameList[nameIndex]);

        } else {

            node.emit('done');

        }

    }


    $('#whiteButton').click(function() {

        node.emit('whiteName');

        nameIndex += 1;

        displayNextName();

    })

    $('#blackButton').click(function() {

        node.emit('blackName');

        nameIndex += 1;

        displayNextName();

    })





};

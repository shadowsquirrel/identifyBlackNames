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

    let nameList;

    let nameCounter = -1;

    node.on('nameListHTML', function(msg) {

        nameList = msg.data;

        // pass the first element of the nameList
        displayName();

    })

    var displayName = function() {

        nameCounter += 1;

        if(nameCounter < 10) {

            $('#myName').html(nameList[nameCounter]);

        } else {

            console.log('OUT OF NAMES !!!!!');
            console.log('OUT OF NAMES !!!!!');
            console.log('OUT OF NAMES !!!!!');

        }

    }





};

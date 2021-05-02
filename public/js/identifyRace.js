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

        transition();

        setTimeout(()=>{

            node.emit('indexWatcher', nameIndex)

            if(nameIndex <= 9) {

                $('#myName').html(nameList[nameIndex]);

            } else {

                node.emit('done');

            }

        }, 500)


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



    var transition = function() {

        $('.nameText').css({'opacity':'0', 'transform':'scale(0)'});

        setTimeout(()=>{
            $('.nameText').css({'opacity':'1', 'transform':'scale(1)'})
        }, 500)

    }




};

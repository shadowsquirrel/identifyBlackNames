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

    node.on('myScoreHTML', function(msg) {

        var myScore = msg + '/10';

        $('#myScore').html(myScore);

    })

    var rotate = function() {

        $('.innerWrap').css({
            'transition':'5s',
            'transform':'rotateY(5turn)'
        })

    }

    setTimeout(()=>{
        rotate();
    }, 250)

    $('#showScoreButton').click(function() {

        $('.innerWrap').css({
            'transition':'1s',
            'transform' : 'scale(0) rotateY(0turn)',
            'opacity':'0'
        })

        setTimeout(()=>{
            $('.innerWrap').css({
                'transition':'1s',
                'transform' : 'scale(1)',
                'opacity':'1'
            })
        }, 1000)

        $('.myButton1').css({
            'transition':'1s',
            'transform':'scale(0)'
        })

        setTimeout(()=>{
            $('.myButton2').css({
                'transform':'scale(1)'
            })
        }, 3000)


        setTimeout(()=>{
            node.emit('requestScore');
        }, 1000)


    })

    $('#doneButton').click(function() {

        node.emit('doneAndSave');

    })

};

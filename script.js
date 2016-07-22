var turn = 0;
var winner = false;
var players = 1;
var moves = [];
var winningSolutions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

function sendData(board){
    var data = new FormData();
    data.append("data" , board);
    var xhr = new XMLHttpRequest();
    xhr.open( 'post', 'request.php', true);
    console.log("Sent data to server: " + board);
    xhr.send(data);
}

function setPlayers(num){
    players = num;

    $('.player-buttons').addClass('hidden');
    $('.game-wrapper').removeClass('hidden');
}

function markSquare(square){
    if(!winner){
        if(square.innerHTML === "-") {
            if (turn % 2 == 0) {
                square.innerHTML = "X";
                moves.push(square.id);
                update();
                if(players === 1){
                    aiLearning();
                }
            }else{
                square.innerHTML = "O";
                update();
            }
        }
    }
}

function choosePossibleMove(not){
    var possibleMove = Math.floor(Math.random() * 9) + 1;

    if(element(possibleMove).innerHTML !== "-"){
        choosePossibleMove();
    }

    if(not != undefined){
        if(possibleMove === not){
            choosePossibleMove(not);
        }
    }

    return possibleMove;
}

function getTxt(){
    var response = $.ajax({
        url:'games.txt',
        async: false
    });

    var lines = response.responseText.split("\n");
    var games = [];

    for (var i = 0; i < lines.length; i++) {
        var obj = lines[i];

        games.push([obj.split(" ")[0], obj.split(" ")[1]]);
    }

    console.log(games);

    return games;
}

function aiLearning(){
    var games = getTxt();
    var winningPaths = [];
    var tiePaths = [];
    var lossPaths = [];

    for (var i = 0; i < games.length; i++) {
        var game = games[i];

        for (var j = 0; j < game.length; j++) {
            var move = game[0].split(",");
            var result = game[1];

            for (var k = 0; k < move.length; k++) {
                var knownMove = move[k];


                if(moves[turn - 1] === knownMove){
                    if(result === "WON"){
                        winningPaths.push(game);
                    }

                    if(result === "TIE"){
                        tiePaths.push(game);
                    }

                    if(result === "LOSS"){
                        lossPaths.push(game);
                    }
                }
            }
        }
    }

    if(winningPaths.length > 0){
        var randMove = Math.floor(Math.random() * winningPaths.length) + 1;
        element(randMove).innerHTML = "O";
        moves.push(randMove);
        update();
        console.log("Winning move found. Selecting random winning move.");
        return;
    }else if(tiePaths.length > 0){
        var randMove = Math.floor(Math.random() * tiePaths.length) + 1;
        element(randMove).innerHTML = "O";
        moves.push(randMove);
        update();
        console.log("Tie move found. Selecting random winning move.");
        return;
    }

    console.log("No successful move found. Falling back to AI heuristics");
    aiHeuristics();
}

function aiHeuristics(not){
    if(!winner){
        if(element(5).innerHTML === "-"){
            element(5).innerHTML = "O";
            moves.push(5);
            update();
        }else{
            for(var i = 0; i < winningSolutions.length; i++){
                if(element(winningSolutions[i][0]).innerHTML === element(winningSolutions[i][1]).innerHTML){
                    if(element(winningSolutions[i][0]).innerHTML === "-"){
                        continue;
                    }

                    if(element(winningSolutions[i][2]).innerHTML !== "-"){
                        continue;
                    }

                    element(winningSolutions[i][2]).innerHTML = "O";
                    moves.push(winningSolutions[i][2]);
                    update();
                    return;
                }

                if(element(winningSolutions[i][1]).innerHTML === element(winningSolutions[i][2]).innerHTML){
                    if(element(winningSolutions[i][1]).innerHTML === "-"){
                        continue;
                    }

                    if(element(winningSolutions[i][0]).innerHTML !== "-"){
                        continue;
                    }

                    element(winningSolutions[i][0]).innerHTML = "O";
                    moves.push(winningSolutions[i][0]);
                    update();
                    return;
                }

                if(element(winningSolutions[i][2]).innerHTML === element(winningSolutions[i][0]).innerHTML){
                    if(element(winningSolutions[i][2]).innerHTML === "-"){
                        continue;
                    }

                    if(element(winningSolutions[i][1]).innerHTML !== "-"){
                        continue;
                    }

                    element(winningSolutions[i][1]).innerHTML = "O";
                    moves.push(winningSolutions[i][1]);
                    update();
                    return;
                }
            }

            var corners = [1, 3, 7, 9];
            for (var i = 0; i < corners.length; i++) {
                var obj = corners[i];

                if(element(obj).innerHTML === "-"){
                    element(obj).innerHTML = "O";
                    moves.push(obj);
                    update();
                    return;
                }
            }

            var square = Math.floor(Math.random() * 9) + 1;

            if(element(square).innerHTML === "-"){
                element(square).innerHTML = "O";
                moves.push(square);
                update();
            }else{
                aiHeuristics();
            }
        }
    }
}

function update(){
    for(var i = 0; i < winningSolutions.length; i++){
        if((element(winningSolutions[i][0]).innerHTML === element(winningSolutions[i][1]).innerHTML) &&
            (element(winningSolutions[i][1]).innerHTML === element(winningSolutions[i][2]).innerHTML)){

            if(element(winningSolutions[i][0]).innerHTML === "-"){
                continue;
            }

            if(turn % 2 === 0){
                element("turn").innerHTML = "WINNER: X";
                sendData(moves.join() + " LOSS");
            }else{
                element("turn").innerHTML = "WINNER: 0";
                sendData(moves.join() + " WON");
            }

            for (var j = 0; j < winningSolutions[i].length; j++) {
                var obj = winningSolutions[i][j];
                highlight(obj);
            }

            winner = true;

        }
    }

    turn++;

    if(turn === 9 && !winner){
        element("turn").innerHTML = "END GAME";
        sendData(moves.join() + " TIE");
    }
}

function highlight(square){
    $("#" + square).addClass("highlighted");
}

function element(e){
    return document.getElementById(e);
}
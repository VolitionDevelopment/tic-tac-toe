var turn = 0;
var gameEnded = false;
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
    if(!gameEnded){
        if(square.innerHTML === "-") {
            if (turn % 2 == 0) {
                square.innerHTML = "X";
                moves.push(square.id);
                update();
                if(players === 1 && !gameEnded){
                    aiLearning();
                    // var heuristic = aiHeuristics();
                    // element(heuristic).innerHTML = "O";
                    // moves.push(heuristic);
                    // update();
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

    if(not != undefined){
        for(var i = 0; i < not.length; i++){
            if(not[i] === possibleMove){
                choosePossibleMove(not);
            }
        }
    }

    if(element(possibleMove).innerHTML !== "-"){
        choosePossibleMove(not);
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

    return games;
}

function matchingArray(arr1, arr2, point){
    if(arr1.length < point || arr2.length < point){
        return false;
    }

    for(var i = 0; i < point; i++){
        if(arr1[i] != arr2[i]){
            return false;
        }
    }

    return true;
}

function aiLearning(){
    var games = getTxt();
    var tiePaths = [];
    var lossPaths = [];

    for (var i = 0; i < games.length; i++) {
        var game = games[i];

        var move = game[0].split(",");
        var result = game[1];

        if(matchingArray(moves, move, turn)){
            if(result === "TIE"){
                tiePaths.push(game);
            }

            if(result === "LOSS"){
                lossPaths.push(game);
            }
        }
    }

    if(tiePaths.length > 0) {
        console.log("Tie move found. Selecting random tie move.");
        var chosenMove = tiePaths[0][0].split(",")[turn];

        element(chosenMove).innerHTML = "O";
        moves.push(chosenMove);

        update();
        return;
    }else if(lossPaths.length > 0){
        console.log("Loss move found. Avoiding losing path.");

        var nextTurnLosses = [];

        for(var i = 0; i < lossPaths.length; i++){
            nextTurnLosses.push(lossPaths[i][0].split(",")[turn]);
        }

        var solution = aiHeuristics(nextTurnLosses);

        element(solution).innerHTML = "O";
        moves.push(solution);
        update();

        return;
    }

    console.log("No successful move found. Falling back to AI heuristics");
    var heuristic = aiHeuristics();
    element(heuristic).innerHTML = "O";
    moves.push(heuristic);
    update();
}

function aiHeuristics(exception){
    var possibleMove = 0;

    if(!gameEnded){
        if(element(5).innerHTML === "-"){
            possibleMove = 5;
        }else{
            for(var i = 0; i < winningSolutions.length; i++){
                if(element(winningSolutions[i][0]).innerHTML === element(winningSolutions[i][1]).innerHTML){
                    if(element(winningSolutions[i][0]).innerHTML === "-"){
                        continue;
                    }

                    if(element(winningSolutions[i][2]).innerHTML !== "-"){
                        continue;
                    }

                    console.log("Blocking");
                    return winningSolutions[i][2];
                }

                if(element(winningSolutions[i][1]).innerHTML === element(winningSolutions[i][2]).innerHTML){
                    if(element(winningSolutions[i][1]).innerHTML === "-"){
                        continue;
                    }

                    if(element(winningSolutions[i][0]).innerHTML !== "-"){
                        continue;
                    }

                    console.log("Blocking");
                    return winningSolutions[i][0];
                }

                if(element(winningSolutions[i][2]).innerHTML === element(winningSolutions[i][0]).innerHTML){
                    if(element(winningSolutions[i][2]).innerHTML === "-"){
                        continue;
                    }

                    if(element(winningSolutions[i][1]).innerHTML !== "-"){
                        continue;
                    }

                    console.log("Blocking");
                    return winningSolutions[i][1];
                }
            }

            var square = Math.floor(Math.random() * 9) + 1;

            if(element(square).innerHTML === "-"){
                possibleMove = square;
            }else{
                aiHeuristics();
            }

            var corners = [1, 3, 7, 9];
            for (var i = 0; i < corners.length; i++) {
                var obj = corners[i];

                if(element(obj).innerHTML === "-"){
                    possibleMove = obj;
                }
            }


        }

        if(exception.indexOf(possibleMove) > -1){
            console.log("Move results in loss. Finding new move...");
            aiHeuristics(exception);
        }

        return possibleMove;
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

                if(players === 1) {
                    sendData(moves.join() + " LOSS");
                }
            }else{
                element("turn").innerHTML = "WINNER: 0";
            }

            for (var j = 0; j < winningSolutions[i].length; j++) {
                var obj = winningSolutions[i][j];
                highlight(obj);
            }

            gameEnded = true;
            return;
        }
    }

    turn++;

    if(turn === 9 && !gameEnded){
        element("turn").innerHTML = "END GAME";
        sendData(moves.join() + " TIE");
        gameEnded = true;
    }
}

function highlight(square){
    $("#" + square).addClass("highlighted");
}

function element(e){
    return document.getElementById(e);
}
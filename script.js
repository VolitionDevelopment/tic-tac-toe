var turn = 0;
var winner = false;
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

function markSquare(square){
    if(!winner){
        if(square.innerHTML === "-") {
            if (turn % 2 == 0) {
                square.innerHTML = "X";
                update();
                ai();
            }
        }
    }
}

function ai(){
    if(!winner){
        if(element(5).innerHTML === "-"){
            element(5).innerHTML = "O";
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
                    update();
                    return;
                }
            }

            var corners = [1, 3, 7, 9];
            for (var i = 0; i < corners.length; i++) {
                var obj = corners[i];

                if(element(obj).innerHTML === "-"){
                    element(obj).innerHTML = "O";
                    update();
                    return;
                }
            }

            var square = Math.floor(Math.random() * 9) + 1;

            if(element(square).innerHTML === "-"){
                element(square).innerHTML = "O";
                update();
            }else{
                ai();
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
            }else{
                element("turn").innerHTML = "WINNER: 0";
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
    }
}

function highlight(square){
    $("#" + square).addClass("highlighted");
}

function element(e){
    return document.getElementById(e);
}
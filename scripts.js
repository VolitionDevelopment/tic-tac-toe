var whosTurn = 1; //start off on player 1's turn

var winners = [
	["A1","A2","A3"], //Row 1
	["B1","B2","B3"], //Row 2
	["C1","C2","C3"], //Row 3
	["A1","B2","C3"], //diag 1
	["A1","B1","C1"], //Col 1
	["A2","B2","C2"], //Col 2
	["A3","B3","C3"], //Col 3
	["A3","B2","C1"]  //Other daig
];

var player1 = []; //Array where we will stash the squares player1 has checked
var player2 = []; //Array for player2
var someoneWon = false;

$('.box').click(function(){
    markSquare(this);
});

function markSquare(square){
	if(someoneWon){
		console.log("Someone already won");
	}
	//Check to see if this square is either player array. If so, goodbye.
	else if((player1.indexOf(square.id) == -1) //Lookin player1 array for this square
		&& (player2.indexOf(square.id) == -1)){ //Look in player2 array for this sqaure
			//If BOTH are -1, then it's neither array
		if(whosTurn == 1){
			square.innerHTML = 'X';
			whosTurn = 2;
			player1.push(square.id);
			checkWin(player1,1);
		}else{
			square.innerHTML = 'O';
			whosTurn = 1;
			player2.push(square.id);
			checkWin(player2,2);
		}

	}else{
		console.log("Something's already there!! No cheating!!");
	}
}

function checkWin(currentPlayersSquares, whoJustMarked){
	var rowCount = 0;
	//Loop through the outter array
	for(var i = 0; i < winners.length; i++){
		//Loop through each row (inner array)
		rowCount = 0;
		for(var j = 0; j < winners[i].length; j++){
			if(currentPlayersSquares.indexOf(winners[i][j]) > -1){
				//HIT!
				rowCount++;
			}
			// console.log(player1);
			if(rowCount == 3){
				//BINGO!!!!
				gameOver(whoJustMarked, winners[i]);
			}
		}
	}
}

function gameOver(whoWon, winningCombo){
	var message = document.getElementById('message');
	message.innerHTML = "Congratulations to player " + whoWon + ". You won with " + winningCombo.join(', ');
	for(var i = 0; i<winningCombo.length; i++ ){
		document.getElementById(winningCombo[i]).className += ' winner';
	}
	someoneWon = true;
}

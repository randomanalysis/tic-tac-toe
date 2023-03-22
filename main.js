const victoryScenarios = [
    [0,1,2],
    [0,3,6],
    [3,4,5],
    [6,7,8],
    [1,4,7],
    [2,4,6],
    [2,5,8],
    [0,4,8]
];


function Player (name, token, playerNum) {
    name = name;
    token = token;
    playerNum = playerNum;
    let ai = false;
    let score = 0;

    const getName = () => name;
    const getToken = () => token;
    const getPlayerNum = () => playerNum;
    const getScore = () => score;
    const getAI = () => ai;

    const addPoint = () => {
        score = score + 1;
    }

    const setAI = (newAI) => {
        ai = newAI;
    }

    return {
        getName,
        getToken,
        getPlayerNum,
        getScore,
        addPoint,
        getAI,
        setAI,
    }
};

const GameBoard = (() => {
    const cells = 9;
    const board = [];

    for (let i = 0; i < cells; i++) {
        board.push(Cell());
    }

    const getBoard = () => board;

    const resetBoard = () => {
        board.splice(0,board.length);
        for (let i = 0; i < cells; i++) {
            board.push(Cell());
        }
    }

    const checkForWinner = (token) => {
        return victoryScenarios.some((combination) => {
            return combination.every((i) => {
              return board[i].getValue() === token;
            });
          });
    }

    const checkForTie = () => {
        return board.every((cell) => {
            return cell.getValue() == "X" || cell.getValue() == "0";
        });
    }

    return {
        getBoard,
        resetBoard,
        checkForWinner,
        checkForTie,

    };
})();

function Cell() {
    let value = "";

    const addPlayer = (player) => {
        value = player.getToken()
    }

    const addToken = (token) => {
        value = token;
    }

    const removeToken = () => {
        value = "";
    }
        
    const getValue = () => value

    return {
        addPlayer,
        getValue,
        addToken,
        removeToken,
    };
  };

const ComputerAI = (()=> {

    const board = GameBoard.getBoard();

    const evaluate = () => {
        
        if(GameBoard.checkForWinner("0")){
            return -10;
        } else if(GameBoard.checkForTie()) {
            return 0;
        } else if(GameBoard.checkForWinner("X")) {
            return 10;
        }
    }

    const miniMax = (board, depth, isMax) => {
        let score = evaluate();

        if(score == 10) return score;

        if(score == -10) return score;

        if(score == 0) return score;

        if(isMax) {

            let best = -1000;

            for(let i = 0; i < board.length; i++) {

                if(board[i].getValue() == "") {
                    board[i].addToken("X");
                    best = Math.max(best, miniMax(board, depth +1 , !isMax ));
                    board[i].removeToken();
                }
            }

            return best;

        } else {

            let best = 1000;

            for(let i = 0; i < board.length; i++) {

                if(board[i].getValue() == "") {
                    board[i].addToken("0");
                    best = Math.min(best, miniMax(board, depth +1 , !isMax ));
                    board[i].removeToken();
                }
            }

            return best;
        }

    }

    const findBestMove = () => {
        let bestScore = -1000;
        let moveIndex = -1;

        for(let i = 0; i < board.length; i++) {

            if(board[i].getValue() == "") {
                board[i].addToken("X");
                let moveScore = miniMax(board, 0, false);
                board[i].removeToken();

                if(moveScore > bestScore) {
                    moveIndex = i;
                    bestScore = moveScore;
                }
            }
        }

        return moveIndex;
    }


    return {
        findBestMove,
    };
})();

const gameController = (() => {

    const playerOne = Player("Player One", "0", "one")
    const playerTwo = Player("Player Two", "X", "two")

    const players = [playerOne, playerTwo];

    let activePlayer = players[0];

    let tie = false;
    let gameOver = false;

    const nextPlayerTurn = () => {
        if (activePlayer == players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    }

    const getActivePlayer = () => activePlayer;
    const getTie = () => tie;
    const getGameOver = () => gameOver;

    const getPlayerOne = () => players[0];
    const getPlayerTwo = () => players[1];

    const playRound = (cell) => {

        cell.addPlayer(activePlayer)
        const board = GameBoard.getBoard();

        if (GameBoard.checkForWinner(activePlayer.getToken())) {
            gameOver = true;
            activePlayer.addPoint();
            return
        }

        if (GameBoard.checkForTie(board)) {
            tie = true;
            gameOver = true;
            return;
        }

        nextPlayerTurn();
        
    }

    const playAiRound = () => {
        if (getActivePlayer().getAI()){

            const board = GameBoard.getBoard();

            if(rollDice(6) ==  6) {

                const board = GameBoard.getBoard();
                
                const emtpyCells = board.filter(cell => cell.getValue() == "");

                let randCell = randomIntFromInterval(0, emtpyCells.length  -1);

                cell = emtpyCells[randCell];
                playRound(cell);

            } else {
                let cellPicked = ComputerAI.findBestMove();
                playRound(board[cellPicked]);
            };

        }

    }

    const resetGame = () => {
        tie = false;
        gameOver = false;
        activePlayer = players[0];
        resultText = "";
    }

    const setAI = (anAI) => {
        players[1].setAI(anAI);

    }

    return {
        playRound,
        playAiRound,
        getActivePlayer,
        resetGame,
        getTie,
        getGameOver,
        getPlayerOne,
        getPlayerTwo,
        setAI,
    };
})();

const displayConroller = (() => {

    const boardDiv = document.querySelector('.board');

    const updateDisplay = () => {

        boardDiv.textContent = "";
        
        // get the newest version of the board and player turn
        const board = GameBoard.getBoard();

        const activePlayer = gameController.getActivePlayer();
        const activePlayerNum = activePlayer.getPlayerNum()

        const playerDivs = document.querySelectorAll('.player-display');

        playerDivs.forEach(div => {
            div.innerHTML = "";
        });

        const activePlayerDiv = document.querySelector('[data-player = "' + activePlayerNum + '"]')
        activePlayerDiv.textContent = `${activePlayer.getName()}'s Turn!`;

        let i = 0;

        board.forEach(cell => {
            // Anything clickable should be a button!!
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.cell = i;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
            i++;
          })


        }

    const endGameDisplay = () => {

        boardDiv.textContent = "";
        
        // get the newest version of the board and player turn
        const board = GameBoard.getBoard();

        const playerDivs = document.querySelectorAll('.player-display');

        playerDivs.forEach(div => {
            div.innerHTML = "";
        });


        let resultText = ""

        if (gameController.getTie()) {
            resultText = "Tie - No Winner This Round!";
        } else {
            resultText = `${gameController.getActivePlayer().getName()} Wins This Round!`;
        }

        const gameOverDiv = document.querySelector('.result-info')
        gameOverDiv.textContent = resultText;

        const playerScores = document.querySelectorAll('.player-score');

        playerScores.forEach(div => {
            div.innerHTML = "";
        });

        const playerOneScore = document.querySelector('[data-player-score = "one"]')
        playerOneScore.textContent = `${gameController.getPlayerOne().getScore()} points!`;

        const playerTwoScore = document.querySelector('[data-player-score = "two"]')
        playerTwoScore.textContent = `${gameController.getPlayerTwo().getScore()} points!`;



        let i = 0;

        board.forEach(cell => {
            // Anything clickable should be a button!!
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.cell = i;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
            i++;
            })


        }

    function newGame() {
        GameBoard.resetBoard();
        gameController.resetGame();
        const gameOverDiv = document.querySelector('.result-info')
        gameOverDiv.textContent = resultText;
        updateDisplay();

    }

    function setAI(anAI) {
        gameController.setAI(anAI);
    }


    // Add event listener for the board
    function clickHandlerBoard(e) {
        const board = GameBoard.getBoard();
        const selectedCell = board[+e.target.dataset.cell];
        
        if (!selectedCell || !(selectedCell.getValue() == "") || gameController.getGameOver()) {
            return
        };
        
        gameController.playRound(selectedCell);
        if (!gameController.getGameOver()) {
            updateDisplay();
            if(gameController.getActivePlayer().getAI) {

                setTimeout(playAsAi, 600)

                function playAsAi() {
                    gameController.playAiRound();
                    if (!gameController.getGameOver()) {

                        updateDisplay();
                    } else {

                        endGameDisplay();
                        }
                }
            }
        } else {

            endGameDisplay();
            }
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    const newGameBtn = document.querySelector('.new-game-btn');
    newGameBtn.addEventListener('click', newGame);

    const opponentTypeDisplay = document.querySelector('.player-choice-current h4')


    const humanBtn = document.getElementById("player-choice-human");
    humanBtn.addEventListener('click', function() {
        setAI(false);
        opponentTypeDisplay.textContent = "Human";
    });

    const aiBtn = document.getElementById("player-choice-ai");
    aiBtn.addEventListener('click', function() {
        setAI(true);
        opponentTypeDisplay.textContent = "Robot";
    });

    // Initial display
    updateDisplay();

})();

displayConroller;

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function rollDice(max) {
return 1 + Math.floor(Math.random() * max);
}

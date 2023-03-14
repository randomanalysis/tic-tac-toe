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


function Player (name, token, playerNum, ai) {
    name = name;
    token = token;
    playerNum = playerNum;
    ai = ai;
    let score = 0;

    const getName = () => name;
    const getToken = () => token;
    const getPlayerNum = () => playerNum;
    const getScore = () => score;
    const getAI = () => ai;

    const addPoint = () => {
        score = score + 1;
    }

    return {
        getName,
        getToken,
        getPlayerNum,
        getScore,
        addPoint,
        getAI,
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

    return {
        getBoard,
        resetBoard,
    };
})();

function Cell() {
    let value = "";

    const addPlayer = (player) => {
        value = player.getToken()
    }
        
    const getValue = () => value

    return {
        addPlayer,
        getValue,
    };
  };

  


const gameController = (() => {

    const playerOne = Player("Player One", "0", "one", false)
    const playerTwo = Player("Player Two", "X", "two", true)

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

        if (checkForWinner(activePlayer, board)) {
            gameOver = true;
            activePlayer.addPoint();
            return
        }

        if (checkForTie(board)) {
            tie = true;
            gameOver = true;
            return;
        }

        nextPlayerTurn();

        if (getActivePlayer().getAI()){

            const board = GameBoard.getBoard();
            
            const emtpyCells = board.filter(cell => cell.getValue() == "");

            randCell = randomIntFromInterval(0, emtpyCells.length  -1);

            cell = emtpyCells[randCell];
            playRound(cell);

        } 
        
    }

    const checkForWinner = (activePlayer, board) => {
        const token = activePlayer.getToken();

        return victoryScenarios.some((combination) => {
            return combination.every((i) => {
              return board[i].getValue() === token;
            });
          });
    }

    const checkForTie = (board) => {
        return board.every((cell) => {
            return cell.getValue() == "X" || cell.getValue() == "0";
        });
    }

    const resetGame = () => {
        tie = false;
        gameOver = false;
        activePlayer = players[0];
        resultText = "";
    }

    return {
        playRound,
        getActivePlayer,
        resetGame,
        getTie,
        getGameOver,
        getPlayerOne,
        getPlayerTwo,
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

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const board = GameBoard.getBoard();
        const selectedCell = board[+e.target.dataset.cell];
        
        if (!selectedCell || !(selectedCell.getValue() == "") || gameController.getGameOver()) {
            return
        };
        
        gameController.playRound(selectedCell);
        if (!gameController.getGameOver()) {
            //const activePlayer = gameController.getActivePlayer();
            updateDisplay();
        } else {
            //const activePlayer = gameController.getActivePlayer();
            endGameDisplay();
            }
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    const newGameBtn = document.querySelector('.new-game-btn');
    newGameBtn.addEventListener('click', newGame);

    // Initial display
    updateDisplay();

})();

displayConroller;

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

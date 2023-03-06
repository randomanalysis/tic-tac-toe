const GameBoard = (() => {
    const rows = 3;
    const columns =  3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
      }

    const getBoard = () => board;

    return {
        getBoard,
    };
})();

const Cell = () => {
    let value = 0;

    const addPlayer = (player) => {
        value = player
        
    const getPlayer = () => value
    }
    return {
        addPlayer,
        getPlayer,
    };
  };

  const Player = (name, token) => {
    name = name;
    token = token;

    const getName = () => name;
    const getToken = () => token;

    return {
        getName,
        getToken,
    }
  };

  const GameController = ((playerOne, playerTwo) => {
    
    const board = GameBoard();

    const players = [playerOne, playerTwo];

    let activePlayer = players[0];

    const nextPlayerTurn = () => {
        if (activePlayer == players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (cell) => {
        cell.addPlayer(activePlayer.getToken());

        nextPlayerTurn();
        displayGame();
    }

    displayGame();


    return {
        playRound,
        getActivePlayer
    };
})();

const DisplayConroller = (() => {

    const game = GameController();




})();


  
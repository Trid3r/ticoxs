import { useState } from "preact/hooks";
import { Header } from "$components/Header.tsx";
import { Footer } from "$components/Footer.tsx";
import { GameOverModal } from "$components/GameOverModal.tsx";

export function GameBoard() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerLives, setPlayerLives] = useState(3);
  const [playerPieces, setPlayerPieces] = useState<number[]>([]);
  const [computerPieces, setComputerPieces] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [boardAnimation, setBoardAnimation] = useState("");
  const [totalPlayerMarks, setTotalPlayerMarks] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [computerDelay, setComputerDelay] = useState(500);

   // Toggles dark mode
   const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Checks if the game board is full without any winners (tie)
  const checkTie = (board: (string | null)[]) => {
    return board.every((cell) => cell !== null);
  };

  // Handles a player's move on the game board
  const handleCellClick = (index: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (board[index] || !playerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setPlayerTurn(false);
    setPlayerPieces([...playerPieces, index]);
    setTotalPlayerMarks((prev) => prev + 1);

    if (checkWin(newBoard, "X")) {
      winTrigger();
      return;
    }

    setTimeout(() => {
      computerMove(newBoard);
    }, computerDelay); 
  };

  // Minimax algorithm to determine the best move for the computer
  const minimax = (board: (string | null)[], isMaximizing: boolean): number => {
    const scores: { [key: string]: number } = {
        'X': -10,
        'O': 10,
        'tie': 0
    };

    const winner = (player: string) => checkWin(board, player);
    
    if (winner('O')) return scores['O'];
    if (winner('X')) return scores['X'];
    if (checkTie(board)) return scores['tie'];

    const emptyIndices = board.reduce(
        (acc, cell, idx) => (cell === null ? [...acc, idx] : acc),
        [] as number[]
    );

    if (emptyIndices.length === 0) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const index of emptyIndices) {
        board[index] = isMaximizing ? 'O' : 'X';
        const score = minimax(board, !isMaximizing);
        board[index] = null;

        if (isMaximizing) {
            bestScore = Math.max(score, bestScore);
        } else {
            bestScore = Math.min(score, bestScore);
        }
    }

    return bestScore;
  };

  // Determines the computer's move and updates the board
  const computerMove = (currentBoard: (string | null)[]) => {
    const emptyIndices = currentBoard.reduce(
      (acc, cell, idx) => (cell === null ? [...acc, idx] : acc),
      [] as number[]
    );

    let computerMove = -1;
    let bestScore = -Infinity;

    for (const index of emptyIndices) {
        currentBoard[index] = 'O';
        const score = minimax(currentBoard, false);
        currentBoard[index] = null;

        if (score > bestScore) {
            bestScore = score;
            computerMove = index;
        }
    }
  
    const newBoard = [...currentBoard];
    newBoard[computerMove] = "O";
    setBoard(newBoard);
    setPlayerTurn(true);
    setComputerPieces([...computerPieces, computerMove]);
  
    if (checkWin(newBoard, "O")) {
      setPlayerLives((lives) => lives - 1);
      loseTrigger();
  
      if (playerLives - 1 === 0) {
        setGameOver(true);
        setShowGameOverModal(true);
      } else {
        resetMatch();
      }
    } else if (checkTie(newBoard)) {
      tieTrigger();
      resetMatch();
    }
  };

  // Checks if a player has won the game
  const checkWin = (board: (string | null)[], player: string) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombos.some((combo) =>
      combo.every((index) => board[index] === player)
    );
  };

  // Triggers an animation for a tie
  const tieTrigger = () => {
    setBoardAnimation("rotation-animation"); 
    setTimeout(() => setBoardAnimation(""), 500);
  };

  // Triggers an animation for a loss
  const loseTrigger = () => {
    setBoardAnimation("shake-animation"); 
    setTimeout(() => setBoardAnimation(""), 500);
  };

  // Triggers an animation for a win
  const winTrigger = () => {
    setBoardAnimation("animate-fade-in"); 
    setTimeout(() => setBoardAnimation(""), 500); 
    resetMatch();
  };

  // Handles the submission of the game over modal (nickname entry) - Next version: Add request to send that data to endpoint
  const handleGameOverSubmit = (nickname: string) => {
    setGameOver(false);
    setPlayerLives(3);
    resetMatch();
    setShowGameOverModal(false);
  };

  // Resets the game state for a new match
  const resetMatch = () => {
    setBoard(Array(9).fill(null));
    setPlayerPieces([]);
    setComputerPieces([]);
    setTotalMatches((prev) => prev + 1);
    setPlayerTurn(false);
    setComputerDelay((prevDelay) => Math.max(prevDelay - 50, 0));

    setTimeout(() => {
      computerMove(Array(9).fill(null));
    }, computerDelay);
  };

  return (
    <div class={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-slate-200 text-black'} transition-colors duration-300`}>
      <Header gameStarted={gameStarted} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main class="flex-grow flex items-center justify-center px-10 py-10">
        <div
          class={`w-full sm:w-9/12 lg:w-1/3 h-full grid grid-cols-3 gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-2 sm:p-4 rounded-lg shadow-lg ${boardAnimation}`}
          style={{
            transform: gameStarted ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.5s ease-in-out",
            aspectRatio: "1 / 1",
          }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              class={`w-full h-full flex items-center justify-center pt-0 text-6xl lg:text-9xl font-bold transition-all duration-300 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-400'}`}
              onClick={() => handleCellClick(index)}
            >
              {cell && (
                <span
                  class={`${
                    cell === "X" ? "text-red-500" : "text-blue-500"
                  } animate-fade-in absolute`}
                >
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>
      </main>
      <Footer gameStarted={gameStarted} darkMode={darkMode} />
      {gameStarted && (
        <>
          <div class="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-gray-800 text-white text-center text-sm sm:text-base animate-slide-up">
            {playerTurn ? "Your turn" : "Computer's turn"}
          </div>
          <div class="fixed top-0 left-0 right-0 flex justify-between p-2 sm:p-4 bg-gray-800 text-white text-sm sm:text-base animate-slide-down">
            <div>You: <b>{playerLives}</b> ❤️</div>
            <div>Chappie: <b>∞</b> ❤️</div>
          </div>
        </>
      )}
      {showGameOverModal && (
        <GameOverModal darkMode={darkMode} totalPlayerMarks={totalPlayerMarks} totalMatches={totalMatches} onSubmit={handleGameOverSubmit} />
      )}
    </div>
  );
}

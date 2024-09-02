import { useState } from "preact/hooks";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { GameOverModal } from "../components/GameOverModal.tsx";

export function GameBoard() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerLives, setPlayerLives] = useState(3);
  const [playerPieces, setPlayerPieces] = useState<number[]>([]);
  const [computerPieces, setComputerPieces] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [matchOver, setMatchOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [boardAnimation, setBoardAnimation] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const checkTie = (board: (string | null)[]) => {
    return board.every((cell) => cell !== null);
  };  

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

    // Check for win
    if (checkWin(newBoard, "X")) {
      winTrigger();
      setMatchOver(false);
      return;
    }

    // Computer's turn immediately after player's move
    setTimeout(() => {
      computerMove(newBoard);
    }, 500); // Reduced delay for faster gameplay
  };

  const computerMove = (currentBoard: (string | null)[]) => {
    const emptyIndices = currentBoard.reduce(
      (acc, cell, idx) => (cell === null ? [...acc, idx] : acc),
      [] as number[]
    );
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);
    setPlayerTurn(true);
    setComputerPieces([...computerPieces, randomIndex]);
  
    if (checkWin(newBoard, "O")) {
      setPlayerLives((lives) => lives - 1); // Reduce player lives
      loseTrigger();
  
      if (playerLives - 1 === 0) {
        setGameOver(true);
        setShowGameOverModal(true); // Show GameOverModal if lives reach 0
      }
    } else if (checkTie(newBoard)) {
      setMatchOver(true);
      resetMatch(); // Reiniciar la partida en caso de empate
    }
  };

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

  const loseTrigger = () => {
    setBoardAnimation("animate-shake-horizontal"); 
    setTimeout(() => setBoardAnimation(""), 500); 
    resetMatch();
  };

  const winTrigger = () => {
    setBoardAnimation("animate-bounce"); 
    setTimeout(() => setBoardAnimation(""), 500); 
    resetMatch();
  };

  const handleGameOverSubmit = (nickname: string) => {
    console.log(`Winner: ${nickname}`);
  };

  const resetMatch = () => {
    setBoard(Array(9).fill(null));
    setPlayerTurn(true);
    setPlayerPieces([]);
    setComputerPieces([]);
    setMatchOver(false);
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
      <Footer gameStarted={gameStarted} />
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
        <GameOverModal onSubmit={handleGameOverSubmit} />
      )}
    </div>
  );
}

import { useState, useEffect } from "preact/hooks";
import { Header } from "$components/Header.tsx";
import { Footer } from "$components/Footer.tsx";
import { GameOverModal } from "$components/GameOverModal.tsx";

interface CellData {
  value: string | null;
  timer: number | null;
  fadeOut: boolean;
}

export function GameBoard() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<CellData[]>(Array(9).fill({ value: null, timer: null, fadeOut: false }));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerLives, setPlayerLives] = useState(10);
  const [playerPieces, setPlayerPieces] = useState<number[]>([]);
  const [computerPieces, setComputerPieces] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [boardStatus, setBoardStatus] = useState(4); // 1: Win / 2: Tie / 3: Lose / 4: Normal
  const [boardAnimation, setBoardAnimation] = useState("");
  const [totalPlayerMarks, setTotalPlayerMarks] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [computerDelay, setComputerDelay] = useState(500);

  // Loop to check mark's timer and update it
  useEffect(() => {
    const interval = setInterval(() => {
      setBoard((prevBoard) => {
        return prevBoard.map((cell) => {
          if(cell == null) return {value: null, timer: null, fadeOut: false };
          if (cell.timer === null) return cell;
          
          const newTimer = cell.timer - 0.05; // Reduce 0.05 seconds per loop
          
          if (newTimer > 0) {
            return { ...cell, timer: newTimer };
          } else if (!cell.fadeOut) {
            return { ...cell, timer: 0, fadeOut: true };
          } else {
            return { value: null, timer: null, fadeOut: false };
          }
        });
      });
    }, 50); // Actualizamos cada 50ms para un control más preciso

    return () => clearInterval(interval);
  }, []);

  // Toggles dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Checks if the game board is full without any winners (tie)
  const checkTie = (board: (CellData | null)[]) => {
    return board.every((cell) => cell !== null && cell.value !== null);
  };

  // Handles a player's move on the game board
  const handleCellClick = (index: number) => {
    // Check if it is the start of the game or return if the game is over or is the computer's turn
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (board[index].value || !playerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = { value: "X", timer: 3.0, fadeOut: false };
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

  // Helper function to check if a move would result in a win
  const wouldWin = (board: (CellData | null)[], player: string, index: number) => {
    const newBoard = [...board];
    newBoard[index] = { value: player, timer: null, fadeOut: false };
    return checkWin(newBoard, player);
  };

  // Determines the computer's move
  const getBestMove = (currentBoard: (CellData | null)[]): number => {
    // Check if computer can win in the next move
    for (let i = 0; i < currentBoard.length; i++) {
      if (!currentBoard[i] || currentBoard[i]?.value === null) {
        if (wouldWin(currentBoard, "O", i)) {
          return i;
        }
      }
    }
  
    // Block player's winning move
    for (let i = 0; i < currentBoard.length; i++) {
      if (!currentBoard[i] || currentBoard[i]?.value === null) {
        if (wouldWin(currentBoard, "X", i)) {
          return i;
        }
      }
    }
  
    // Try to take the center if it's free
    if (!currentBoard[4] || currentBoard[4]?.value === null) {
      return 4;
    }
  
    // Try to take the corners
    const corners = [0, 2, 6, 8];
    const freeCorners = corners.filter(i => !currentBoard[i] || currentBoard[i]?.value === null);
    if (freeCorners.length > 0) {
      return freeCorners[Math.floor(Math.random() * freeCorners.length)];
    }
  
    // Take any available edge
    const edges = [1, 3, 5, 7];
    const freeEdges = edges.filter(i => !currentBoard[i] || currentBoard[i]?.value === null);
    if (freeEdges.length > 0) {
      return freeEdges[Math.floor(Math.random() * freeEdges.length)];
    }
  
    // If we get here, there are no moves left (shouldn't happen in a normal game)
    console.error("No valid moves left");
    return -1; // Invalid move
  };

  // Make the computer move in the board
  const computerMove = (currentBoard: CellData[]) => {
    const computerIndex = getBestMove(currentBoard);

    // Check if is a invalid match or just a tie
    if (computerIndex === -1) {
      if (checkTie(currentBoard as CellData[])) {
        tieTrigger();
        resetMatch();
      } else {
        console.error("Computer couldn't make a move");
        return;
      }
    }

    // Define the computer mark in the correct flow
    const newBoard = currentBoard.map(cell => cell ? { ...cell } : null);
    newBoard[computerIndex] = { value: "O", timer: 3.0, fadeOut: false };
    setBoard(newBoard as CellData[]);
    setPlayerTurn(true);
    setComputerPieces([...computerPieces, computerIndex]);

    if (checkWin(newBoard, "O")) {
      setPlayerLives((lives) => lives - 1);
      loseTrigger();
  
      if (playerLives - 1 === 0) {
        setGameOver(true);
        setShowGameOverModal(true);
      } else {
        resetMatch();
      }
    } else if (checkTie(newBoard as CellData[])) {
      tieTrigger();
      resetMatch();
    }
  };

  // Checks if a player has won the game
  const checkWin = (board: (CellData | null)[], player: string) => {
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
      combo.every((index) => board[index]?.value === player)
    );
  };

  // Triggers an animation for a tie
  const tieTrigger = () => {
    setBoardStatus(2);
    setBoardAnimation("rotation-animation"); 
    setTimeout(() => setBoardAnimation(""), 500);
  };

  // Triggers an animation for a loss
  const loseTrigger = () => {
    setBoardStatus(3);
    setBoardAnimation("shake-animation"); 
    setTimeout(() => setBoardAnimation(""), 500);
  };

  // Triggers an animation for a win
  const winTrigger = () => {
    setBoardStatus(1);
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
    setBoard(Array(9).fill({ value: null, timer: null }));
    setPlayerPieces([]);
    setComputerPieces([]);
    setTotalMatches((prev) => prev + 1);
    setPlayerTurn(false);
    setComputerDelay((prevDelay) => Math.max(prevDelay - 50, 0));
    setTimeout(() => setBoardStatus(4), 500); // Delay to show the status with the edge color

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
              class={`w-full h-full flex items-center justify-center pt-0 text-6xl lg:text-9xl font-bold transition-all duration-300 ring-2 
                ${ darkMode ? 'bg-gray-700 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-400'}
                ${ boardStatus == 3 ? 'ring-red-900' : boardStatus == 2 ? 'ring-white' : boardStatus == 1 ? 'ring-green-800' : 'ring-transparent'}`}
              onClick={() => handleCellClick(index)}
            >
              {cell && cell.value && (
                <span
                  class={`${
                    cell.value === "X" ? "text-red-500" : "text-blue-500"
                  } animate-fade-in absolute`}
                  style={{
                    opacity: cell.timer ? cell.timer / 3 : cell.fadeOut ? 0 : 1,
                    transition: "opacity 0.05s linear"
                  }}
                >
                  {cell.value}
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
            {playerTurn ? "Your turn" : "Chappie's turn"}
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

import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { GameOverModal } from "../components/GameOverModal.tsx";

export function GameBoard() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [timer, setTimer] = useState(5);
  const [playerLives, setPlayerLives] = useState(3);
  const [computerLives, setComputerLives] = useState(3);
  const [playerPieces, setPlayerPieces] = useState<number[]>([]);
  const [computerPieces, setComputerPieces] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  
  const boardStyle = {
    transform: gameStarted ? "scale(1.8)" : "scale(1.5)",
    transition: "transform 0.5s ease-in-out",
  };

  useEffect(() => {
    if (IS_BROWSER && gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            handleTimeout();
            return 5;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStarted, playerTurn, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const pieceTimeout = setTimeout(() => {
        removePiece();
      }, 10000);

      return () => clearTimeout(pieceTimeout);
    }
  }, [playerPieces, computerPieces, gameOver]);

  const handleCellClick = (index: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (board[index] || !playerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setPlayerTurn(false);
    setTimer(5);
    setPlayerPieces([...playerPieces, index]);

    // Check for win
    if (checkWin(newBoard, "X")) {
      setGameOver(true);
      return;
    }

    // Computer's turn
    setTimeout(() => {
      computerMove(newBoard);
    }, 1000);
  };

  const computerMove = (currentBoard: (string | null)[]) => {
    if (gameOver) return;

    const emptyIndices = currentBoard.reduce(
      (acc, cell, idx) => (cell === null ? [...acc, idx] : acc),
      [] as number[]
    );
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const newBoard = [...currentBoard];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);
    setPlayerTurn(true);
    setTimer(5);
    setComputerPieces([...computerPieces, randomIndex]);

    // Check for win
    if (checkWin(newBoard, "O")) {
      setGameOver(true);
      return;
    }
  };

  const handleTimeout = () => {
    if (playerTurn) {
      if (playerPieces.length > 0) {
        removePiece();
      } else {
        setPlayerLives((prev) => {
          const newLives = prev - 1;
          if (newLives === 0) {
            setGameOver(true);
            setShowGameOverModal(true);
          } else {
            triggerShakeAnimation();
          }
          return newLives;
        });
      }
    } else {
      if (computerPieces.length > 0) {
        removePiece();
      } else {
        setComputerLives((prev) => {
          const newLives = prev - 1;
          if (newLives === 0) {
            setGameOver(true);
          } else {
            triggerShakeAnimation();
          }
          return newLives;
        });
      }
    }
    setTimer(5);
  };
  
  const removePiece = () => {
    if (playerPieces.length > 0) {
      const oldestPiece = playerPieces[0];
      const newBoard = [...board];
      newBoard[oldestPiece] = null;
      setBoard(newBoard);
      setPlayerPieces(playerPieces.slice(1));
    } else if (computerPieces.length > 0) {
      const oldestPiece = computerPieces[0];
      const newBoard = [...board];
      newBoard[oldestPiece] = null;
      setBoard(newBoard);
      setComputerPieces(computerPieces.slice(1));
    }
  };
  
  const triggerShakeAnimation = () => {
    document.body.classList.add('shake-horizontal');
    setTimeout(() => {
      document.body.classList.remove('shake-horizontal');
    }, 500);
  };  

  const checkWin = (board: (string | null)[], player: string) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    return winningCombos.some((combo) =>
      combo.every((index) => board[index] === player)
    );
  };

  const handleGameOverSubmit = (nickname: string) => {
    console.log(`Nickname: ${nickname}`);
    // Aquí enviarías el récord a tu API
    setShowGameOverModal(false);
    resetGame();
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard(Array(9).fill(null));
    setPlayerTurn(true);
    setTimer(5);
    setPlayerLives(3);
    setComputerLives(3);
    setPlayerPieces([]);
    setComputerPieces([]);
    setGameOver(false);
  };

  return (
    <div class="flex flex-col min-h-screen bg-gray-100 overflow-hidden">
      <Header gameStarted={gameStarted} />
      <main class="flex-grow flex items-center justify-center">
        <div
          class="w-96 h-96 grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow-lg"
          style={boardStyle}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              class="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold transition-all duration-300"
              onClick={() => handleCellClick(index)}
            >
              {cell && (
                <span
                  class={`${
                    cell === "X" ? "text-red-500" : "text-blue-500"
                  } animate-fade-in`}
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
          <div class="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 text-white text-center animate-slide-up">
            {playerTurn ? "Your turn" : "Computer's turn"} - Time left: {timer}s
          </div>
          <div class="fixed top-0 left-0 right-0 flex justify-between p-4 bg-gray-800 text-white animate-slide-down">
            <div>You: {playerLives} ❤️</div>
            <div>Chappie: {computerLives} ❤️</div>
          </div>
        </>
      )}
      {showGameOverModal && (
        <GameOverModal onSubmit={handleGameOverSubmit} />
      )}
    </div>
  );
}

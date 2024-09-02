export function GameGuideModal({
    onClose,
    darkMode
  }: {
    onClose: () => void,
    darkMode: boolean
  }) {

  return (
    <div class={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800 bg-opacity-75' : 'bg-gray-200 bg-opacity-75'}`}>
      <div class={`rounded-lg shadow-lg p-6 max-w-md w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h2 class="text-2xl font-bold mb-4">Game Guide</h2>
        <p class="mb-4">
          <strong>Objective:</strong> The goal of the game is to align three of your symbols (either 'X' or 'O') in a row, either horizontally, vertically, or diagonally.
        </p>
        <p class="mb-4">
          <strong>How to Play:</strong> You are playing against the computer. Click on any cell to place your symbol ('X'). The computer will then make its move with 'O'.
        </p>
        <p class="mb-4">
          <strong>Winning the Game:</strong> Align three of your symbols in a row to win. If all cells are filled and no one has three in a row, the game is a tie.
        </p>
        <p class="mb-4">
          <strong>Game Over:</strong> The game ends when either you or the computer wins, or all cells are filled resulting in a tie. If you lose, you will lose a life.
        </p>
        <div class="mb-4 flex justify-center">
          <a href="https://fresh.deno.dev">
            {darkMode ? (
              <img
                width="197"
                height="37"
                src="https://fresh.deno.dev/fresh-badge-dark.svg"
                alt="Made with Fresh"
                class="animate-fade-in"
              />
            ) : (
              <img
                width="197"
                height="37"
                src="https://fresh.deno.dev/fresh-badge.svg"
                alt="Made with Fresh"
                class="animate-fade-in"
              />
            )}
          </a>
        </div>
        <button
          class={`w-full text-white px-4 py-2 rounded-lg transition duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
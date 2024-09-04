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
        <h2 class="text-3xl font-bold mb-4 flex justify-center">Game Guide</h2>
        <p class="mb-4">
          <strong>How to Play:</strong> Come on, it's just a Tic Tac Toe but with lives and your marks disappear after some time.
        </p>
        <p class="mb-4">
          <strong>Objective:</strong> Resist as long as possible while the reaction time of the machine increases until you lose your 5 lives.
        </p>
        <p class="mb-4">
          <strong>Winning the Game:</strong> You can't win ¯\_(ツ)_/¯ but you can have the best record.
        </p>
        <p class="mb-4">
          <strong>Game Over:</strong> Ends when you lose all your lifes.
        </p>
        <div class="mb-4 flex justify-center">
          <p class="mt-1">All the web...</p>
          <a href="https://fresh.deno.dev">
            <img
              width="197"
              height="37"
              src={`https://fresh.deno.dev/fresh-badge${darkMode ? '-dark' : ''}.svg`}
              alt="Made with Fresh"
              class="animate-fade-in"
            />
          </a>
        </div>
        <button
          class={`w-full text-white px-4 py-2 rounded-lg transition duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={onClose}
        >
           <strong><i>Good Game</i></strong>
        </button>
      </div>
    </div>
  );
}
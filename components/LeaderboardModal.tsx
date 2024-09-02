export function LeaderboardModal({ onClose, darkMode }: { onClose: () => void, darkMode: boolean }) {
  return (
    <div class={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800 bg-opacity-75' : 'bg-gray-200 bg-opacity-75'}`}>
      <div class={`rounded-lg shadow-lg p-6 max-w-md w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h2 class="text-2xl font-bold mb-4">Leaderboard</h2>
        <p class="mb-4">
          Working in this section...
        </p>
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

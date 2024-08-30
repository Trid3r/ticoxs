export function LeaderboardModal({ onClose }: { onClose: () => void }) {
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div class="bg-white p-4 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-bold mb-4">Leaderboard</h2>
        <button
          onClick={onClose}
          class="mt-4 w-full py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

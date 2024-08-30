export function GameGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Game Guide</h2>
        <button
          class="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
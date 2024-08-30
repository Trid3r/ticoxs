import { useState } from "preact/hooks";

export function GameOverModal({ onSubmit }: { onSubmit: (nickname: string) => void }) {
  const [nickname, setNickname] = useState("");

  return (
    <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Game Over</h2>
        <input
          class="border p-2 rounded w-full"
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onInput={(e) => setNickname(e.currentTarget.value)}
        />
        <button
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => onSubmit(nickname)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

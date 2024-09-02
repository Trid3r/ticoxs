import { useState } from "preact/hooks";

export function GameOverModal({
    onSubmit,
    totalPlayerMarks,
    totalMatches,
    darkMode
  }: {
    onSubmit: (nickname: string) => void,
    totalPlayerMarks: number,
    totalMatches: number,
    darkMode: boolean
  }) {

  const [nickname, setNickname] = useState("");

  const isValidNickname = (name: string) => {
    const regex = /^[a-zA-Z0-9#@$^&*?!]{3,}$/;
    return regex.test(name);
  };

  const handleInputChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    setNickname(target.value);
  };

  const isSubmitDisabled = !isValidNickname(nickname);

  return (
    <div class={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-800 bg-opacity-75' : 'bg-gray-200 bg-opacity-75'}`}>
      <div class={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h2 class="text-xl font-bold mb-4 text-center">Game Over</h2>
        <p class="mb-4 text-center">Total Marks: {totalPlayerMarks}</p>
        <p class="mb-4 text-center">Total Matches: {totalMatches}</p>
        <input
          class={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onInput={handleInputChange}
        />
        <button
          class={`w-full px-4 py-2 rounded ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'} ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onSubmit(nickname)}
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

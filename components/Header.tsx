import { useState, useEffect } from "preact/hooks";

export function Header({ gameStarted, darkMode, toggleDarkMode }: { gameStarted: boolean; darkMode: boolean; toggleDarkMode: () => void }) {
  const [typedText, setTypedText] = useState("");
  const fullText = "TicOXs";

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  return (
    <>
    {!gameStarted && 
      <header class={`p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-600'} text-center transition-all duration-300`}>
        <h1 
          class="text-4xl sm:text-5xl font-bold inline-block"
          onClick={toggleDarkMode}
        >
          <span 
            class={`cursor-pointer transition-colors duration-300 ${
              darkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-50 hover:text-gray-700'
            }`}
          >
            {typedText}
          </span>
        </h1>
      </header>
    }
    </>
  );
}
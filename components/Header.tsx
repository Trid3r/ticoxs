export function Header({ gameStarted, darkMode, toggleDarkMode }: { gameStarted: boolean; darkMode: boolean; toggleDarkMode: () => void }) {

  return (
    <>
    {!gameStarted && 
      <header class="pt-3 sm:pt-4 bg-transparent text-center flex flex-col items-center">
        <h1 
          class="text-4xl sm:text-5xl font-bold inline-block"
          onClick={toggleDarkMode}
        >
          <span 
            class={`cursor-pointer transition-colors duration-300 ${
              darkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            TicOXs
          </span>
        </h1>
        <h2 class="pt-1 text-lg sm:text-xl font-mono animate-bounce flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-corner-left-down">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 6h-6a3 3 0 0 0 -3 3v10l-4 -4m8 0l-4 4" />
          </svg>
          <b class={`transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Start the game
          </b>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-corner-right-down">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 6h6a3 3 0 0 1 3 3v10l-4 -4m8 0l-4 4" />
          </svg>
        </h2>
      </header>
    }
    </>
  );
}
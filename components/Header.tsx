export function Header({ gameStarted }: { gameStarted: boolean }) {
  return (
    <header class={`p-4 bg-blue-500 text-white text-center transition-all duration-300 ${gameStarted ? '-translate-y-full' : ''}`}>
      <h1 class="text-4xl font-bold">TicOXs</h1>
    </header>
  );
}
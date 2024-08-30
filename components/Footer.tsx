import { useState, useEffect } from "preact/hooks";
import { LeaderboardModal } from "../components/LeaderboardModal.tsx";
import { GameGuideModal } from "../components/GameGuideModal.tsx";

export function Footer({ gameStarted }: { gameStarted: boolean }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGameGuide, setShowGameGuide] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        setShowLeaderboard(false);
        setShowGameGuide(false);
      }, 5000);
    }
  }, [gameStarted]);

  return (
    <>
      <footer class={`p-4 bg-transparent text-center transition-all duration-300 ${gameStarted ? 'slide-down' : ''}`}>
        <button onClick={() => setShowLeaderboard(true)} class="mx-2 px-4 py-2 bg-blue-500 text-white rounded">Leaderboard</button>
        <button onClick={() => setShowGameGuide(true)} class="mx-2 px-4 py-2 bg-green-500 text-white rounded">Game Guide</button>
        <a href="https://github.com/your-repo" class="mx-2 px-4 py-2 bg-gray-500 text-white rounded">GitHub</a>
      </footer>
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
      {showGameGuide && <GameGuideModal onClose={() => setShowGameGuide(false)} />}
    </>
  );
}

import { useState, useEffect } from "preact/hooks";
import { LeaderboardModal } from "../components/LeaderboardModal.tsx";
import { GameGuideModal } from "../components/GameGuideModal.tsx";

export function Footer({ gameStarted }: { gameStarted: boolean }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGameGuide, setShowGameGuide] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      setShowLeaderboard(false);
      setShowGameGuide(false);
    }
  }, [gameStarted]);

  return (
    <>
      {!gameStarted && 
        <footer class="pb-7 sm:pb-6 bg-transparent text-center transition-all duration-300">
          <button onClick={() => setShowLeaderboard(true)} class="mx-2 sm:mx-8 px-2 sm:px-4 py-1 sm:py-2 text-lg sm:text-base bg-blue-500 text-white rounded">Leaderboard</button>
          <button onClick={() => setShowGameGuide(true)} class="mx-2 sm:mx-8 px-2 sm:px-4 py-1 sm:py-2 text-lg sm:text-base bg-green-500 text-white rounded">Game Guide</button>
          <a href="https://github.com/your-repo" class="mx-2 sm:mx-8 px-2 sm:px-4 py-1 sm:py-2 text-lg sm:text-base bg-gray-500 text-white rounded">GitHub</a>
        </footer>
      }
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
      {showGameGuide && <GameGuideModal onClose={() => setShowGameGuide(false)} />}
    </>
  );
}
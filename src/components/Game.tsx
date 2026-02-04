'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '@/game/GameEngine';

type GameScreen = 'start' | 'playing' | 'gameover';

export function Game() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameEngine | null>(null);
  const [screen, setScreen] = useState<GameScreen>('start');
  const [userScore, setUserScore] = useState(0);
  const [happyFaceScore, setHappyFaceScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showHit, setShowHit] = useState(false);
  const [showGoalMessage, setShowGoalMessage] = useState(false);
  const [showNewHighIndicator, setShowNewHighIndicator] = useState(false);

  const handleScoreUpdate = useCallback((newUserScore: number, newHappyFaceScore: number, newHighScore: number) => {
    setUserScore(newUserScore);
    setHappyFaceScore(newHappyFaceScore);
    setHighScore(newHighScore);
    setShowGoalMessage(newUserScore >= 40 && newUserScore <= 60);
    setShowNewHighIndicator(newUserScore > newHighScore);
  }, []);

  const handleGameOver = useCallback((score: number, high: number, isNew: boolean) => {
    setFinalScore(score);
    setHighScore(high);
    setIsNewHighScore(isNew);
    setScreen('gameover');
  }, []);

  const handleHit = useCallback(() => {
    setShowHit(true);
    setTimeout(() => setShowHit(false), 100);
  }, []);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const game = new GameEngine(containerRef.current);
    game.setCallbacks(handleScoreUpdate, handleGameOver, handleHit);
    gameRef.current = game;
    setHighScore(game.getHighScore());

    return () => {
      game.dispose();
      gameRef.current = null;
    };
  }, [handleScoreUpdate, handleGameOver, handleHit]);

  const startGame = () => {
    setScreen('playing');
    setShowNewHighIndicator(false);
    gameRef.current?.startGame();
  };

  const playAgain = () => {
    gameRef.current?.resetGame();
    setScreen('playing');
    setShowNewHighIndicator(false);
    gameRef.current?.startGame();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Game Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Hit Flash Effect */}
      {showHit && (
        <div className="fixed inset-0 bg-red-500/30 pointer-events-none z-50 animate-pulse" />
      )}

      {/* Score Display - Only during gameplay */}
      {screen === 'playing' && (
        <>
          {/* User Score */}
          <div className="absolute top-2.5 right-2.5 text-white text-2xl md:text-4xl font-sans transition-transform">
            User Score: {userScore}
          </div>

          {/* Happy Face Score */}
          <div className="absolute top-2.5 left-2.5 text-white text-2xl md:text-4xl font-sans transition-transform">
            Happy Face: {happyFaceScore}
          </div>

          {/* High Score */}
          <div className="absolute top-14 right-2.5 text-yellow-400 text-lg md:text-2xl font-sans">
            🏆 High Score: {highScore}
          </div>

          {/* New High Score Indicator */}
          {showNewHighIndicator && (
            <div className="absolute top-24 right-2.5 text-yellow-400 text-lg md:text-xl font-sans animate-pulse">
              🎉 NEW HIGH SCORE!
            </div>
          )}

          {/* Goal Message */}
          {showGoalMessage && (
            <div className="absolute top-32 left-1/2 -translate-x-1/2 text-cyan-400 text-xl md:text-2xl font-sans text-center bg-black/70 px-6 py-4 rounded-lg">
              🎯 After 50 points: CATCH the projectiles!
            </div>
          )}
        </>
      )}

      {/* Start Screen */}
      {screen === 'start' && (
        <div className="fixed inset-0 bg-black/85 flex flex-col justify-center items-center z-[100] text-white font-sans">
          <div className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-lg mb-8">
            😊 HappyFace
          </div>
          <div className="text-lg md:text-2xl text-center max-w-xl leading-relaxed mb-10 px-4">
            <div className="bg-white/10 px-6 py-4 rounded-lg my-2.5 border-l-4 border-red-400">
              <strong>Phase 1 (0-50 points):</strong><br />
              DODGE the projectiles! The smiley shoots at your cursor.
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-lg my-2.5 border-l-4 border-cyan-400">
              <strong>Phase 2 (50+ points):</strong><br />
              CATCH the projectiles! Now you want to get hit.
            </div>
            <p className="mt-5 text-gray-400">
              Don&apos;t let the smiley reach 100 points or it wins!
            </p>
          </div>
          <button
            onClick={startGame}
            className="text-xl md:text-2xl px-12 py-5 bg-gradient-to-br from-yellow-400 to-orange-500 border-none rounded-full text-gray-800 font-bold cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Click to Start
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {screen === 'gameover' && (
        <div className="fixed inset-0 bg-black/85 flex flex-col justify-center items-center z-[100] text-white font-sans">
          <div className="text-4xl md:text-6xl text-red-400 mb-5">
            😈 Happy Face Wins!
          </div>
          <div className="text-2xl md:text-4xl my-4">
            Your Score: {finalScore}
          </div>
          <div className="text-xl md:text-2xl text-yellow-400 my-2.5 mb-8">
            High Score: {highScore}
          </div>
          {isNewHighScore && (
            <div className="text-2xl md:text-3xl text-cyan-400 animate-pulse mb-5">
              🎉 NEW HIGH SCORE! 🎉
            </div>
          )}
          <button
            onClick={playAgain}
            className="text-xl md:text-2xl px-12 py-5 bg-gradient-to-br from-yellow-400 to-orange-500 border-none rounded-full text-gray-800 font-bold cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

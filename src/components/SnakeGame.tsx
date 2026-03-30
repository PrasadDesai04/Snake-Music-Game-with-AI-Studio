import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    speed: INITIAL_SPEED,
  });

  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]),
      direction: 'UP',
      isGameOver: false,
      score: 0,
      speed: INITIAL_SPEED,
    }));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || isPaused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        if (prev.score > prev.highScore) {
          localStorage.setItem('snakeHighScore', prev.score.toString());
        }
        return { ...prev, isGameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;

      // Check food
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
        newSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed,
      };
    });
  }, [gameState.isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (gameState.direction !== 'DOWN') setGameState(s => ({ ...s, direction: 'UP' })); break;
        case 'ArrowDown': if (gameState.direction !== 'UP') setGameState(s => ({ ...s, direction: 'DOWN' })); break;
        case 'ArrowLeft': if (gameState.direction !== 'RIGHT') setGameState(s => ({ ...s, direction: 'LEFT' })); break;
        case 'ArrowRight': if (gameState.direction !== 'LEFT') setGameState(s => ({ ...s, direction: 'RIGHT' })); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    if (!isPaused && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, gameState.speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameState.isGameOver, moveSnake, gameState.speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-black/40 backdrop-blur-md rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-cyan-500/60 font-mono">Score</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono">{gameState.score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-pink-500/60 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-pink-500" />
            <span className="text-2xl font-bold text-pink-400 font-mono">{gameState.highScore}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-slate-900/80 rounded-xl overflow-hidden border-2 border-cyan-500/20"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500/30" />
          ))}
        </div>

        {/* Snake */}
        {gameState.snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute rounded-sm transition-all duration-150 ${
              i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10' : 'bg-cyan-600/80'
            }`}
            style={{
              width: '20px',
              height: '20px',
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          style={{
            width: '16px',
            height: '16px',
            left: gameState.food.x * 20 + 2,
            top: gameState.food.y * 20 + 2,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isPaused || gameState.isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              {gameState.isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-pink-500 uppercase tracking-tighter mb-4 italic">Game Over</h2>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/40"
                  >
                    <RotateCcw size={20} />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-cyan-500 uppercase tracking-tighter mb-4 italic">Paused</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/40"
                  >
                    <Play size={20} fill="currentColor" />
                    Resume
                  </button>
                  <p className="mt-4 text-cyan-500/60 text-xs font-mono">Press SPACE to toggle</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-cyan-500/40 text-[10px] font-mono uppercase tracking-[0.2em]">
        Use Arrow Keys to Navigate
      </div>
    </div>
  );
};

export default SnakeGame;

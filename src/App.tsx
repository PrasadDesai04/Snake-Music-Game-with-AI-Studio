import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/5 blur-[100px] rounded-full" />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12">
        <header className="text-center space-y-2">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Neon Beats
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-cyan-500/60 font-mono text-sm tracking-[0.3em] uppercase"
          >
            Snake & Sound Synthesis
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto"
          >
            <SnakeGame />
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full lg:w-auto flex flex-col gap-6"
          >
            <MusicPlayer />
            
            <div className="p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-pink-500/30 shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)]">
              <h4 className="text-pink-500 font-mono text-xs uppercase tracking-widest mb-4">Instructions</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-medium">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                  Use Arrow Keys to control the snake
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                  Press Space to pause/resume game
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
                  Eat pink orbs to grow and speed up
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto pt-8 text-gray-600 font-mono text-[10px] uppercase tracking-[0.4em]">
          &copy; 2026 Neon Synth Systems // v1.0.4
        </footer>
      </main>
    </div>
  );
}

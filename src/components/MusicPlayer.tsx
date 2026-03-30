import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-purple-500/30 shadow-[0_0_50px_-12px_rgba(168,85,247,0.5)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-6">
        <div className="relative group">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 p-1"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-black rounded-full border border-purple-500/50" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-purple-400 font-medium text-sm truncate">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center gap-2">
            <Music size={14} className="text-purple-500" />
            <div className="flex-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="text-purple-400 hover:text-purple-300 transition-colors">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg shadow-purple-500/40"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="text-purple-400 hover:text-purple-300 transition-colors">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-purple-400/60">
          <Volume2 size={18} />
          <div className="w-16 h-1 bg-purple-900/30 rounded-full">
            <div className="w-2/3 h-full bg-purple-500/50 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-purple-500/10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {DUMMY_TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                index === currentTrackIndex 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/40'
              }`}
            >
              {track.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

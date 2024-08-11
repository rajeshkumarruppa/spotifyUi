import React, { useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import '../App.css';

const Player = ({ song, isPlaying, setIsPlaying, handleNext, handlePrevious }) => {
  const audioRef = useRef(new Audio(`https://cms.samespace.com/assets/${song.url}`));

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, song]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="player">
      <img src={`https://cms.samespace.com/assets/${song.cover}`} alt={song.name} />
      <div className="player-info">
        <h2>{song.name}</h2>
        <p>{song.artist}</p>
      </div>
      <div className="player-controls">
        <FaBackward className="control-icon" onClick={handlePrevious} />
        {isPlaying ? (
          <FaPause className="control-icon" onClick={handlePlayPause} />
        ) : (
          <FaPlay className="control-icon" onClick={handlePlayPause} />
        )}
        <FaForward className="control-icon" onClick={handleNext} />
      </div>
      
    </div>
  );
};

export default Player;

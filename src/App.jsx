

import axios from 'axios';
import { FaPlay, FaPause, FaForward, FaBackward, FaBars } from 'react-icons/fa';
import Vibrant from 'node-vibrant';
import './App.css';
import Profile from './Profile';

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('#121212'); // Default dark color
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await axios.get('https://cms.samespace.com/items/songs');
      setSongs(response.data.data);
      setFilteredSongs(response.data.data);
    };
    fetchSongs();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs(songs.filter(song =>
        song.name.toLowerCase().includes(term.toLowerCase()) ||
        song.artist.toLowerCase().includes(term.toLowerCase())
      ));
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    setCurrentSong(filteredSongs[nextIndex]);
    setIsPlaying(true);
    updateBackgroundColor(filteredSongs[nextIndex].cover);
  };

  const handlePrevious = () => {
    const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setCurrentSong(filteredSongs[prevIndex]);
    setIsPlaying(true);
    updateBackgroundColor(filteredSongs[prevIndex].cover);
  };

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    updateBackgroundColor(song.cover);
  };

  const updateBackgroundColor = (coverImage) => {
    Vibrant.from(`https://cms.samespace.com/assets/${coverImage}`).getPalette()
      .then(palette => {
        const dominantColor = palette.Vibrant.hex;
        setBackgroundColor(dominantColor);
      });
  };

  useEffect(() => {
    if (currentSong) {
      if (audioRef.current) {
        audioRef.current.src = currentSong.url;
        audioRef.current.play();
        audioRef.current.addEventListener('timeupdate', () => {
          setCurrentTime(audioRef.current.currentTime);
        });
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current.duration);
        });
      }
    }
  }, [currentSong]);

  const handleSeek = (event) => {
    const seekTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="app" style={{ backgroundColor }}>
      <Profile />
      <div className={`sidebar ${showMenu ? 'show' : ''}`}>
        <div className="tabs">
          <span className="tabs-h">For You</span>
          <span className="tabs-t">Top Tracks</span>
        </div>
        <div className='searchBar-card'>
          
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={searchTerm}
          onChange={handleSearch}
          className='searchBar-style'
        />
        </div>
        <div className="song-list">
          {filteredSongs.map(song => (
            <div
              key={song.id}
              className={`song-item ${currentSong && currentSong.id === song.id ? 'active' : ''}`}
              onClick={() => handleSongClick(song)}
            >
              <img className="img-size" src={`https://cms.samespace.com/assets/${song.cover}`} alt={song.name} />
              <div className="song-info">
                <div>
                  <div className="song-title">{song.name}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
                <div>
                  <p className="song-duration">{"4:12"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="main">
        <FaBars className="menu-icon" onClick={() => setShowMenu(!showMenu)} />
        {currentSong && (
          <><div>
            <div className="song-details">
              <h3 className='head-player'>{currentSong.name}</h3>
              <p className='para-player'>{currentSong.artist}</p>
            </div>
            <div className='player-card'>
            <img className="player-image" src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt={currentSong.name} />
            
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100}
              onChange={handleSeek}
              className="seek-bar"
            />
            <audio ref={audioRef} />
            <div className="controls">
              <FaBackward onClick={handlePrevious} />
              {isPlaying ? (
                <FaPause onClick={handlePlayPause} />
              ) : (
                <FaPlay onClick={handlePlayPause} />
              )}
              <FaForward onClick={handleNext} />
            </div>
            </div>
            
            
            </div>
            
          </>
        )}
      </div>
    </div>
  );
};

export default App;
import React, { useState, useEffect, useRef } from 'react';

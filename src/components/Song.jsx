import React from 'react';
import '../App.css';

const Song = ({ song, onSongChange }) => {
  return (
    <div className="song" onClick={onSongChange}>
      <img src={`https://cms.samespace.com/assets/${song.cover}`} alt={song.name} />
      <div className="song-info">
        <h3>{song.name}</h3>
        <p>{song.artist}</p>
      </div>
      <span className="song-duration">{"4.12"}</span>
    </div>
  );
};

export default Song;

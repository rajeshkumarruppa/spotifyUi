import React from 'react';
import Song from './Song';
import '../App.css';

const SongList = ({ songs, onSongChange }) => {
  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <Song key={song.id} song={song} onSongChange={() => onSongChange(index)} />
      ))}
    </div>
  );
};

export default SongList;

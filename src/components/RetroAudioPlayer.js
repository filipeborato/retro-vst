import React, { useState, useEffect, useRef } from "react";
import "../styles/RetroAudioPlayer.css";

function RetroAudioPlayer({ src, isPreview }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);

  // Auto-play when the source audio file changes (just like default <audio autoPlay />)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      audioRef.current.volume = prevVolume;
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      audioRef.current.muted = true;
      setIsMuted(true);
      setVolume(0);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setVolume(newVol);
      if (newVol > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div className={`retro-player ${isPreview ? "is-preview" : ""}`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="player-controls">
        <button
          type="button"
          className={`player-btn play-btn ${isPlaying ? "playing" : ""}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <span className="pause-icon">■</span>
          ) : (
            <span className="play-icon">▶</span>
          )}
        </button>

        <div className="progress-container">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="player-slider progress-bar"
            style={{
              background: `linear-gradient(to right, var(--progress-color) ${progressPercent}%, var(--c-void) ${progressPercent}%)`
            }}
          />
        </div>

        <div className="time-readout">
          <span className="time-current">{formatTime(currentTime)}</span>
          <span className="time-sep">/</span>
          <span className="time-duration">{formatTime(duration)}</span>
        </div>

        <div className="volume-container">
          <button
            type="button"
            className={`player-btn volume-btn ${isMuted ? "muted" : ""}`}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolumeChange}
            className="player-slider volume-slider"
            style={{
              background: `linear-gradient(to right, var(--progress-color) ${volumePercent}%, var(--c-void) ${volumePercent}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default RetroAudioPlayer;

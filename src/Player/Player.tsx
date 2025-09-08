import React, { useState, useRef, useEffect } from "react";
import "./Player.css";

type PlayerProps = {
    image_url: string;
    name: string;
    artists: string;
    audio_url: string; // Add audio URL prop
};

export const Player: React.FC<PlayerProps> = ({ image_url, name, artists, audio_url }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set initial volume
        audio.volume = volume;

        // Event listeners
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [volume]);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const handlePrevious = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    };

    const handleNext = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.min(duration, audio.currentTime + 10);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        const progressBar = progressBarRef.current;
        if (!audio || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * duration;

        audio.currentTime = newTime;
    };

    const formatTime = (time: number): string => {
        if (!isFinite(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="container">
            {/* Hidden audio element */}
            <audio ref={audioRef} src={audio_url} preload="metadata" />

            <div className="block left-block">
                <img
                    alt="track_logo"
                    src={image_url}
                    style={{ width: '20%', aspectRatio: '1 / 1' }}
                />
                <div>
                    <p className="track-name">{name}</p>
                    <p className="track-artists">{artists}</p>
                </div>
            </div>

            <div className="block central-block">
                <div className="controls">
                    <img
                        src="/assets/Prev.png"
                        alt="previous"
                        className="icon control-icon"
                        onClick={handlePrevious}
                    />
                    <img
                        src={isPlaying ? "/assets/Pause.png" : "/assets/Play.png"}
                        alt={isPlaying ? "pause" : "play"}
                        className="icon control-icon play-icon"
                        onClick={togglePlay}
                    />
                    <img
                        src="/assets/Next.png"
                        alt="next"
                        className="icon control-icon"
                        onClick={handleNext}
                    />
                </div>

                <div className="progress-section">
                    <div className="time-info">
                        <span className="current-time">{formatTime(currentTime)}</span>
                        <span className="duration">{formatTime(duration)}</span>
                    </div>
                    <div
                        className="progress-bar"
                        ref={progressBarRef}
                        onClick={handleProgressClick}
                    >
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="progress-handle"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
import { AudioLines } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Song from "../../assets/song1.mp3";
import { toast } from "react-toastify";

export default function MusicPlayer(): JSX.Element {
    const [playing, setPlaying] = useState<boolean>(false);
    const audioRef = useRef(new Audio(Song));
    const fadeIntervalRef = useRef<number | undefined>(undefined);
    const [progress, setProgress] = useState<number>(0);
    const BPM = 130;
    const pulseDuration = 60 / BPM;

    const fadeOut = () => {
        if (fadeIntervalRef.current !== undefined) {
            clearInterval(fadeIntervalRef.current);
        }

        fadeIntervalRef.current = window.setInterval(() => {
            if (audioRef.current.volume > 0.01) {
                audioRef.current.volume -= 0.01;
            } else {
                audioRef.current.pause();
                clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = undefined;
                audioRef.current.volume = 0.25;
            }
        }, 25);
    };

    const fadeIn = async () => {
        if (fadeIntervalRef.current !== undefined) {
            clearInterval(fadeIntervalRef.current);
        }

        audioRef.current.volume = 0;
        try {
            await audioRef.current.play();
            fadeIntervalRef.current = window.setInterval(() => {
                if (audioRef.current.volume < 0.25) {
                    audioRef.current.volume += 0.01;
                } else {
                    clearInterval(fadeIntervalRef.current);
                    fadeIntervalRef.current = undefined;
                }
            }, 15);
        } catch (e) {
            toast.error("Failed to play audio");
        }
    };

    useEffect(() => {
        playing ? fadeIn() : fadeOut();
        audioRef.current.loop = true;

        const updateProgress = () => {
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((audioRef.current.currentTime / duration) * 100);
            }
        };

        audioRef.current.addEventListener("timeupdate", updateProgress);

        return () => {
            if (fadeIntervalRef.current !== undefined) {
                clearInterval(fadeIntervalRef.current);
            }
            audioRef.current.removeEventListener("timeupdate", updateProgress);
        };
    }, [playing]);

    const circumference = 50 * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <button 
            onClick={() => setPlaying(!playing)}
            className={`absolute bottom-4 right-4 flex aspect-square size-fit items-center justify-center rounded-full bg-zinc-800 p-3 shadow-2xl ${playing ? 'pulse' : ''}`}
            style={{ animationDuration: `${pulseDuration}s` }}>
            <svg className="absolute" width="115%" height="115%" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="currentColor"
                    className={`${playing ? 'text-fuchsia-600' : 'text-fuchsia-800'} transition-all duration-100 ease-in-out`}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <AudioLines size={20} className={`${playing ? 'animate-pulse text-fuchsia-500' : 'text-gray-600'}`} />
        </button>
    );
}

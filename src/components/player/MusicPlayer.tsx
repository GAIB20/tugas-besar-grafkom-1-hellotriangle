import { AudioLines } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Song from "../../assets/song1.mp3";
import { toast } from "react-toastify";

export default function MusicPlayer(): JSX.Element {

    const [playing, setPlaying] = useState<boolean>(false);
    const audioRef = useRef(new Audio(Song));
    const fadeIntervalRef = useRef<number | undefined>(undefined);

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

        return () => {
            if (fadeIntervalRef.current !== undefined) {
                clearInterval(fadeIntervalRef.current);
            }
        };
    }, [playing]);

    return (
        <button 
            onClick={() => setPlaying(!playing)}
            className="absolute bottom-4 right-4 aspect-square size-fit rounded-full bg-zinc-800 p-3 shadow-2xl">
            <AudioLines size={20} className={`${playing ? 'animate-pulse text-fuchsia-500' : 'text-gray-600'}`} />
        </button>
    )
}
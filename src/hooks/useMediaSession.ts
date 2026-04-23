import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { skipNext, skipPrev, togglePlay } from "../app/playerSlice";
import { useGetSongsQuery } from "../services/woundedApi";

const buildSilentAudio = (): HTMLAudioElement => {
    const sampleRate = 8000;
    const numSamples = sampleRate;
    const buf = new ArrayBuffer(44 + numSamples);
    const v = new DataView(buf);
    const str = (off: number, s: string) => {
        for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i));
    };
    str(0, "RIFF");
    v.setUint32(4, 36 + numSamples, true);
    str(8, "WAVE");
    str(12, "fmt ");
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, sampleRate, true);
    v.setUint32(28, sampleRate, true);
    v.setUint16(32, 1, true);
    v.setUint16(34, 8, true);
    str(36, "data");
    v.setUint32(40, numSamples, true);
    for (let i = 0; i < numSamples; i++) v.setUint8(44 + i, 128);
    const url = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
    const audio = new Audio(url);
    audio.loop = true;
    return audio;
};

export const useMediaSession = () => {
    const dispatch = useAppDispatch();
    const { currentSong, isPlaying } = useAppSelector(state => state.player);
    const { data: songs = [] } = useGetSongsQuery();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = buildSilentAudio();
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!("mediaSession" in navigator)) return;
        navigator.mediaSession.setActionHandler("play", () => dispatch(togglePlay()));
        navigator.mediaSession.setActionHandler("pause", () => dispatch(togglePlay()));
        navigator.mediaSession.setActionHandler("previoustrack", () => dispatch(skipPrev(songs)));
        navigator.mediaSession.setActionHandler("nexttrack", () => dispatch(skipNext(songs)));
        return () => {
            navigator.mediaSession.setActionHandler("play", null);
            navigator.mediaSession.setActionHandler("pause", null);
            navigator.mediaSession.setActionHandler("previoustrack", null);
            navigator.mediaSession.setActionHandler("nexttrack", null);
        };
    }, [dispatch, songs]);

    useEffect(() => {
        if (!("mediaSession" in navigator)) return;
        navigator.mediaSession.metadata = currentSong
            ? new MediaMetadata({ title: currentSong.title, artist: currentSong.artist, album: currentSong.album })
            : null;
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !("mediaSession" in navigator)) return;
        if (isPlaying && currentSong) {
            audio.play().catch(() => {});
            navigator.mediaSession.playbackState = "playing";
        } else {
            audio.pause();
            navigator.mediaSession.playbackState = currentSong ? "paused" : "none";
        }
    }, [isPlaying, currentSong]);
};

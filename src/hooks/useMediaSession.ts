import type { MediaPlayerClass } from "dashjs";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setProgress, skipNext, skipPrev, togglePlay } from "../app/playerSlice";
import { getServiceUrl } from "../services/config";
import { useGetSongsQuery } from "../services/woundedApi";

const getTrackStreamUrl = (trackId: string) => getServiceUrl("streaming", `/stream/dash/${trackId}/manifest.mpd`);

export const useMediaSession = () => {
    const dispatch = useAppDispatch();
    const { currentSong, isPlaying, volume, progress } = useAppSelector(state => state.player);
    const { data: songs = [] } = useGetSongsQuery();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playerRef = useRef<MediaPlayerClass | null>(null);
    const activeTrackIdRef = useRef<string | null>(null);
    const progressRef = useRef(0);

    useEffect(() => {
        const audio = new Audio();
        let isDisposed = false;
        const handleTimeUpdate = () => {
            if (!audio.duration || Number.isNaN(audio.duration)) {
                dispatch(setProgress(0));
                progressRef.current = 0;
                return;
            }

            const nextProgress = Math.min(100, (audio.currentTime / audio.duration) * 100);
            progressRef.current = nextProgress;
            dispatch(setProgress(nextProgress));
        };

        const handleEnded = () => {
            dispatch(skipNext(songs));
        };

        audio.preload = "auto";
        audio.crossOrigin = "anonymous";
        audioRef.current = audio;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        void import("dashjs").then(({ MediaPlayer }) => {
            if (isDisposed) {
                return;
            }

            const player = MediaPlayer().create();
            player.initialize(audio, undefined, false);
            playerRef.current = player;
        });

        return () => {
            isDisposed = true;
            audio.pause();
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
            playerRef.current?.reset();
            playerRef.current = null;
            audioRef.current = null;
        };
    }, [dispatch, songs]);

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
        const player = playerRef.current;

        if (!audio || !player) {
            return;
        }

        if (!currentSong) {
            activeTrackIdRef.current = null;
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
            dispatch(setProgress(0));

            if ("mediaSession" in navigator) {
                navigator.mediaSession.playbackState = "none";
            }

            return;
        }

        const trackChanged = activeTrackIdRef.current !== currentSong.id;

        if (trackChanged) {
            activeTrackIdRef.current = currentSong.id;
            progressRef.current = 0;
            dispatch(setProgress(0));
            player.attachSource(getTrackStreamUrl(currentSong.id));
        }

        if (Math.abs(progress - progressRef.current) > 2 && audio.duration && Number.isFinite(audio.duration)) {
            audio.currentTime = (progress / 100) * audio.duration;
        }

        if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
        }

        if (!isPlaying) {
            audio.pause();
            return;
        }

        audio.play().catch(() => {
            dispatch(togglePlay());
        });
    }, [currentSong, dispatch, isPlaying, progress]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.volume = volume / 100;
    }, [volume]);
};

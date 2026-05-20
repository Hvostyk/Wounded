import { ChangeEvent, useRef } from "react";
import { Song } from "../../../services/types";
import { useUploadTrackMutation } from "../../../services/woundedApi"; // Импортируем хук
import { SongCardSkeleton } from "../Skeleton";
import { SongCard } from "../SongCard";
import "./style.scss";

interface SongSectionProps {
    title: string;
    songs: Song[];
    currentSongId?: string;
    isLoading?: boolean;
    skeletonCount?: number;
    emptyText?: string;
    onSongClick: (song: Song) => void;
}

export const SongSection = ({ title, songs, currentSongId, isLoading, skeletonCount = 4, emptyText = "Нет треков", onSongClick }: SongSectionProps) => {
    const skeletons = Array.from({ length: skeletonCount });
    const fileInputRef = useRef<HTMLInputElement>(null);
    //TODO нужно будет нормально реализовать
    // Инициализируем мутацию из RTK Query
    const [uploadTrack, { isLoading: isUploading }] = useUploadTrackMutation();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Вырезаем расширение для красивого названия
        // Отрезаем расширение файла (.mp3 / .wav)
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

        // Обрезаем строку до 32 символов, чтобы пройти валидацию бэкенда
        const trackTitle = cleanTitle.length > 32 ? cleanTitle.slice(0, 32) : cleanTitle;

        try {
            // Вызываем мутацию, передавая объект. Токены подставятся сами!
            await uploadTrack({ file, title: trackTitle }).unwrap();
            console.log("Успешно загружено через RTK Query!");
        } catch (error) {
            console.error("Ошибка при загрузке трека через RTK Query:", error);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <section className="songs-section">
            <h3 className="songs-section__title">{title}</h3>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".mp3,.wav" style={{ display: "none" }} />

            <button onClick={handleButtonClick} disabled={isUploading} className="songs-section__upload-btn">
                {isUploading ? "Загрузка..." : "Добавить трек"}
            </button>

            <div className="songs-grid">
                {isLoading ? (
                    skeletons.map((_, index) => <SongCardSkeleton key={index} />)
                ) : songs.length === 0 ? (
                    <p className="songs-section__empty">{emptyText}</p>
                ) : (
                    songs.map(song => <SongCard key={song.id} song={song} isActive={currentSongId === song.id} onClick={onSongClick} />)
                )}
            </div>
        </section>
    );
};

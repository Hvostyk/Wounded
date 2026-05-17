import { Song } from "../../../services/types";
import { SongCardSkeleton } from "../Skeleton";
import { SongCard } from "../SongCard";
import "./style.scss";

interface SongSectionProps {
    title: string;
    songs: Song[];
    currentSongId?: number;
    isLoading?: boolean;
    skeletonCount?: number;
    emptyText?: string;
    onSongClick: (song: Song) => void;
}

export const SongSection = ({ title, songs, currentSongId, isLoading, skeletonCount = 4, emptyText = "Нет треков", onSongClick }: SongSectionProps) => {
    const skeletons = Array.from({ length: skeletonCount });

    return (
        <section className="songs-section">
            <h3 className="songs-section__title">{title}</h3>
            <div className="songs-grid">
                {isLoading ? (
                    skeletons.map((_, i) => <SongCardSkeleton key={i} />)
                ) : songs.length === 0 ? (
                    <p className="songs-section__empty">{emptyText}</p>
                ) : (
                    songs.map(song => <SongCard key={song.id} song={song} isActive={currentSongId === song.id} onClick={onSongClick} />)
                )}
            </div>
        </section>
    );
};

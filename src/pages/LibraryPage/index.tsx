import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { playSong } from "../../app/playerSlice";
import { Song } from "../../services/types";
import { useGetFavoriteSongsQuery } from "../../services/woundedApi";
import { FilterBar } from "../../shared/HvostykUI/FilterBar";
import { SongSection } from "../../shared/HvostykUI/SongSection";
import { filterSongs } from "../../utils/songUtils";
import "./style.scss";

export const LibraryPage = () => {
    const dispatch = useAppDispatch();
    const { data: favoriteSongs = [], isLoading } = useGetFavoriteSongsQuery();
    const favoriteIds = useAppSelector(state => state.favorites.favoriteIds);
    const currentSongId = useAppSelector(state => state.player.currentSong?.id);
    const filters = useAppSelector(state => state.filter);

    const filtered = filterSongs(favoriteSongs, filters);

    const handleSongClick = (song: Song) => dispatch(playSong(song));

    return (
        <div className="library-page">
            <h4 className="library-page__title">Библиотека</h4>
            <FilterBar />
            <SongSection
                title={`Избранное (${favoriteIds.length})`}
                songs={filtered}
                currentSongId={currentSongId}
                isLoading={isLoading}
                emptyText="Нет избранных треков."
                onSongClick={handleSongClick}
            />
        </div>
    );
};

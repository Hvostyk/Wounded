import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { playSong } from "../../app/playerSlice";
import { Song } from "../../services/types";
import { useGetSongsQuery } from "../../services/woundedApi";
import { FilterBar } from "../../shared/HvostykUI/FilterBar";
import { SongSection } from "../../shared/HvostykUI/SongSection";
import { filterSongs, getGreeting } from "../../utils/songUtils";
import "./style.scss";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { login } = useAppSelector(state => state.auth);
    const { data: songs = [], isLoading } = useGetSongsQuery();
    const currentSongId = useAppSelector(state => state.player.currentSong?.id);
    const filters = useAppSelector(state => state.filter);

    const filtered = filterSongs(songs, filters);
    const featured = filtered.slice(0, 4);
    const rest = filtered.slice(4);

    const handleSongClick = (song: Song) => dispatch(playSong(song));

    return (
        <div className="home-content">
            <h4 className="home-greeting">
                {getGreeting()},&nbsp;<span className="home-greeting__name">{login}</span>!
            </h4>
            <FilterBar />
            <SongSection
                title="Рекомендуем"
                songs={featured}
                currentSongId={currentSongId}
                isLoading={isLoading}
                skeletonCount={4}
                onSongClick={handleSongClick}
            />
            {rest.length > 0 && (
                <SongSection title="Все треки" songs={rest} currentSongId={currentSongId} isLoading={isLoading} onSongClick={handleSongClick} />
            )}
        </div>
    );
};

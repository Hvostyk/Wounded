import { HeartFilled, HeartOutlined, PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import { addToPlaylist, toggleFavorite } from "../../../app/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Song } from "../../../services/types";
import "./style.scss";

interface SongCardProps {
    song: Song;
    isActive?: boolean;
    onClick?: (song: Song) => void;
}

export const SongCard = ({ song, isActive = false, onClick }: SongCardProps) => {
    const dispatch = useAppDispatch();
    const isFavorite = useAppSelector(state => state.favorites.favoriteIds.includes(song.id));
    const playlists = useAppSelector(state => state.favorites.playlists);

    const playlistItems: MenuProps["items"] = playlists.map(p => ({
        key: p.id,
        label: p.name,
        onClick: ({ domEvent }) => {
            domEvent.stopPropagation();
            dispatch(addToPlaylist({ playlistId: p.id, songId: song.id }));
        },
    }));

    return (
        <div className={`song-card${isActive ? " song-card--active" : ""}`} onClick={() => onClick?.(song)} data-testid={`song-card-${song.id}`}>
            <div className="song-card__cover" style={{ background: `linear-gradient(145deg, ${song.color}ee, ${song.color}55)` }}>
                <span className="song-card__cover-letter">{song.title[0]}</span>
                <div className="song-card__duration-badge">{song.duration}</div>
                <div className="song-card__play-overlay">
                    <PlayCircleOutlined className="song-card__play-icon" />
                </div>
            </div>
            <div className="song-card__info">
                <span className="song-card__title">{song.title}</span>
                <span className="song-card__artist">{song.artist}</span>
                <span className="song-card__genre">{song.genre}</span>
            </div>
            <div className="song-card__actions">
                <button
                    className={`song-card__fav-btn${isFavorite ? " song-card__fav-btn--active" : ""}`}
                    onClick={e => {
                        e.stopPropagation();
                        dispatch(toggleFavorite(song.id));
                    }}
                    data-testid={`fav-btn-${song.id}`}
                >
                    {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                </button>
                {playlists.length > 0 && (
                    <Dropdown menu={{ items: playlistItems }} trigger={["click"]}>
                        <button className="song-card__playlist-btn" onClick={e => e.stopPropagation()}>
                            <PlusOutlined />
                        </button>
                    </Dropdown>
                )}
            </div>
            {isActive && <div className="song-card__active-bar" style={{ background: song.color }} />}
        </div>
    );
};

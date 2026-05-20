import { HeartFilled, HeartOutlined, PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, message, type MenuProps } from "antd";
import { MouseEvent } from "react";
import { useAppSelector } from "../../../app/hooks";
import { Song } from "../../../services/types";
import { useAddFavoriteMutation, useRemoveFavoriteMutation, useUpdatePlaylistMutation } from "../../../services/woundedApi";
import "./style.scss";

interface SongCardProps {
    song: Song;
    isActive?: boolean;
    onClick?: (song: Song) => void;
}

export const SongCard = ({ song, isActive = false, onClick }: SongCardProps) => {
    const isFavorite = useAppSelector(state => state.favorites.favoriteIds.includes(song.id));
    const playlists = useAppSelector(state => state.favorites.playlists);
    const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
    const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
    const [updatePlaylist] = useUpdatePlaylistMutation();

    const handleFavoriteClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        try {
            if (isFavorite) {
                await removeFavorite(song.id).unwrap();
            } else {
                await addFavorite(song.id).unwrap();
            }
        } catch {
            message.error("Не удалось обновить избранное");
        }
    };

    const playlistItems: MenuProps["items"] = playlists.map(playlist => ({
        key: playlist.id,
        label: playlist.title,
        onClick: async ({ domEvent }) => {
            domEvent.stopPropagation();

            try {
                const nextTrackIds = playlist.trackIds.includes(song.id) ? playlist.trackIds : [...playlist.trackIds, song.id];

                await updatePlaylist({
                    playlistId: playlist.id,
                    title: playlist.title,
                    description: playlist.description,
                    trackIds: nextTrackIds,
                }).unwrap();
            } catch {
                message.error("Не удалось обновить плейлист");
            }
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
                    onClick={event => void handleFavoriteClick(event)}
                    data-testid={`fav-btn-${song.id}`}
                    disabled={isAddingFavorite || isRemovingFavorite}
                >
                    {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                </button>
                {playlists.length > 0 && (
                    <Dropdown menu={{ items: playlistItems }} trigger={["click"]}>
                        <button className="song-card__playlist-btn" onClick={event => event.stopPropagation()}>
                            <PlusOutlined />
                        </button>
                    </Dropdown>
                )}
            </div>
            {isActive && <div className="song-card__active-bar" style={{ background: song.color }} />}
        </div>
    );
};

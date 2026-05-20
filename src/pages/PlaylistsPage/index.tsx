import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, message } from "antd";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { playSong } from "../../app/playerSlice";
import { Song } from "../../services/types";
import { useCreatePlaylistMutation, useDeletePlaylistMutation, useGetSongsQuery, useUpdatePlaylistMutation } from "../../services/woundedApi";
import { SongSection } from "../../shared/HvostykUI/SongSection";
import "./style.scss";

export const PlaylistsPage = () => {
    const dispatch = useAppDispatch();
    const playlists = useAppSelector(state => state.favorites.playlists);
    const currentSongId = useAppSelector(state => state.player.currentSong?.id);
    const { data: songs = [], isLoading } = useGetSongsQuery();
    const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();
    const [updatePlaylist, { isLoading: isUpdating }] = useUpdatePlaylistMutation();
    const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation();

    const [createOpen, setCreateOpen] = useState(false);
    const [createName, setCreateName] = useState("");
    const [renameOpen, setRenameOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState<{ id: string; title: string; description: string } | null>(null);
    const [renameName, setRenameName] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = playlists.find(playlist => playlist.id === selectedId) ?? null;
    const selectedSongs = useMemo(() => (selected ? songs.filter(song => selected.trackIds.includes(song.id)) : []), [selected, songs]);

    const handleCreate = async () => {
        const title = createName.trim();

        if (!title) {
            return;
        }

        try {
            await createPlaylist({ title, trackIds: [] }).unwrap();
            setCreateName("");
            setCreateOpen(false);
        } catch {
            message.error("Не удалось создать плейлист");
        }
    };

    const handleRename = async () => {
        const title = renameName.trim();

        if (!renameTarget || !title) {
            return;
        }

        try {
            await updatePlaylist({
                playlistId: renameTarget.id,
                title,
                description: renameTarget.description,
            }).unwrap();
            setRenameOpen(false);
            setRenameTarget(null);
            setRenameName("");
        } catch {
            message.error("Не удалось обновить плейлист");
        }
    };

    const handleDelete = async (playlistId: string) => {
        try {
            await deletePlaylist(playlistId).unwrap();

            if (selectedId === playlistId) {
                setSelectedId(null);
            }
        } catch {
            message.error("Не удалось удалить плейлист");
        }
    };

    const handleSongClick = (song: Song) => dispatch(playSong(song));

    return (
        <div className="playlists-page">
            <div className="playlists-page__header">
                <h4 className="playlists-page__title">Плейлисты</h4>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} loading={isCreating}>
                    Создать
                </Button>
            </div>

            {playlists.length === 0 ? (
                <p className="playlists-page__empty">Плейлистов пока нет. Создай первый!</p>
            ) : (
                <div className="playlists-page__grid">
                    {playlists.map(playlist => (
                        <div
                            key={playlist.id}
                            className={`playlist-card${selectedId === playlist.id ? " playlist-card--active" : ""}`}
                            onClick={() => setSelectedId(prev => (prev === playlist.id ? null : playlist.id))}
                        >
                            <div className="playlist-card__icon">{playlist.title[0]?.toUpperCase()}</div>
                            <div className="playlist-card__info">
                                <span className="playlist-card__name">{playlist.title}</span>
                                <span className="playlist-card__count">{playlist.trackIds.length} треков</span>
                            </div>
                            <div className="playlist-card__actions">
                                <button
                                    className="playlist-card__btn"
                                    onClick={event => {
                                        event.stopPropagation();
                                        setRenameTarget(playlist);
                                        setRenameName(playlist.title);
                                        setRenameOpen(true);
                                    }}
                                >
                                    <EditOutlined />
                                </button>
                                <button
                                    className="playlist-card__btn playlist-card__btn--danger"
                                    onClick={event => {
                                        event.stopPropagation();
                                        void handleDelete(playlist.id);
                                    }}
                                    disabled={isDeleting}
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <SongSection
                    title={selected.title}
                    songs={selectedSongs}
                    currentSongId={currentSongId}
                    isLoading={isLoading}
                    emptyText="Плейлист пуст."
                    onSongClick={handleSongClick}
                />
            )}

            <Modal
                title="Новый плейлист"
                open={createOpen}
                onOk={() => void handleCreate()}
                onCancel={() => setCreateOpen(false)}
                okText="Создать"
                cancelText="Отмена"
            >
                <Input
                    placeholder="Название плейлиста"
                    value={createName}
                    onChange={event => setCreateName(event.target.value)}
                    onPressEnter={() => void handleCreate()}
                    autoFocus
                />
            </Modal>

            <Modal
                title="Переименовать"
                open={renameOpen}
                onOk={() => void handleRename()}
                onCancel={() => setRenameOpen(false)}
                okText="Сохранить"
                cancelText="Отмена"
                confirmLoading={isUpdating}
            >
                <Input
                    placeholder="Новое название"
                    value={renameName}
                    onChange={event => setRenameName(event.target.value)}
                    onPressEnter={() => void handleRename()}
                    autoFocus
                />
            </Modal>
        </div>
    );
};

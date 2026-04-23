import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import { useState } from "react";
import { createPlaylist, deletePlaylist, renamePlaylist } from "../../app/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { playSong } from "../../app/playerSlice";
import { Song } from "../../services/types";
import { useGetSongsQuery } from "../../services/woundedApi";
import { SongSection } from "../../shared/HvostykUI/SongSection";
import "./style.scss";

export const PlaylistsPage = () => {
    const dispatch = useAppDispatch();
    const playlists = useAppSelector(state => state.favorites.playlists);
    const currentSongId = useAppSelector(state => state.player.currentSong?.id);
    const { data: songs = [], isLoading } = useGetSongsQuery();

    const [createOpen, setCreateOpen] = useState(false);
    const [createName, setCreateName] = useState("");
    const [renameOpen, setRenameOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
    const [renameName, setRenameName] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = playlists.find(p => p.id === selectedId) ?? null;
    const selectedSongs = selected ? songs.filter(s => selected.songIds.includes(s.id)) : [];

    const handleCreate = () => {
        if (createName.trim()) {
            dispatch(createPlaylist(createName.trim()));
            setCreateName("");
            setCreateOpen(false);
        }
    };

    const handleRename = () => {
        if (renameTarget && renameName.trim()) {
            dispatch(renamePlaylist({ id: renameTarget.id, name: renameName.trim() }));
            setRenameOpen(false);
            setRenameTarget(null);
            setRenameName("");
        }
    };

    const handleSongClick = (song: Song) => dispatch(playSong(song));

    return (
        <div className="playlists-page">
            <div className="playlists-page__header">
                <h4 className="playlists-page__title">Плейлисты</h4>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                    Создать
                </Button>
            </div>

            {playlists.length === 0 ? (
                <p className="playlists-page__empty">Плейлистов пока нет. Создай первый!</p>
            ) : (
                <div className="playlists-page__grid">
                    {playlists.map(p => (
                        <div
                            key={p.id}
                            className={`playlist-card${selectedId === p.id ? " playlist-card--active" : ""}`}
                            onClick={() => setSelectedId(prev => (prev === p.id ? null : p.id))}
                        >
                            <div className="playlist-card__icon">{p.name[0]?.toUpperCase()}</div>
                            <div className="playlist-card__info">
                                <span className="playlist-card__name">{p.name}</span>
                                <span className="playlist-card__count">{p.songIds.length} треков</span>
                            </div>
                            <div className="playlist-card__actions">
                                <button
                                    className="playlist-card__btn"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setRenameTarget(p);
                                        setRenameName(p.name);
                                        setRenameOpen(true);
                                    }}
                                >
                                    <EditOutlined />
                                </button>
                                <button
                                    className="playlist-card__btn playlist-card__btn--danger"
                                    onClick={e => {
                                        e.stopPropagation();
                                        dispatch(deletePlaylist(p.id));
                                        if (selectedId === p.id) setSelectedId(null);
                                    }}
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
                    title={selected.name}
                    songs={selectedSongs}
                    currentSongId={currentSongId}
                    isLoading={isLoading}
                    emptyText="Плейлист пуст. Добавь треки через ♥ → + на карточке трека."
                    onSongClick={handleSongClick}
                />
            )}

            <Modal title="Новый плейлист" open={createOpen} onOk={handleCreate} onCancel={() => setCreateOpen(false)} okText="Создать" cancelText="Отмена">
                <Input
                    placeholder="Название плейлиста"
                    value={createName}
                    onChange={e => setCreateName(e.target.value)}
                    onPressEnter={handleCreate}
                    autoFocus
                />
            </Modal>

            <Modal title="Переименовать" open={renameOpen} onOk={handleRename} onCancel={() => setRenameOpen(false)} okText="Сохранить" cancelText="Отмена">
                <Input placeholder="Новое название" value={renameName} onChange={e => setRenameName(e.target.value)} onPressEnter={handleRename} autoFocus />
            </Modal>
        </div>
    );
};

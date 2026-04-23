import { PauseCircleOutlined, PlayCircleOutlined, SoundOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { Button, Slider, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setProgress, setVolume, skipNext, skipPrev, togglePlay } from "../../../app/playerSlice";
import { useGetSongsQuery } from "../../../services/woundedApi";
import "./style.scss";

export const PlayerBar = () => {
    const dispatch = useAppDispatch();
    const { currentSong, isPlaying, progress, volume } = useAppSelector(state => state.player);
    const { data: songs = [] } = useGetSongsQuery();

    return (
        <footer className="player-bar">
            <div className="player-bar__top">
                <div className="player-bar__info">
                    {currentSong ? (
                        <>
                            <div
                                className="player-bar__cover"
                                style={{ background: `linear-gradient(135deg, ${currentSong.color}cc, ${currentSong.color}44)` }}
                            >
                                {currentSong.title[0]}
                            </div>
                            <div className="player-bar__meta">
                                <span className="player-bar__song-title">{currentSong.title}</span>
                                <span className="player-bar__artist">{currentSong.artist}</span>
                            </div>
                        </>
                    ) : (
                        <span className="player-bar__empty">Выберите трек</span>
                    )}
                </div>

                <div className="player-bar__controls">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<StepBackwardOutlined />}
                        disabled={!currentSong}
                        onClick={() => dispatch(skipPrev(songs))}
                        className="player-bar__ctrl-btn"
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        disabled={!currentSong}
                        onClick={() => dispatch(togglePlay())}
                        className="player-bar__play-btn"
                    />
                    <Button
                        type="text"
                        shape="circle"
                        icon={<StepForwardOutlined />}
                        disabled={!currentSong}
                        onClick={() => dispatch(skipNext(songs))}
                        className="player-bar__ctrl-btn"
                    />
                </div>

                <div className="player-bar__volume">
                    <SoundOutlined className="player-bar__volume-icon" />
                    <Slider value={volume} onChange={val => dispatch(setVolume(val))} tooltip={{ open: false }} className="player-bar__volume-slider" />
                </div>
            </div>

            <div className="player-bar__timeline">
                <Typography.Text type="secondary" className="player-bar__time">
                    {currentSong ? "1:12" : "0:00"}
                </Typography.Text>
                <Slider
                    value={progress}
                    onChange={val => dispatch(setProgress(val))}
                    disabled={!currentSong}
                    tooltip={{ open: false }}
                    className="player-bar__slider"
                />
                <Typography.Text type="secondary" className="player-bar__time">
                    {currentSong?.duration ?? "0:00"}
                </Typography.Text>
            </div>
        </footer>
    );
};

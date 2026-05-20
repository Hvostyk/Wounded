import { MenuOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Drawer, Tooltip } from "antd";
import { useState } from "react";
import { Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { themeMode } from "../../../app/themeSlice";
import { useMediaSession } from "../../../hooks/useMediaSession";
import { useGetFavoriteSongsQuery, useGetPlaylistsQuery } from "../../../services/woundedApi";
import { Logo } from "../Logo";
import { NavItems } from "../NavItems";
import { PlayerBar } from "../PlayerBar";
import "./style.scss";

export const AppLayout = () => {
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector(state => state.theme.value);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    useMediaSession();
    useGetFavoriteSongsQuery(undefined, { skip: !isAuthenticated });
    useGetPlaylistsQuery(undefined, { skip: !isAuthenticated });
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <Logo />
                <NavItems />
            </aside>

            <header className="app-header">
                <button className="app-header__burger" onClick={() => setDrawerOpen(true)}>
                    <MenuOutlined />
                </button>
                <div className="app-header__logo">
                    <Logo size="sm" />
                </div>
                <Tooltip title={currentTheme === "dark" ? "Светлая" : "Тёмная"}>
                    <button className="app-header__theme" onClick={() => dispatch(themeMode())}>
                        {currentTheme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                    </button>
                </Tooltip>
            </header>

            <Drawer
                placement="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={260}
                styles={{ body: { padding: 0 }, header: { display: "none" } }}
            >
                <div className="app-drawer">
                    <Logo />
                    <NavItems onClose={() => setDrawerOpen(false)} />
                </div>
            </Drawer>

            <main className="app-main">
                <Outlet />
            </main>

            <PlayerBar />
        </div>
    );
};

import { HeartOutlined, HomeOutlined, LogoutOutlined, MoonOutlined, SunOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import { logout } from "../../../app/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { themeMode } from "../../../app/themeSlice";
import { useGetMyProfileQuery, woundedApi } from "../../../services/woundedApi";
import "./style.scss";

interface NavItemsProps {
    onClose?: () => void;
}

export const NavItems = ({ onClose }: NavItemsProps) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, login } = useAppSelector(state => state.auth);
    const currentTheme = useAppSelector(state => state.theme.value);
    const { data: profile } = useGetMyProfileQuery(undefined, { skip: !isAuthenticated });
    const displayName = profile?.username ?? login ?? "";

    const handleLogout = () => {
        dispatch(logout());
        dispatch(woundedApi.util.resetApiState());
    };

    return (
        <div className="nav-items">
            <div className="nav-items__user">
                <div className="nav-items__avatar">{displayName[0]?.toUpperCase()}</div>
                <span className="nav-items__name">{displayName}</span>
            </div>
            <nav className="nav-items__list">
                <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`} onClick={onClose}>
                    <HomeOutlined />
                    <span>Главная</span>
                </NavLink>
                <NavLink to="/library" className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`} onClick={onClose}>
                    <HeartOutlined />
                    <span>Библиотека</span>
                </NavLink>
                <NavLink to="/playlists" className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`} onClick={onClose}>
                    <UnorderedListOutlined />
                    <span>Плейлисты</span>
                </NavLink>
            </nav>
            <div className="nav-items__footer">
                <button className="nav-item" onClick={() => dispatch(themeMode())}>
                    {currentTheme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                    <span>{currentTheme === "dark" ? "Светлая тема" : "Тёмная тема"}</span>
                </button>
                <button className="nav-item nav-item--danger" onClick={handleLogout}>
                    <LogoutOutlined />
                    <span>Выйти</span>
                </button>
            </div>
        </div>
    );
};

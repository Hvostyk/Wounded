import { ConfigProvider, theme } from "antd";
import { useCallback, useEffect, useState } from "react";
import { SplashScreen } from "../shared/HvostykUI/SplashScreen";
import { useAppSelector } from "./hooks";
import "./reset.scss";
import { AppRoutes } from "./routes";

export const App = () => {
    const currentTheme = useAppSelector(state => state.theme.value);
    const [showSplash, setShowSplash] = useState(true);
    const handleSplashDone = useCallback(() => setShowSplash(false), []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme);
    }, [currentTheme]);

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#c2185b",
                    borderRadius: 8,
                    fontFamily: "Inter, sans-serif",
                },
            }}
        >
            {showSplash && <SplashScreen onDone={handleSplashDone} />}
            {!showSplash && <AppRoutes />}
        </ConfigProvider>
    );
};

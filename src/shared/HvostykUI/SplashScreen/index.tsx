import { useEffect, useState } from "react";
import "./style.scss";

interface SplashScreenProps {
    onDone: () => void;
}

export const SplashScreen = ({ onDone }: SplashScreenProps) => {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFading(true), 1500);
        const doneTimer = setTimeout(onDone, 1900);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [onDone]);

    return (
        <div className={`splash${fading ? " splash--out" : ""}`}>
            <div className="splash__content">
                <div className="splash__logo">W</div>
                <h1 className="splash__title">Wounded</h1>
                <p className="splash__sub">Your music, your wounds.</p>
            </div>
        </div>
    );
};

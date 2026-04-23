import "./style.scss";

interface LogoProps {
    size?: "sm" | "md";
}

export const Logo = ({ size = "md" }: LogoProps) => (
    <div className={`logo logo--${size}`}>
        <span className="logo__icon">W</span>
        <span className="logo__text">Wounded</span>
    </div>
);

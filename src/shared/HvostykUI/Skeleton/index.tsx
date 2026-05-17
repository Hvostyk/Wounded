import "./style.scss";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
}

export const Skeleton = ({ width = "100%", height = 16, borderRadius = 6, className = "" }: SkeletonProps) => (
    <div
        className={`skeleton ${className}`}
        style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
            borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        }}
    />
);

export const SongCardSkeleton = () => (
    <div className="song-card-skeleton">
        <Skeleton width="100%" height="100%" borderRadius="12px 12px 0 0" className="song-card-skeleton__cover" />
        <div className="song-card-skeleton__info">
            <Skeleton width="75%" height={14} />
            <Skeleton width="55%" height={12} />
            <Skeleton width="40%" height={11} />
        </div>
    </div>
);

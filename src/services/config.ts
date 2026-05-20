type ServiceName = "auth" | "profiles" | "music" | "streaming";

interface ServiceOrigins {
    auth: string;
    profiles: string;
    music: string;
    streaming: string;
}

declare global {
    interface Window {
        __WOUNDED_API__?: Partial<ServiceOrigins>;
    }
}

const defaultOrigins: ServiceOrigins = {
    auth: "http://localhost:7001",
    profiles: "http://localhost:7002",
    music: "http://localhost:7004",
    streaming: "http://localhost:7005",
};

const origins: ServiceOrigins = {
    ...defaultOrigins,
    ...(typeof window !== "undefined" ? window.__WOUNDED_API__ : undefined),
};

export const getServiceUrl = (service: ServiceName, path: string): string => `${origins[service]}${path}`;

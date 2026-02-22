export function isDev(): boolean {
    return process.env.NODE_ENV === "development" || process.env.APP_ENV === "development";
}

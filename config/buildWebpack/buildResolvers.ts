import { Configuration } from "webpack";
import { BuildOptions } from "./types/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function buildResolvers(options: BuildOptions): Configuration["resolve"] {
    return {
        extensions: [".tsx", ".ts", ".js"],
    };
}

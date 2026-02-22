import webpack from "webpack";
import { buildWebpack } from "./config/buildWebpack/buildWebpack";
import { BuildMode, BuildPaths } from "./config/buildWebpack/types/types";
import path from "path";

interface EnvInterface {
    mode: BuildMode;
    port: string;
}

export default (env: EnvInterface) => {
    const paths: BuildPaths = {
        output: path.resolve(__dirname, "dist-react"),
        entry: path.resolve(__dirname, "src/app", "index.tsx"),
        html: path.resolve(__dirname, "src/app", "index.html"),
    };
    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3000,
        mode: env.mode ?? "development",
        paths,
    });
    return config;
};

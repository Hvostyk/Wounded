import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration, ProgressPlugin } from "webpack";
import { BuildOptions } from "./types/types";

export function buildPlugins(options: BuildOptions): Configuration["plugins"] {
    const { mode, paths } = options;

    const plugins: Configuration["plugins"] = [new HtmlWebpackPlugin({ template: paths.html })];

    switch (mode) {
        case "development":
            plugins.push(new ProgressPlugin());
            break;

        case "production":
            plugins.push(
                new MiniCssExtractPlugin({
                    filename: "css/[name].[contenthash:8].css",
                    chunkFilename: "css/[name].[contenthash:8].css",
                }),
            );
            break;
    }

    return plugins;
}

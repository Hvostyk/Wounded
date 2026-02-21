import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            "build/**",
            "dist/**",
            "coverage/**",
            "*.min.js",
            ".eslintcache",
        ],
    },
    eslintJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintReact.configs["recommended-typescript"],
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: { prettier: eslintPluginPrettier },
        rules: {
            "@eslint-react/no-missing-key": "warn",
            "prettier/prettier": "error",
        },
    },
    eslintConfigPrettier,
);

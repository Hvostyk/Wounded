import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "node_modules/**",
            "build/**",
            "dist/**",
            "dist-react/**",
            "dist-electron",
            "coverage/**",
            "*.min.js",
            ".eslintcache",
            "jest.config.js"
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
        plugins: { 
            "unused-imports": unusedImports,
            prettier: eslintPluginPrettier 
        },
        rules: {
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "@eslint-react/no-missing-key": "warn",
            "prettier/prettier": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    "vars": "all",
                    "varsIgnorePattern": "^_",
                    "args": "after-used",
                    "argsIgnorePattern": "^_",
                },
            ]
        },
    },
    eslintConfigPrettier,
);

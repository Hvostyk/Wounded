import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { TestPage1 } from "../pages/testPage1";
import { TestPage2 } from "../pages/testPage2";
import { App } from "./App";
import { AppRoutes } from "./routes";

const root = document.getElementById("root");

if (!root) {
    throw new Error("root not found");
}

const container = createRoot(root);

container.render(
    <HashRouter>
        <StrictMode>
            <AppRoutes />
        </StrictMode>
    </HashRouter>,
);

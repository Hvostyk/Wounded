import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
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

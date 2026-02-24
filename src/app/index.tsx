import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router";
import { AppRoutes } from "./routes";
import { store } from "./store";

const root = document.getElementById("root");

if (!root) {
    throw new Error("root not found");
}

const container = createRoot(root);

container.render(
    <Provider store={store}>
        <HashRouter>
            <StrictMode>
                <AppRoutes />
            </StrictMode>
        </HashRouter>
    </Provider>,
);

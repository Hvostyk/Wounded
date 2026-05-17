import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router";
import { App } from "./App";
import { store } from "./store";

const root = document.getElementById("root");

if (!root) {
    throw new Error("root not found");
}

createRoot(root).render(
    <Provider store={store}>
        <HashRouter>
            <StrictMode>
                <App />
            </StrictMode>
        </HashRouter>
    </Provider>,
);

import { Route, Routes } from "react-router";
import { TestPage1, TestPage2 } from "../pages";
import { App } from "./App";

export const AppRoutes = () => {
    const navigationRoutes = [
        { path: "/", element: <App /> },
        { path: "test1", element: <TestPage1 /> },
        { path: "test2", element: <TestPage2 /> },
    ];
    return (
        <Routes>
            {navigationRoutes.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
